'use client';
import dynamic from 'next/dynamic';
import React from 'react';
import { loadRemoteModule } from '../../lib/mfe/loadRemoteModule';

const RemoteCartImpl = React.lazy(async () => {
  const mod = await loadRemoteModule<{ default: React.ComponentType }>('./CartPage');
  return { default: mod.default };
});

function RemoteCartClient() {
  return (
    <React.Suspense fallback={<div>Carregando carrinho...</div>}>
      <RemoteCartImpl />
    </React.Suspense>
  );
}

export const RemoteCart = dynamic(() => Promise.resolve(RemoteCartClient), { ssr: false });
