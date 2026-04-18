'use client';

import React, { useEffect, useState } from 'react';

import { Button } from '@/components/ui';
import { ServiceItem } from '@/components/common';

import { useLanguage } from '@/utils/LanguageContext';
import { getData } from '@/utils/getData';

import type { Service } from './types';

export function ServicesList() {
  const { lang } = useLanguage();

  const [services, setServices] = useState<Service[]>([]);
  const [common, setCommon] = useState<any>(null);

  useEffect(() => {
    const loadData = async () => {
      const servicesData = await getData('services', lang);
      const commonData = await getData('common', lang);

      setServices(servicesData);
      setCommon(commonData);
    };

    loadData();
  }, [lang]);

  if (!services || !common) return null;

  return (
    <div className="flex flex-col gap-6 xl:gap-[60px] xl:pt-[68px]">
      {services.map(service => (
        <div
          className="flex flex-col rounded-[20px] border border-white/40 bg-black/40 
p-6 backdrop-blur-sm transition-transform duration-500 ease-out
hover:-translate-y-[10px] hover:shadow-xl md:p-0 xl:flex-row xl:justify-between"
          key={service._id}
        >
          <div className="flex flex-col border-b-[1px] border-accent/20 pb-8 md:flex-row md:items-center md:justify-between md:px-8 md:pt-8 xl:flex-col xl:items-start xl:border-none xl:pb-[52px] xl:pl-[80px] xl:pt-[68px] notXL:mb-8">
            <div className="flex flex-col items-center pb-8 md:items-start xl:max-w-[303px]">
              <h3 className="section-subtitle mb-4 font-tenor text-accent">
                {service.title}
              </h3>

              <p className="text font-montserrat text-white/90">
                {service.location}
              </p>
            </div>

            <Button
              tag="a"
              accent={false}
              href={common.btnContactsHref}
              className="flex max-w-full justify-center font-normal md:max-w-[135px] xl:max-w-[147px]"
            >
              {common.buttonsText.v1}
            </Button>
          </div>

          <ul className="flex flex-col gap-5 md:px-8 md:pb-8 xl:border-l-[1px] xl:border-accent/20 xl:pb-[52px] xl:pl-10 xl:pr-[80px] xl:pt-[68px]">
            {service.card?.map((card, index) => (
              <ServiceItem key={index} card={card} />
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
