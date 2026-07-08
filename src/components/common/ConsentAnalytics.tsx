'use client';

import { useEffect, useState } from 'react';
import { Analytics } from '@vercel/analytics/next';

declare global {
  interface Window {
    UC_UI?: {
      getServicesBaseInfo: () => Array<{
        name: string;
        consent: { status: boolean };
      }>;
    };
  }
}

// Matches the Usercentrics service name/category configured in the CMP
// dashboard for Vercel Analytics — update the regex if that name changes.
const hasAnalyticsConsent = () =>
  (window.UC_UI?.getServicesBaseInfo() ?? []).some(
    service =>
      /vercel|analytics|measurement/i.test(service.name) &&
      service.consent.status,
  );

export default function ConsentAnalytics() {
  const [consented, setConsented] = useState(false);

  useEffect(() => {
    const checkConsent = () => setConsented(hasAnalyticsConsent());

    checkConsent();

    window.addEventListener('UC_UI_INITIALIZED', checkConsent);
    window.addEventListener('UC_UI_CMP_EVENT', checkConsent);

    return () => {
      window.removeEventListener('UC_UI_INITIALIZED', checkConsent);
      window.removeEventListener('UC_UI_CMP_EVENT', checkConsent);
    };
  }, []);

  if (!consented) return null;

  return <Analytics />;
}
