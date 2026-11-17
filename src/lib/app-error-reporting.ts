const MAX_SERIALIZED_LENGTH = 2000;

export function reportAppError(error: unknown, context: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;

  console.error("[Homigo Care] Application error", {
    route: window.location.pathname,
    ...context,
    error: describeThrown(error),
  });
}

// Loaders can throw Responses and plain objects, which String() reduces to
// unhelpful values such as "[object Object]".
function describeThrown(error: unknown): string {
  if (error instanceof Response) {
    return `Response ${error.status}${error.url ? ` at ${error.url}` : ""}`;
  }
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  const { message } = (error ?? {}) as { message?: unknown };
  if (typeof message === "string" && message.length > 0) return message;
  try {
    return JSON.stringify(error)?.slice(0, MAX_SERIALIZED_LENGTH) ?? String(error);
  } catch {
    return String(error);
  }
}
