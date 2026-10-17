'use client';

import { useEffect } from 'react';

import { prefetchFormToken } from '@/api/telegram';

// Invisible anti-bot helpers for a form: an off-screen honeypot input that
// people never see or fill, plus an early fetch of the signed form token.
export const FormGuard = () => {
  useEffect(() => {
    prefetchFormToken();
  }, []);

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        left: '-10000px',
        top: 'auto',
        width: 1,
        height: 1,
        overflow: 'hidden',
      }}
    >
      <label>
        Website
        <input
          type="text"
          name="website"
          data-hp
          tabIndex={-1}
          autoComplete="off"
          defaultValue=""
        />
      </label>
    </div>
  );
};
