import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const dateFormatter = new Intl.DateTimeFormat("en-NG", {
  dateStyle: "medium",
  timeStyle: "short",
  hour12: true,
});

export const isIsoDate = (date: string): boolean => {
  const parsedDate = new Date(date);
  return !isNaN(parsedDate.getTime()) && date === parsedDate.toISOString();
};

export const debounce = (func: Function, wait: number) => {
  let timeout: NodeJS.Timeout;
  return (...args: any[]) => {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), wait);
  };
};

export function isOlderThanOneDay(date: Date) {
  const twentyFourHoursInMs = 24 * 60 * 60 * 1000;
  const timeDifference = new Date().getTime() - date.getTime();

  return timeDifference > twentyFourHoursInMs;
}
