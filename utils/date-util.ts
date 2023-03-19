import { format, isValid } from "date-fns"

export const formatDate = (date: Date): string | undefined => {
    return isValid(date)
        ? format(date, "E, MMM d, HH:mm")
        : format(new Date(date.toString()), "E, MMM d, HH:mm")
}

export const formatDateForInput = (date: Date): string | undefined => {
    return isValid(date) ? format(date, 'yyyy-MM-dd\'T\'HH:mm') : format(new Date(date), 'yyyy-MM-dd\'T\'HH:mm')
}

export function lastWeek() {
  const today = new Date();
  const lastWeek = new Date();
  lastWeek.setDate(today.getDate() - 7);
  return lastWeek;
}

export function todayMinus(days: number) {
  const today = new Date();
  const newDate = new Date();
  newDate.setDate(today.getDate() - days);
  return newDate;
}