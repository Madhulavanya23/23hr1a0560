const LOG_API_URL = "http://4.224.186.213/evaluation-service/logs";
let authToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJtYWRodWxhdmFueWFsYXZhbnlhNjIxQGdtYWlsLmNvbSIsImV4cCI6MTc4MjUzOTE0MSwiaWF0IjoxNzgyNTM4MjQxLCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiMjdmM2RhZDctNmUyMS00ODAwLTk2ZjMtMmU2NmYwNzYyOTJjIiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoibWFkaHUgbGF2YW55YSIsInN1YiI6ImI4MDk1ZmFhLWFhNjctNDkyMS1hZThmLWRjZmIxNTBjZjYwOSJ9LCJlbWFpbCI6Im1hZGh1bGF2YW55YWxhdmFueWE2MjFAZ21haWwuY29tIiwibmFtZSI6Im1hZGh1IGxhdmFueWEiLCJyb2xsTm8iOiIyM2hyMWFvNTYwIiwiYWNjZXNzQ29kZSI6ImFUa3licyIsImNsaWVudElEIjoiYjgwOTVmYWEtYWE2Ny00OTIxLWFlOGYtZGNmYjE1MGNmNjA5IiwiY2xpZW50U2VjcmV0IjoiWURGZlJqZmtXZU55UlZKYSJ9.h-jGtRLXRPmzHIxYEpZ7KEjHDLh7N39sp2qiyl3vSJc";
    
const VALID_STACKS = ["backend", "frontend"];
const VALID_LEVELS = ["debug", "info", "warn", "error", "fatal"];
const BACKEND_PACKAGES = ["cache","controller","cron_job","db","domain","handler","repository","route","service"];
const FRONTEND_PACKAGES = ["api","component","hook","page","state","style"];
const SHARED_PACKAGES = ["auth","config","middleware","utils"];

export function setToken(token) {
  authToken = token;
}

function validate(stack, level, pkg) {
  if (!VALID_STACKS.includes(stack)) throw new Error(`Invalid stack "${stack}"`);
  if (!VALID_LEVELS.includes(level)) throw new Error(`Invalid level "${level}"`);
  const allowed = stack === "backend"
    ? [...BACKEND_PACKAGES, ...SHARED_PACKAGES]
    : [...FRONTEND_PACKAGES, ...SHARED_PACKAGES];
  if (!allowed.includes(pkg)) throw new Error(`Invalid package "${pkg}" for stack "${stack}"`);
}

export async function Log(stack, level, pkg, message) {
  const s = String(stack).trim().toLowerCase();
  const l = String(level).trim().toLowerCase();
  const p = String(pkg).trim().toLowerCase();
  const m = String(message).trim();

  validate(s, l, p);
  if (!m) throw new Error("Log message must not be empty");

  const body = { stack: s, level: l, package: p, message: m };
  const headers = { "Content-Type": "application/json" };
  if (authToken) headers["Authorization"] = `Bearer ${authToken}`;

  try {
    const res = await fetch(LOG_API_URL, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      console.error(`[LogMiddleware] API error ${res.status}: ${errText}`);
      return null;
    }
    return await res.json();
  } catch (err) {
    console.error(`[LogMiddleware] Network error: ${err.message}`);
    return null;
  }
}
