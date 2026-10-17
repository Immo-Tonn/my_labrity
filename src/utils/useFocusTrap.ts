import { useEffect, RefObject, useRef } from 'react';

export type InitialFocus = 'first' | 'none' | number;

export interface Options {
  initialFocus?: InitialFocus;
  tabbableElems?: string;
}

const TABBABLE_ELEMS =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), area[href], form, audio[controls], video[controls], [tabindex="0"]';

const useFocusTrap = <T extends HTMLElement>(
  ref: RefObject<T>,
  isActive: boolean,
  options: Options = {},
) => {
  const { initialFocus = 'none', tabbableElems = '' } = options;

  const lastFocusedElem = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isActive) return;

    const target = ref.current;

    if (!target) return;

    lastFocusedElem.current = document.activeElement as HTMLElement | null;
    lastFocusedElem.current?.blur();

    // Re-queried on every Tab press (not captured once here) so the trap
    // keeps working if the panel's content changes while it's open — e.g.
    // async data swapping in more nav links after the initial mount would
    // otherwise leave first/last pointing at stale, no-longer-boundary
    // elements and let Tab escape into the page behind it.
    const getBoundaryElements = () => {
      const focusableElems = target.querySelectorAll(
        TABBABLE_ELEMS + tabbableElems,
      );

      if (focusableElems.length === 0) return null;

      return {
        first: focusableElems[0] as HTMLElement,
        last: focusableElems[focusableElems.length - 1] as HTMLElement,
      };
    };

    const initialBoundary = getBoundaryElements();

    if (initialBoundary) {
      if (initialFocus === 'first') {
        initialBoundary.first.focus();
      }

      if (typeof initialFocus === 'number') {
        const focusableElems = target.querySelectorAll(
          TABBABLE_ELEMS + tabbableElems,
        );

        if (initialFocus >= 0 && initialFocus < focusableElems.length) {
          (focusableElems[initialFocus] as HTMLElement).focus();
        }
      }
    }

    const handleTab = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;

      const boundary = getBoundaryElements();

      if (!boundary) return;

      const focusedElement = document.activeElement as HTMLElement;

      if (!event.shiftKey && focusedElement === boundary.last) {
        boundary.first.focus();
        event.preventDefault();
      }

      if (event.shiftKey && focusedElement === boundary.first) {
        boundary.last.focus();
        event.preventDefault();
      }
    };

    target.addEventListener('keydown', handleTab);

    return () => {
      lastFocusedElem.current?.focus();
      target.removeEventListener('keydown', handleTab);
    };
  }, [isActive, ref, initialFocus, tabbableElems]);
};

export default useFocusTrap;
