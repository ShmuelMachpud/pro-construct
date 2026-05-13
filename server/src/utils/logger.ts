const COLORS = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  cyan: "\x1b[36m",
  gray: "\x1b[90m",
};

const format = (tag: string, color: string, message: string) => {
  const date = new Date().toISOString();
  return `${color}[${tag}]${COLORS.reset} ${COLORS.gray}${date}${COLORS.reset} ${message}`;
};

export const logger = {
  info: (message: string) => console.log(format("INFO", COLORS.green, message)),
  warn: (message: string) => console.warn(format("WARN", COLORS.yellow, message)),
  error: (message: string) => console.error(format("ERROR", COLORS.red, message)),
  debug: (message: string) => console.log(format("DEBUG", COLORS.cyan, message)),
};
