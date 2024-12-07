import React from 'react';

interface LinkProps {
  href: string;
  icon: React.ReactNode;
}

export function Link({ href, icon }: LinkProps) {
  return (
    <a
      href={href}
      className="text-gray-500 hover:text-indigo-600 transition-colors duration-200"
    >
      {icon}
    </a>
  );
}