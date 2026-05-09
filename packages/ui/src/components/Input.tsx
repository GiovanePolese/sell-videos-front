import React from 'react';

type Props = React.InputHTMLAttributes<HTMLInputElement>;

export function Input({ className = '', ...props }: Props) {
  return <input className={`w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500 ${className}`} {...props} />;
}
