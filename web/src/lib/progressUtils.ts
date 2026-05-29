import type { ApiProgressEntry } from "../services/dashboardApi";

const MONTHS_BG = ["Яну", "Фев", "Мар", "Апр", "Май", "Юни", "Юли", "Авг", "Сеп", "Окт", "Ное", "Дек"];
const DAYS_BG = ["Нед", "Пон", "Вто", "Сря", "Чет", "Пет", "Съб"];

export function sortByDate<T extends { createdAt: string }>(items: T[], direction: "asc" | "desc" = "desc"): T[] {
  return [...items].sort((a, b) => {
    const diff = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    return direction === "asc" ? diff : -diff;
  });
}

export function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getDate()} ${MONTHS_BG[d.getMonth()]} ${d.getFullYear()}`;
}

export function formatShortDate(dateStr: string): string {
  const d = new Date(dateStr);
  return `${String(d.getDate()).padStart(2, "0")}.${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export function formatDay(dateStr: string): string {
  return DAYS_BG[new Date(dateStr).getDay()];
}

export function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

export function entriesWithWeight(entries: ApiProgressEntry[]): ApiProgressEntry[] {
  return entries.filter((entry) => entry.weightKg != null);
}
