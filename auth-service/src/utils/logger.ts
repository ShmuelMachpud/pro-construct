const tag = (color: string, label: string) => `\x1b[${color}m[${label}]\x1b[0m`;

export const logger = {
  info:  (message: string) => console.log(`${tag("32", "INFO")}  ${new Date().toISOString()} ${message}`),
  warn:  (message: string) => console.warn(`${tag("33", "WARN")}  ${new Date().toISOString()} ${message}`),
  error: (message: string) => console.error(`${tag("31", "ERROR")} ${new Date().toISOString()} ${message}`),
  debug: (message: string) => console.log(`${tag("36", "DEBUG")} ${new Date().toISOString()} ${message}`),
};
