import React from 'react';

type Props = React.ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({ className = '', ...props }: Props) {
  return <button className={`rounded-md bg-brand-500 px-4 py-2 text-white hover:bg-brand-700 ${className}`} {...props} />;
}
