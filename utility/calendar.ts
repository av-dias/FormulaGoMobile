import { DateFormat } from "@/models/basicUtils";

export interface FormattedDateTime {
  day: string; // Format: YYYY-MM-DD
  time: string; // Format: HH:MM:SS
}
export const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

// prevYearsRange is the range on how many previous years will be shown
// forwYearsRange is the range on how many forward years will be shown
export const prevYearsRange = 8;
export const calendarOffset = 0;
const forwYearsRange = 1;
const currentYear = new Date().getFullYear();
export const years = Array.from(
  {
    length:
      currentYear -
      new Date().getFullYear() +
      prevYearsRange +
      forwYearsRange +
      1,
  },
  (_, i) => currentYear - prevYearsRange + i
);
export const calendarDateRange: DateFormat[] = years
  .slice(calendarOffset)
  .flatMap((y) => months.map((m) => ({ month: m, year: y })));
export const calendarYearsRange: DateFormat[] = years
  .slice(calendarOffset)
  .map((y) => ({ month: null, year: y }));

export function getMonthsBetween(
  startMonth: number,
  startYear: number,
  endMonth: number,
  endYear: number
): number {
  return (endYear - startYear) * 12 + (endMonth - startMonth);
}

export function formatISODateToParts(
  isoDateString: string | undefined
): FormattedDateTime {
  const dateObj = new Date(isoDateString || Date.now());

  // Helper to ensure single digits are padded (e.g., 5 -> "05")
  const pad = (num: number): string => String(num).padStart(2, "0");

  // --- Date Components (YYYY-MM-DD) using UTC methods ---
  const year = dateObj.getUTCFullYear();
  // getUTCMonth is 0-indexed, so we add 1
  const month = pad(dateObj.getUTCMonth() + 1);
  const day = pad(dateObj.getUTCDate());

  const dayString = `${year}-${month}-${day}`;

  // --- Time Components (HH:MM:SS) using UTC methods ---
  const hours = pad(dateObj.getUTCHours());
  const minutes = pad(dateObj.getUTCMinutes());
  const seconds = pad(dateObj.getUTCSeconds());

  const timeString = `${hours}:${minutes}:${seconds}`;

  return {
    day: dayString,
    time: timeString,
  };
}
