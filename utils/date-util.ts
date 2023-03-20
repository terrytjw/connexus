import { format, isValid, set, sub } from "date-fns"

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
  const lastWeek = sub(today, { days: 7 })
  return setTo2359(lastWeek)
}

export function todayMinus(days: number) {
  const today = new Date();
  const newDate = sub(today, { days: days })
  return setTo2359(newDate);
}

export function yesterday() {
  return todayMinus(1)
}

export function setTo2359(date: Date) {
  return set(date, { hours: 23, minutes: 59, seconds: 59, milliseconds: 0 })
}