import React from 'react';
import { motion } from 'framer-motion';
import { classnames } from '@/utils/classnames';
import { EducationItemProps } from './types';

export const EducationItem: React.FC<EducationItemProps> = ({
  item,
  isLast,
}) => {
  return (
    <motion.li
      key={item.id}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false }}
      transition={{ duration: 1, delay: item.id * 0.2 }}
      className={classnames(
        'group grid grid-cols-1 gap-4 border-t border-white/20 py-6 transition md:grid-cols-[1fr_1fr] md:gap-12 md:py-8 xl:py-[42px]',
        {
          'border-b border-white/20': isLast,
        },
      )}
    >
      <h3 className="font-tenor text-xl font-medium leading-snug tracking-[0.5px] text-accent">
        {item.subTitle}
      </h3>

      <p className="font-montserrat text-sm leading-relaxed text-white/80 md:max-w-[420px] md:text-right">
        {item.description}
      </p>
    </motion.li>
  );
};
