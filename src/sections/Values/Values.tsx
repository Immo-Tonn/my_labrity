'use client';

import React, { useEffect, useState } from 'react';

import { ValueItem } from '@/components/common';
import { ValueProps } from '@/components/common/ValueItem/types';

import { useLanguage } from '@/utils/LanguageContext';
import { getData } from '@/utils/getData';

type ValuesData = {
  title: string;
  values: ValueProps[];
};

export const Values: React.FC = () => {
  const { lang } = useLanguage();
  const [myValues, setMyValues] = useState<ValuesData | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const data = await getData('myValues', lang);
      setMyValues(data);
    };

    loadData();
  }, [lang]);

  if (!myValues) return null;

  return (
    <section className="w-full pb-10 pt-20 md:pb-[60px] md:pt-[120px] xl:pb-20 xl:pt-40">
      <div className="container">
        <div>
          <h2 className="section-title mb-10 font-tenor text-accent md:mb-12 xl:mb-[60px]">
            {myValues.title}
          </h2>

          <ul className="grid grid-cols-1 gap-8 xl:grid-cols-3">
            {myValues.values.map(value => (
              <ValueItem key={value.id} value={value} />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};
