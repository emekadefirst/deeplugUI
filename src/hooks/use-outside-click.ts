import { useEffect, useRef, useCallback } from 'react';

/**
 * Calls `handler` when a click/mousedown occurs outside `ref`.
 * Useful for closing dropdowns, popovers, etc.
 *
 * The handler is stored in a ref so the effect never re-binds
 * when the callback identity changes.
 */
export function useOutsideClick<T extends HTMLElement>(
    ref: React.RefObject<T | null>,
    handler: () => void,
) {
    const handlerRef = useRef(handler);
    handlerRef.current = handler;

    useEffect(() => {
        const listener = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                handlerRef.current();
            }
        };
        document.addEventListener('mousedown', listener);
        return () => document.removeEventListener('mousedown', listener);
    }, [ref]); // ref is stable (useRef), so this only runs once
}

/**
 * Thin wrapper that returns a memoised handler and a ref to attach
 * to the dropdown container element.
 */
export function useDropdownOutsideClick(setOpen: (v: boolean) => void) {
    const ref = useRef<HTMLDivElement>(null);
    const close = useCallback(() => setOpen(false), [setOpen]);
    useOutsideClick(ref, close);
    return ref;
}
