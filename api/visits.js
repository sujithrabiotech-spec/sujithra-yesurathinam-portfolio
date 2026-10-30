const counterKey = "portfolio-visits";

function sendJson(response, status, data, method) {
  response.statusCode = status;
  response.setHeader("Cache-Control", "no-store");
  response.setHeader("Content-Type", "application/json; charset=utf-8");
  response.setHeader("X-Content-Type-Options", "nosniff");
  response.end(method === "HEAD" ? undefined : JSON.stringify(data));
}

function getRedisConfig() {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  return url && token ? { url, token } : null;
}

async function updateVisitorCount(method, config) {
  const command = method === "POST" ? "incr" : "get";
  const response = await fetch(`${config.url.replace(/\/$/, "")}/${command}/${counterKey}`, {
    headers: { Authorization: `Bearer ${config.token}` },
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error(`Redis returned HTTP ${response.status}.`);
  }

  const data = await response.json();
  const visits = Number(data.result ?? 0);
  if (!Number.isSafeInteger(visits) || visits < 0) {
    throw new Error("Redis returned an invalid visitor total.");
  }
  return visits;
}

export default async function handler(request, response) {
  const method = request.method || "GET";
  if (method !== "GET" && method !== "HEAD" && method !== "POST") {
    response.setHeader("Allow", "GET, HEAD, POST");
    sendJson(response, 405, { error: "Method not allowed." }, method);
    return;
  }

  if (method === "POST") {
    const origin = request.headers.origin;
    const requestHost = request.headers.host;
    try {
      if (!origin || !requestHost || new URL(origin).host.toLowerCase() !== requestHost.toLowerCase()) {
        sendJson(response, 403, { error: "A same-origin request is required." }, method);
        return;
      }
    } catch (error) {
      console.error("Could not validate visitor count request origin:", error);
      sendJson(response, 403, { error: "Invalid request origin." }, method);
      return;
    }
  }

  const config = getRedisConfig();
  if (!config) {
    console.error("Visitor counter is not configured. Connect Upstash Redis or set its REST URL and token.");
    sendJson(response, 503, { error: "Visitor counter storage is not configured." }, method);
    return;
  }

  try {
    const visits = await updateVisitorCount(method, config);
    const milestone = method === "POST" && [50, 100].includes(visits) ? visits : null;
    sendJson(response, 200, { visits, milestone }, method);
  } catch (error) {
    console.error("Could not update or read visitor count:", error);
    sendJson(response, 502, { error: "Could not update visitor count." }, method);
  }
}
