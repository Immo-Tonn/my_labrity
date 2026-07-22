'use client';

import Link from 'next/link';
import type { ComponentProps } from 'react';

import { useLanguage } from '@/utils/LanguageContext';
import { withLocale } from '@/utils/localizedPath';

type LocalizedLinkProps = ComponentProps<typeof Link>;

export function LocalizedLink({ href, ...props }: LocalizedLinkProps) {
  const { lang } = useLanguage();

  const localizedHref =
    typeof href === 'string' ? withLocale(href, lang) : href;

  return <Link href={localizedHref} {...props} />;
}
