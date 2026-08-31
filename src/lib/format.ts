export const timeOf = (iso: string) =>
  new Date(iso).toLocaleTimeString("en-IN", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZone: "Asia/Kolkata",
  });

export const dateOf = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  });

export const dateTimeOf = (iso: string) => `${dateOf(iso)} · ${timeOf(iso)} IST`;

export const compact = (n: number) => new Intl.NumberFormat("en-IN", { notation: "compact" }).format(n);
