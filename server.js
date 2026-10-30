import { createServer } from "node:http";
import { readFile } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));
const host = process.env.HOST || "0.0.0.0";
const port = Number(process.env.PORT || 4173);
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
});

server.on("error", (error) => {
  console.error("Could not start the portfolio server:", error);
  process.exitCode = 1;
});
