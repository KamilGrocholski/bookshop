import { type WritableAtom, atom } from 'jotai'

export function atomWithToggle(
    initialValue?: boolean,
): WritableAtom<boolean, [], boolean> {
    const anAtom = atom(initialValue, (get, set, nextValue?: boolean) => {
        const update = nextValue ?? !get(anAtom)
        set(anAtom, update)
    })

    return anAtom as unknown as WritableAtom<boolean, [], boolean>
}
