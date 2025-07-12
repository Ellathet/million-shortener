import { DateTime } from "luxon";

export function getRelativeTime(date: Date | string): string {
  const now = DateTime.now();
  const inputTime = typeof date === "string" ? DateTime.fromISO(date) : DateTime.fromJSDate(date);

  const diff = now.diff(inputTime, [
    "years",
    "months",
    "days",
    "hours",
    "minutes",
    "seconds",
  ]).toObject();

  if (diff.years! >= 1) return `${Math.floor(diff.years!)}y ago`;
  if (diff.months! >= 1) return `${Math.floor(diff.months!)}mo ago`;
  if (diff.days! >= 1) return `${Math.floor(diff.days!)}d ago`;
  if (diff.hours! >= 1) return `${Math.floor(diff.hours!)}h ago`;
  if (diff.minutes! >= 1) return `${Math.floor(diff.minutes!)}m ago`;
  if (diff.seconds! >= 10) return `${Math.floor(diff.seconds!)}s ago`;

  return "Just now";
}