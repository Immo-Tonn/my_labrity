'use client';

import { useEffect, useState } from 'react';
import { useLanguage } from '@/utils/LanguageContext';
import { getData } from '@/utils/getData';

type ImpressumItem = {
  _id: string;
  title: string;
  description: {
    children: {
      text: string;
    }[];
  }[];
};

export const Impressum = () => {
  const { lang } = useLanguage();
  const [items, setItems] = useState<ImpressumItem[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const data = await getData('impressum', lang);
      setItems(data);
    };

    loadData();
  }, [lang]);

  return (
    <div className="h-full overflow-y-auto pr-2 text-[#18352b]">
      <h2 className="mb-8 font-tenor text-[38px] leading-none text-[#18352b] md:text-[52px]">
        Impressum
      </h2>

      <div className="space-y-8 font-montserrat text-sm leading-7 text-[#18352b]/75 md:text-base">
        {items.map(item => (
          <div key={item._id}>
            <h3 className="mb-2 font-tenor text-2xl text-[#18352b]">
              {item.title}
            </h3>

            {item.description.map((block, index) => (
              <p key={index} className="whitespace-pre-line">
                {block.children[0]?.text || ''}
              </p>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
