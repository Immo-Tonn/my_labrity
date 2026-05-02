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

    const focusableElems = target.querySelectorAll(
      TABBABLE_ELEMS + tabbableElems,
    );

    const numFocusableElems = focusableElems.length;

    if (numFocusableElems === 0) return;

    const firstElement = focusableElems[0] as HTMLElement;
    const lastElement = focusableElems[numFocusableElems - 1] as HTMLElement;

    if (initialFocus === 'first') {
      firstElement.focus();
    }

    if (typeof initialFocus === 'number') {
      if (initialFocus >= 0 && initialFocus < numFocusableElems) {
        const elem = focusableElems[initialFocus] as HTMLElement;
        elem.focus();
      }
    }

    const handleTab = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;

      const focusedElement = document.activeElement as HTMLElement;

      if (!event.shiftKey && focusedElement === lastElement) {
        firstElement.focus();
        event.preventDefault();
      }

      if (event.shiftKey && focusedElement === firstElement) {
        lastElement.focus();
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
