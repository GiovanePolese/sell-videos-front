'use client';
import dynamic from 'next/dynamic';
import React from 'react';
import { loadRemoteModule } from '../../lib/mfe/loadRemoteModule';

const RemotePixImpl = React.lazy(async () => {
  const mod = await loadRemoteModule<{ default: React.ComponentType<any> }>('./PixCheckoutFlow');
  return { default: mod.default };
});

function RemotePixClient() {
  return (
    <React.Suspense fallback={<div>Carregando PIX...</div>}>
      <RemotePixImpl />
    </React.Suspense>
  );
}

export const RemotePixCheckoutFlow = dynamic(() => Promise.resolve(RemotePixClient), { ssr: false });
