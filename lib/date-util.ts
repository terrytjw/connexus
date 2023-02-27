import { format, isValid } from "date-fns"

export const formatDate = (dateOrString: Date): string | undefined => {
    return isValid(dateOrString)
        ? format(dateOrString, "E, MMM d, HH:mm")
        : format(new Date(dateOrString.toString()), "E, MMM d, HH:mm")
}