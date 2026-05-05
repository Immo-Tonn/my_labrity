'use client';

import React from 'react';
import styles from './Button.module.css';
import { classnames } from '@/utils/classnames';
import { ButtonProps } from './types';

export const Button: React.FC<ButtonProps> = ({
  tag: Tag = 'a',
  children,
  href,
  target,
  rel,
  buttonType,
  onClick,
  disabled = false,
  className,
}) => {
  return (
    <Tag
      href={href}
      target={target}
      rel={rel}
      type={buttonType}
      disabled={disabled}
      onClick={onClick}
      className={classnames(styles.button, className)}
    >
      <span className={styles.label}>{children}</span>
    </Tag>
  );
};
