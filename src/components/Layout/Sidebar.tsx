import React from 'react';
import Link from 'next/link';
import { links } from 'src/components/Layout/layoutInfo';

export const Sidebar = () => {
  return (
    <nav>
      {links.map((link) => {
        return (
          <Link key={link.href} href={link.href}>
            <a>{link.pathName}</a>
          </Link>
        );
      })}
    </nav>
  );
};
