import { format, isValid } from "date-fns"

export const formatDate = (date: Date): string | undefined => {
    return isValid(date)
        ? format(date, "E, MMM d, HH:mm")
        : format(new Date(date.toString()), "E, MMM d, HH:mm")
}

export const formatDateForInput = (date: Date): string | undefined => {
    return isValid(date) ? format(date, 'yyyy-MM-dd\'T\'HH:mm') : format(new Date(date), 'yyyy-MM-dd\'T\'HH:mm')
}