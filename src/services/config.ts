/**
 * Runtime data-source configuration.
 *
 * Today every read resolves against the in-memory mock layer. When the FastAPI
 * backend exists, set VITE_API_BASE_URL / VITE_WS_URL and flip `dataSource` to
 * "live" — no visual component needs to change.
 */
export const apiConfig = {
  dataSource: (import.meta.env["VITE_DATA_SOURCE"] as "mock" | "live") ?? "mock",
  baseUrl: (import.meta.env["VITE_API_BASE_URL"] as string) ?? "/api",
  wsUrl: (import.meta.env["VITE_WS_URL"] as string) ?? "",
  latencyMs: 240,
};

export const isMock = () => apiConfig.dataSource !== "live";

export function delay<T>(value: T, ms = apiConfig.latencyMs): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

export async function httpGet<T>(path: string): Promise<T> {
  const res = await fetch(`${apiConfig.baseUrl}${path}`, {
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return (await res.json()) as T;
}

export async function httpPost<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${apiConfig.baseUrl}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return (await res.json()) as T;
}
