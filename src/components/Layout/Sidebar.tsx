import Link from 'next/link';
import React, { memo } from 'react';
import { useRouter } from 'next/router';
import { HomeIcon, UserIcon, ChatIcon } from '@heroicons/react/solid';
import cc from 'classcat';
const links = [
  {
    pathName: 'DASHBOARD',
    href: '/dashboard',
    icon: <HomeIcon className="w-8 h-8" />,
  },
  {
    pathName: 'PROFILE',
    href: '/profile',
    icon: <UserIcon className="w-8 h-8" />,
  },
  {
    pathName: 'MESSAGES',
    href: '/messages',
    icon: <ChatIcon className="w-8 h-8" />,
  },
];

export const Sidebar = memo(() => {
  const router = useRouter();
  console.log(router);

  return (
    <nav className="group fixed py-8 flex flex-col items-center hover:items-baseline md:items-baseline top-14 left-0 w-14 hover:w-64 md:w-64 bg-yellow-300 rounded-r-2xl h-full transition-all duration-300 border-none z-10 sidebar">
      {links.map((link) => {
        return (
          <Link key={link.href} href={link.href}>
            <a
              className={cc([
                'w-full flex flex-col md:flex-row group-hover:flex-row group-hover:w-full py-2 hover:bg-gray-800 hover:text-yellow-300 duration-200 font-bold text-xl group-hover:flex md:flex md:pl-3 group-hover:pl-3 items-center',
                router.asPath.match(link.href)
                  ? 'bg-gray-800 text-yellow-300'
                  : null,
              ])}>
              <div className="w-8">{link.icon}</div>
              <p className="hidden md:block ml-2 group-hover:block">
                {link.pathName}
              </p>
            </a>
          </Link>
        );
      })}
    </nav>
  );
});
