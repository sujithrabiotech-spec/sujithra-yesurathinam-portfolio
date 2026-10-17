import { createServer } from "node:http";
import { mkdir, readFile as readFileAsync, writeFile } from "node:fs/promises";
import { readFile } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));
const host = process.env.HOST || "0.0.0.0";
const port = Number(process.env.PORT || 4173);
const liveCounterEnabled = process.argv.includes("--live");
const visitorCountPath = process.env.VISITOR_COUNT_FILE || path.join(root, ".portfolio-data", "visits.json");
let visitorWriteQueue = Promise.resolve();
let visitorCount = 0;
let visitorCountReady;
const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
};

async function readVisitorCount() {
  try {
    const content = await readFileAsync(visitorCountPath, "utf8");
    const record = JSON.parse(content);
    if (!Number.isSafeInteger(record.visits) || record.visits < 0) {
      throw new Error("Visitor count data must contain a non-negative integer.");
    }
    return record.visits;
  } catch (error) {
    if (error.code === "ENOENT") return 0;
    throw error;
  }
}

visitorCountReady = liveCounterEnabled
  ? readVisitorCount().then((visits) => {
    visitorCount = visits;
  }).catch((error) => {
    console.error("Could not initialize visitor count:", error);
    throw error;
  })
  : Promise.resolve();

function serializeVisitorOperation(operation) {
  const result = visitorWriteQueue.then(async () => {
    await visitorCountReady;
    return operation();
  });
  const operationForQueue = result.then(() => undefined, () => undefined);
  visitorWriteQueue = operationForQueue;
  return result;
}

function getVisitorCount() {
  return serializeVisitorOperation(() => visitorCount);
}

function incrementVisitorCount() {
  return serializeVisitorOperation(async () => {
    const nextCount = visitorCount + 1;
    await mkdir(path.dirname(visitorCountPath), { recursive: true });
    await writeFile(visitorCountPath, JSON.stringify({ visits: nextCount }), "utf8");
    visitorCount = nextCount;
    return visitorCount;
  });
}

function isPublicRequest(request) {
  if (!liveCounterEnabled || !request.headers.host) return false;
  let hostname;
  try {
    hostname = new URL(`http://${request.headers.host}`).hostname.toLowerCase().replace(/^\[|\]$/g, "");
  } catch (error) {
    console.error("Could not determine visitor counter request host:", error);
    return false;
  }
  if (hostname === "localhost" || hostname.endsWith(".localhost") || hostname === "::1" || hostname === "0.0.0.0") return false;
  if (/^127\./.test(hostname) || /^10\./.test(hostname) || /^192\.168\./.test(hostname)) return false;
  if (/^172\.(1[6-9]|2\d|3[01])\./.test(hostname)) return false;
  return true;
}

const server = createServer((request, response) => {
  let requestedPath;
  try {
    requestedPath = decodeURIComponent(new URL(request.url, `http://${request.headers.host}`).pathname);
  } catch (error) {
    console.error("Could not parse request URL:", error);
    response.writeHead(400);
    response.end("Invalid request URL");
    return;
  }

  if (requestedPath === "/api/visits") {
    if (request.method !== "GET" && request.method !== "HEAD" && request.method !== "POST") {
      response.writeHead(405, { Allow: "GET, HEAD, POST" });
      response.end("Method not allowed");
      return;
    }
    const publicRequest = isPublicRequest(request);
    if (request.method === "POST" && publicRequest) {
      const origin = request.headers.origin;
      const requestHost = request.headers.host;
      try {
        if (!origin || !requestHost || new URL(origin).host !== requestHost) {
          response.writeHead(403);
          response.end("A same-origin request is required to update the live visitor count.");
          return;
        }
      } catch (error) {
        console.error("Could not validate visitor count request origin:", error);
        response.writeHead(403);
        response.end("Invalid visitor count request origin.");
        return;
      }
    }

    const getCount = publicRequest
      ? request.method === "POST" ? incrementVisitorCount() : getVisitorCount()
      : Promise.resolve(0);
    getCount.then((visits) => {
      response.writeHead(200, {
        "Cache-Control": "no-store",
        "Content-Type": "application/json; charset=utf-8",
        "X-Content-Type-Options": "nosniff",
      });
      response.end(request.method === "HEAD" ? undefined : JSON.stringify({ visits }));
    }).catch((error) => {
      console.error("Could not update or read visitor count:", error);
      if (!response.headersSent) response.writeHead(500);
      response.end("Could not update visitor count.");
    });
    return;
  }

  if (request.method !== "GET" && request.method !== "HEAD") {
    response.writeHead(405, { Allow: "GET, HEAD" });
    response.end("Method not allowed");
    return;
  }

  const resolvedPath = path.resolve(root, `.${requestedPath === "/" ? "/index.html" : requestedPath}`);
  if (resolvedPath !== root && !resolvedPath.startsWith(`${root}${path.sep}`)) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }

  readFile(resolvedPath, (error, content) => {
    if (error) {
      if (error.code !== "ENOENT" && error.code !== "ENOTDIR") {
        console.error(`Could not read ${resolvedPath}:`, error);
      }
      response.writeHead(error.code === "ENOENT" || error.code === "ENOTDIR" ? 404 : 500);
      response.end(error.code === "ENOENT" || error.code === "ENOTDIR" ? "Not found" : "Could not read file");
      return;
    }

    response.writeHead(200, {
      "Cache-Control": "no-cache",
      "Content-Type": contentTypes[path.extname(resolvedPath).toLowerCase()] || "application/octet-stream",
      "X-Content-Type-Options": "nosniff",
    });
    response.end(request.method === "HEAD" ? undefined : content);
  });
});

server.listen(port, host, () => {
  const displayHost = host === "0.0.0.0" ? "127.0.0.1" : host;
  console.log(`Portfolio available at http://${displayHost}:${port}`);
  console.log(`Live visitor counting is ${liveCounterEnabled ? "enabled for public hosts" : "disabled (development mode)"}.`);
});

server.on("error", (error) => {
  console.error("Could not start the portfolio server:", error);
  process.exitCode = 1;
});
