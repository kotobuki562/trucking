/* eslint-disable react/display-name */
import { useUser } from '@auth0/nextjs-auth0';
import { Menu, Transition } from '@headlessui/react';
import {
  ChatIcon,
  HomeIcon,
  LogoutIcon,
  MenuIcon,
  UserIcon,
} from '@heroicons/react/solid';
import cc from 'classcat';
import Link from 'next/link';
import router from 'next/router';
import { useTheme } from 'next-themes';
import { icons } from 'public/icon';
import { Fragment, memo, useCallback } from 'react';

const links = [
  {
    pathName: 'DASHBOARD',
    href: '/dashboard',
    icon: <HomeIcon className="w-5 h-5" />,
  },
  {
    pathName: 'PROFILE',
    href: '/profile',
    icon: <UserIcon className="w-5 h-5" />,
  },
  {
    pathName: 'MESSAGES',
    href: '/messages',
    icon: <ChatIcon className="w-5 h-5" />,
  },
];

export const Header = memo(() => {
  const { theme, setTheme } = useTheme();
  const { user } = useUser();

  const handleClickTheme = useCallback(() => {
    return setTheme(theme === 'light' ? 'dark' : 'light');
  }, [setTheme, theme]);
  return (
    <header className="flex fixed z-20 justify-between items-center w-full h-14 text-white bg-blue-400 dark:bg-blue-900 border-b duration-200">
      <div className="flex justify-center w-14 md:w-64">
        <img
          className="w-12 h-12 rounded-full border border-white"
          src={`${user?.picture || icons.userIcon}`}
          alt="USER"
        />
      </div>
      <button onClick={handleClickTheme}>change</button>
      <Menu as="div" className="inline-block relative text-left">
        <div className="flex items-center mr-4">
          <Menu.Button className="p-1 text-blue-700 bg-blue-200 rounded-lg focus:outline-none">
            <MenuIcon className="w-7 h-7" />
          </Menu.Button>
        </div>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform scale-95">
          <Menu.Items
            as="div"
            className="absolute right-0 mt-2 w-36 bg-yellow-300 rounded-md divide-y divide-gray-100 ring-1 ring-black ring-opacity-5 shadow-lg origin-top-right focus:outline-none">
            <div className="flex flex-col py-1 px-1">
              <Menu.Item as="div" className="flex flex-col">
                {links.map((link) => {
                  return (
                    <Link key={link.href} href={link.href}>
                      <a
                        className={cc([
                          'flex items-center p-1 mb-1 font-semibold text-white hover:text-blue-400 hover:bg-white rounded-md duration-200',
                          router.asPath.match(link.href)
                            ? 'bg-white text-blue-400'
                            : null,
                        ])}>
                        <div className="mr-1 w-5">{link.icon}</div>
                        <p>{link.pathName}</p>
                      </a>
                    </Link>
                  );
                })}
                <a
                  className="flex items-center p-1 font-semibold text-blue-400 hover:bg-white rounded-md duration-200"
                  href="/api/auth/logout">
                  <div className="mr-1 w-5">
                    <LogoutIcon className="w-5 h-5" />
                  </div>

                  <p>LOGOUT</p>
                </a>
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </header>
  );
});
