'use client';

import { loadRemoteScript } from './loadRemoteScript';

declare global {
  interface Window {
    checkoutMfe?: {
      init: (scope: unknown) => Promise<void>;
      get: (module: string) => Promise<() => unknown>;
    };
  }
}

export async function loadRemoteModule<T = unknown>(module: string): Promise<T> {
  const remoteUrl = process.env.NEXT_PUBLIC_CHECKOUT_REMOTE_ENTRY || 'http://localhost:5173/assets/remoteEntry.js';
  await loadRemoteScript(remoteUrl);

  const container = window.checkoutMfe;
  if (!container) throw new Error('checkoutMfe container not found on window');

  await container.init({});
  const factory = await container.get(module);
  return factory() as T;
}
