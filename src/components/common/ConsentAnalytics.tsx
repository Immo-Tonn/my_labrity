'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';
import { Analytics } from '@vercel/analytics/next';

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

// This Usercentrics account has no "services" configured — consent is
// tracked purely via Google Consent Mode categories, so UC_UI.getServicesBaseInfo()
// always returns {} even after consent is granted. Read the GCM signal
// Usercentrics writes to localStorage instead.
const hasAnalyticsConsent = () => {
  try {
    const raw = localStorage.getItem('ucData');
    if (!raw) return false;

    const { gcm } = JSON.parse(raw) as { gcm?: { analyticsStorage?: string } };
    return gcm?.analyticsStorage === 'granted';
  } catch {
    return false;
  }
};

export default function ConsentAnalytics() {
  const [consented, setConsented] = useState(false);

  useEffect(() => {
    // Usercentrics dispatches UC_UI_CMP_EVENT synchronously and only writes
    // the updated consent state to localStorage right after — reading it
    // inside the handler itself picks up the stale value. Defer to the next
    // tick so the write has landed by the time we read it.
    const checkConsent = () =>
      setTimeout(() => setConsented(hasAnalyticsConsent()), 0);

    checkConsent();

    window.addEventListener('UC_UI_INITIALIZED', checkConsent);
    window.addEventListener('UC_UI_CMP_EVENT', checkConsent);

    return () => {
      window.removeEventListener('UC_UI_INITIALIZED', checkConsent);
      window.removeEventListener('UC_UI_CMP_EVENT', checkConsent);
    };
  }, []);

  if (!consented) return null;

  return (
    <>
      <Analytics />;
      {GA_MEASUREMENT_ID && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
            strategy="afterInteractive"
          />
          <Script id="ga-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_MEASUREMENT_ID}');
            `}
          </Script>
        </>
      )}
    </>
  );
}
