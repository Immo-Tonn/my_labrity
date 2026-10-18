'use client';

import { useId, useState } from 'react';
import { Plus } from 'lucide-react';

export type AccordionItem = { title: string; description: string };

type AccordionProps = {
  items: AccordionItem[];
  /** Index that is open on first render; null = all closed. */
  defaultOpen?: number | null;
  className?: string;
};

// Minimal single-open accordion: one full-width button per row (>=64px tall
// tap target), animated grid-rows height transition (no JS measuring), real
// <button aria-expanded aria-controls> + labelled region for assistive tech.
// Respects reduced motion through the global MotionConfig/CSS rules.
export function Accordion({
  items,
  defaultOpen = 0,
  className = '',
}: AccordionProps) {
  const baseId = useId();
  const [openIndex, setOpenIndex] = useState<number | null>(defaultOpen);

  return (
    <div className={`border-b border-white/15 ${className}`}>
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        const buttonId = `${baseId}-btn-${index}`;
        const panelId = `${baseId}-panel-${index}`;

        return (
          <div key={item.title} className="border-t border-white/15">
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="group flex min-h-[64px] w-full items-center justify-between gap-6 py-4 text-left transition-colors duration-300 hover:text-white md:min-h-[76px]"
              >
                <span
                  className={`font-tenor text-[20px] leading-[1.25] transition-colors duration-300 md:text-[26px] ${
                    isOpen
                      ? 'text-white'
                      : 'text-white/80 group-hover:text-white'
                  }`}
                >
                  {item.title}
                </span>
                <span
                  aria-hidden="true"
                  className={`flex h-10 w-10 shrink-0 items-center justify-center border transition-all duration-300 ${
                    isOpen
                      ? 'border-white bg-white text-black'
                      : 'border-white/25 text-white group-hover:border-white'
                  }`}
                >
                  <Plus
                    size={18}
                    strokeWidth={1.5}
                    className={`transition-transform duration-300 ${
                      isOpen ? 'rotate-45' : ''
                    }`}
                  />
                </span>
              </button>
            </h3>

            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              className={`grid transition-[grid-template-rows,opacity] duration-500 ease-out ${
                isOpen
                  ? 'grid-rows-[1fr] opacity-100'
                  : 'grid-rows-[0fr] opacity-0'
              }`}
            >
              <div className="overflow-hidden">
                <p className="max-w-[640px] pb-7 pr-14 font-montserrat text-[15px] leading-8 text-white/70 md:text-[16px]">
                  {item.description}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
