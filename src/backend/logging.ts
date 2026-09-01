const SECRET_KEY = /password|secret|token|authorization|cookie|service.?role|notes|job.?description/i;

function redact(value: unknown, seen = new WeakSet<object>()): unknown {
  if (!value || typeof value !== "object") return value;
  if (seen.has(value)) return "[Circular]";
  seen.add(value);
  if (Array.isArray(value)) return value.map((item) => redact(item, seen));
  return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, SECRET_KEY.test(key) ? "[REDACTED]" : redact(item, seen)]));
}

export function logBackendError(operation: string, error: unknown, context: Record<string, unknown> = {}) {
  const details = error instanceof Error ? { name: error.name, message: error.message, cause: error.cause } : { error };
  console.error(JSON.stringify(redact({ level: "error", operation, ...context, ...details, timestamp: new Date().toISOString() })));
}
export { redact as redactLogData };
