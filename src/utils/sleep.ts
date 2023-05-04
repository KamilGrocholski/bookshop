export default function sleep(timeInMs: number) {
    return new Promise((res) => setTimeout(res, timeInMs))
}
