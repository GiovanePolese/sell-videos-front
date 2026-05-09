import React from 'react';

export function Modal({ open, children }: { open: boolean; children: React.ReactNode }) {
  if (!open) return null;
  return <div className="fixed inset-0 z-50 bg-black/40 p-4"><div className="mx-auto max-w-lg rounded-lg bg-white p-4">{children}</div></div>;
}
