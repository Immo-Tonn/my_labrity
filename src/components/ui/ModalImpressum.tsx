'use client';

import React, { useEffect, useState } from 'react';
import { Impressum } from '@/components/common/Impressum';
import { classnames } from '@/utils/classnames';
import { Modal } from '@/components/ui';

interface ModalImpressumProps {
  nameBtn: string;
}

export const ModalImpressum: React.FC<ModalImpressumProps> = ({ nameBtn }) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const btnClasses = classnames(
    'block cursor-pointer font-montserrat font-normal transition text-text hover:text-accent',
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={btnClasses}
      >
        {nameBtn}
      </button>

      {isOpen && (
        <Modal
          onClose={() => setIsOpen(false)}
          className="top-[32px] h-[576px] px-6 py-12 md:h-[650px] md:w-[704px] md:p-12 xl:top-[80px] xl:h-[680px] xl:w-[1216px] xl:p-16"
        >
          <Impressum />
        </Modal>
      )}
    </>
  );
};
