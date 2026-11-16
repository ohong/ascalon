export function localToday() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

export function dayNumber(date: string) {
  const [year, month, day] = date.split("-").map(Number);
  return Date.UTC(year, month - 1, day) / 86400000;
}

export function dateString(day: number) {
  const date = new Date(day * 86400000);
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}-${String(date.getUTCDate()).padStart(2, "0")}`;
}

export function formatDate(date: string, options: Intl.DateTimeFormatOptions) {
  return new Date(dayNumber(date) * 86400000).toLocaleDateString("en-US", { ...options, timeZone: "UTC" });
}
