/* eslint-disable react/display-name */
import { ChatIcon, HomeIcon, UserIcon } from '@heroicons/react/solid';
import cc from 'classcat';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { memo } from 'react';

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

  return (
    <nav className="group hidden sm:flex fixed top-14 left-0 z-20 flex-col items-center hover:items-baseline md:items-baseline py-8 w-14 hover:w-64 md:w-64 h-full bg-yellow-300 border-none transition-all duration-300">
      {links.map((link) => {
        return (
          <Link key={link.href} href={link.href}>
            <a
              className={cc([
                'w-full flex flex-col md:flex-row group-hover:flex-row group-hover:w-full py-2 bg-yellow-300 hover:bg-white text-white hover:text-blue-400 duration-200 font-bold text-xl group-hover:flex md:flex md:pl-3 group-hover:pl-3 items-center',
                router.asPath.match(link.href)
                  ? 'bg-white text-blue-400'
                  : null,
              ])}>
              <div className="w-8">{link.icon}</div>
              <p className="hidden group-hover:block md:block ml-2">
                {link.pathName}
              </p>
            </a>
          </Link>
        );
      })}
    </nav>
  );
});
