import { Log } from "affordmed-logging-middleware";

const API_BASE = "http://4.224.186.213/evaluation-service";
const AUTH_TOKEN ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJtYWRodWxhdmFueWFsYXZhbnlhNjIxQGdtYWlsLmNvbSIsImV4cCI6MTc4MjUzOTE0MSwiaWF0IjoxNzgyNTM4MjQxLCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiMjdmM2RhZDctNmUyMS00ODAwLTk2ZjMtMmU2NmYwNzYyOTJjIiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoibWFkaHUgbGF2YW55YSIsInN1YiI6ImI4MDk1ZmFhLWFhNjctNDkyMS1hZThmLWRjZmIxNTBjZjYwOSJ9LCJlbWFpbCI6Im1hZGh1bGF2YW55YWxhdmFueWE2MjFAZ21haWwuY29tIiwibmFtZSI6Im1hZGh1IGxhdmFueWEiLCJyb2xsTm8iOiIyM2hyMWFvNTYwIiwiYWNjZXNzQ29kZSI6ImFUa3licyIsImNsaWVudElEIjoiYjgwOTVmYWEtYWE2Ny00OTIxLWFlOGYtZGNmYjE1MGNmNjA5IiwiY2xpZW50U2VjcmV0IjoiWURGZlJqZmtXZU55UlZKYSJ9.h-jGtRLXRPmzHIxYEpZ7KEjHDLh7N39sp2qiyl3vSJc";

export async function fetchNotifications({ limit = 20, page = 1, notification_type } = {}) {
  await Log("frontend", "info", "api", `Fetching: limit=${limit}, page=${page}, type=${notification_type || "all"}`);
  try {
    let url = `${API_BASE}/notifications?limit=${limit}&page=${page}`;
    if (notification_type) url += `&notification_type=${notification_type}`;

    const res = await fetch(url, {
      headers: { "Authorization": `Bearer ${AUTH_TOKEN}` },
    });

    if (!res.ok) {
      await Log("frontend", "error", "api", `Status ${res.status}`);
      throw new Error(`API error: ${res.status}`);
    }

    const data = await res.json();
    const notifications = data.notifications || [];
    await Log("frontend", "info", "api", `Got ${notifications.length} notifications`);
    return notifications;
  } catch (err) {
    await Log("frontend", "error", "api", `Fetch failed: ${err.message}`);
    throw err;
  }
}
