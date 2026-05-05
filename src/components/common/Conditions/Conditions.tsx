'use client';

import { useEffect, useState } from 'react';
import type { Condition } from './types';
import styles from './Conditions.module.css';
import { classnames } from '@/utils/classnames';
import { useLanguage } from '@/utils/LanguageContext';
import { getData } from '@/utils/getData';

export const Conditions = () => {
  const { lang } = useLanguage();
  const [conditions, setConditions] = useState<Condition[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const data = await getData('privacy', lang);
      setConditions(data);
    };

    loadData();
  }, [lang]);

  const conditionsClasses = classnames(
    styles.conditions,
    'scrollbar-thin scrollbar-thumb-[#18352b] scrollbar-track-[#e7e2d9]',
    'overflow-y-scroll prose max-w-full font-normal text-[#18352b]',
  );

  return (
    <div className={conditionsClasses}>
      {conditions.map(item => (
        <div key={item._id} className="mb-6">
          <h3 className="font-tenor text-xl font-semibold text-[#18352b]">
            {item.title}
          </h3>

          {Array.isArray(item.description) && item.description.length > 0 && (
            <div className="mt-2 font-montserrat text-sm leading-7 text-[#18352b]/75">
              {item.description.map((block, index) => (
                <p key={index}>
                  {Array.isArray(block.children) && block.children.length > 0
                    ? block.children[0].text || ''
                    : ''}
                </p>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
