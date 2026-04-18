import React from 'react';
import { motion } from 'framer-motion';

import { AboutServiceProps, AboutService } from './types';

export const AboutList: React.FC<AboutServiceProps> = ({ aboutServices }) => {
  return (
    <ul className="flex flex-col gap-5 xl:gap-7">
      {aboutServices.map((service: AboutService) => {
        return (
          <motion.li
            key={service.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 1, delay: service.id * 0.25 }}
            className="relative ml-[45px] flex max-w-full flex-col before:absolute before:left-[-43px] before:top-0 before:h-6 before:w-6 before:content-arrow md:ml-11 md:max-w-[396px] xl:max-w-[488px]"
          >
            <p className="text font-montserrat font-normal text-white/90">
              <span className="font-semibold text-accent">
                {service.description1}
              </span>
              {service.description2}
            </p>
          </motion.li>
        );
      })}
    </ul>
  );
};
