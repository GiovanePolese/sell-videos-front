import React from 'react';

export function Title({ children }: { children: React.ReactNode }) {
  return <h1 className="text-2xl font-semibold text-gray-900">{children}</h1>;
}
