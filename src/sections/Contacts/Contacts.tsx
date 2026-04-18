'use client';

import { useEffect, useState } from 'react';

import { Form } from '@/components/common';
import { Socials } from '@/components/ui';

import IconLocation from '@/../public/icons/address.svg';
import IconPhone from '@/../public/icons/phone.svg';
import IconMail from '@/../public/icons/mail.svg';

import { useLanguage } from '@/utils/LanguageContext';
import { getData } from '@/utils/getData';

export const Contacts = () => {
  const { lang } = useLanguage();

  const [data, setData] = useState<any>(null);
  const [links, setLinks] = useState<any>(null);

  useEffect(() => {
    const loadData = async () => {
      const contactsData = await getData('contacts', lang);
      const linksData = await getData('linkContact', lang);

      setData(contactsData);
      setLinks(linksData);
    };

    loadData();
  }, [lang]);

  if (!data || !links) return null;

  return (
    <section
      id="contacts"
      className="relative w-full bg-[#221c18] bg-gradient-to-b from-[#4a3d34] via-[#2a211b] to-[#1a130f] pb-10 pt-20 md:pb-[50px] md:pt-[100px] xl:py-[120px]"
    >
      {/* GOLD SHIMMER LINE */}
      <div className="absolute left-0 top-0 h-[2px] w-full overflow-hidden bg-[#8c6a1a]">
        <div className="shimmer"></div>
      </div>

      <div className="container xl:flex xl:flex-row-reverse xl:justify-between">
        {/* заголовок mobile / tablet */}
        <h2 className="section-title font-tenor text-accent md:text-start xl:hidden smOnly:mb-10 mdOnly:mb-12">
          {data.contactsTitle}
        </h2>

        {/* форма */}
        <Form />

        {/* контактная информация */}
        <div className="flex flex-col items-center md:items-start smOnly:mt-10 mdOnly:mt-[50px] notXL:gap-8">
          {/* заголовок desktop */}
          <h2 className="section-title mb-6 text-start font-tenor text-accent notXL:hidden">
            {data.contactsTitle}
          </h2>

          <div className="md:flex md:gap-4 xl:mb-16 xl:flex-col">
            <p className="text flex items-center gap-2 font-montserrat text-white xl:mb-6 smOnly:mb-4">
              <IconLocation width={20} height={20} />
              {data.location.label}
            </p>

            <ul className="flex flex-col gap-4 md:flex-row md:items-center">
              {links.map((item: any) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className="text flex items-center gap-2 font-montserrat text-white transition hover:text-accent focus-visible:text-accent"
                  >
                    {item.name === 'phone' && (
                      <IconPhone width={20} height={20} />
                    )}

                    {item.name === 'mail' && (
                      <IconMail width={20} height={20} />
                    )}

                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <Socials />
        </div>
      </div>
    </section>
  );
};
