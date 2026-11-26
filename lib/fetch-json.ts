/**
 * Minimal typed JSON fetch helper (replaces axios).
 * Throws HttpError for non-2xx responses so callers can branch on status.
 */
export class HttpError<TBody = unknown> extends Error {
  constructor(
    public readonly status: number,
    public readonly body: TBody | null,
    message?: string,
  ) {
    super(message ?? `Request failed with status ${status}`);
    this.name = "HttpError";
  }
}

type FetchJsonOptions = Omit<RequestInit, "body"> & {
  /** Plain object is JSON-encoded automatically. */
  json?: unknown;
  /** Abort after this many milliseconds. */
  timeoutMs?: number;
};

export async function fetchJson<TResponse, TErrorBody = unknown>(
  url: string,
  { json, timeoutMs, headers, ...init }: FetchJsonOptions = {},
): Promise<TResponse> {
  const res = await fetch(url, {
    ...init,
    method: init.method ?? (json !== undefined ? "POST" : "GET"),
    headers: {
      ...(json !== undefined && { "Content-Type": "application/json" }),
      ...headers,
    },
    body: json !== undefined ? JSON.stringify(json) : undefined,
    signal: init.signal ?? (timeoutMs ? AbortSignal.timeout(timeoutMs) : undefined),
  });

  const text = await res.text();
  const data = text ? JSON.parse(text) : null;

  if (!res.ok) throw new HttpError<TErrorBody>(res.status, data);
  return data as TResponse;
}

export const isTimeoutError = (err: unknown) =>
  err instanceof DOMException &&
  (err.name === "TimeoutError" || err.name === "AbortError");
