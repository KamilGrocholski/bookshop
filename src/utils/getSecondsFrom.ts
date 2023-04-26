export const TIME_UNITS = {
    MINUTE: 60,
    HOUR: 60 * 60,
    DAY: 24 * 60 * 60,
    WEEK: 7 * 24 * 60 * 60,
} as const

export type GetSecondsFromParams = {
    unit: keyof typeof TIME_UNITS
    value: number
}

export default function getSecondsFrom(params: GetSecondsFromParams): number {
    const { unit, value } = params

    const result = value * TIME_UNITS[unit]

    return result
}
