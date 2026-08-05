export type LogLevel = "debug" | "info" | "warn" | "error";

export type LogFields = {
  service: string;
  environment: string;
  message: string;
  level?: LogLevel;
  traceId?: string;
  spanId?: string;
  requestId?: string;
  [key: string]: unknown;
};

export function createLogger(defaults: {
  service: string;
  environment: string;
}) {
  return {
    log(fields: Omit<LogFields, "service" | "environment"> & Partial<LogFields>) {
      const entry = {
        timestamp: new Date().toISOString(),
        level: fields.level ?? "info",
        service: defaults.service,
        environment: defaults.environment,
        ...fields,
      };
      const line = JSON.stringify(entry);
      if (entry.level === "error") {
        console.error(line);
      } else if (entry.level === "warn") {
        console.warn(line);
      } else {
        console.log(line);
      }
    },
  };
}

/** Phase 0 stub — full OTEL wiring arrives in Phase 5. */
export function initTelemetry(serviceName: string): void {
  void serviceName;
}
