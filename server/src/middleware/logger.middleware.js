const MUTATING_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);
const SENSITIVE_KEYS = new Set([
  "password",
  "passwordHash",
  "token",
  "accessToken",
  "refreshToken",
  "authorization",
  "cookie",
]);
const formatLog = (log) => JSON.stringify(log, null, 2);

function sanitize(value) {
  if (Array.isArray(value)) {
    return value.map(sanitize);
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, nestedValue]) => [
        key,
        SENSITIVE_KEYS.has(key) ? "[REDACTED]" : sanitize(nestedValue),
      ]),
    );
  }

  return value;
}

function logger(req, res, next) {
  const startedAt = Date.now();

  res.on("finish", () => {
    const log = {
      timestamp: new Date().toISOString(),
      method: req.method,
      path: req.originalUrl,
      status: res.statusCode,
      durationMs: Date.now() - startedAt,
    };

    if (MUTATING_METHODS.has(req.method)) {
      log.change = {
        body: sanitize(req.body),
      };
    }

    if (res.statusCode >= 400) {
      log.error = true;
      if (res.locals.error) {
        log.errorDetails = res.locals.error;
      }
      console.error(formatLog(log));
      return;
    }

    console.log(formatLog(log));
  });

  next();
}

module.exports = logger;
