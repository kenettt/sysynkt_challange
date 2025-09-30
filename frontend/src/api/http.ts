const BASE_URL = import.meta.env.VITE_API_URL ?? "";

export async function http<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
    ...init,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `HTTP ${res.status}`);
  }

  // 204 No Content
  if (res.status === 204) {
    return undefined as T;
  }

  const contentType = res.headers.get("content-type") || "";
  const text = await res.text(); // loe üks kord

  if (!text) {
    // tühi body (nt 205 või server ei saatnud midagi)
    return undefined as T;
  }

  if (contentType.includes("application/json")) {
    try {
      return JSON.parse(text) as T;
    } catch {
      // fallback - kui server saadab vale content-type'i
      return text as unknown as T;
    }
  }

  // mitte-JSON vastused
  return text as unknown as T;
}
