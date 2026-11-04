'use client';

import { useSyncExternalStore } from 'react';

// Pause state of the site-wide background video, shared between the video
// layer and the footer control and remembered in localStorage.
const KEY = 'labrity-bg-video-paused';
const EVENT = 'labrity-bg-video-change';

const read = () => {
  try {
    return window.localStorage.getItem(KEY) === '1';
  } catch {
    return false;
  }
};

const subscribe = (callback: () => void) => {
  window.addEventListener(EVENT, callback);
  window.addEventListener('storage', callback);

  return () => {
    window.removeEventListener(EVENT, callback);
    window.removeEventListener('storage', callback);
  };
};

export const useBgVideoPaused = () =>
  useSyncExternalStore(subscribe, read, () => false);

export const setBgVideoPaused = (paused: boolean) => {
  try {
    window.localStorage.setItem(KEY, paused ? '1' : '0');
  } catch {
    // Storage can be unavailable; the event below still updates this tab.
  }
  window.dispatchEvent(new Event(EVENT));
};
