/* eslint-disable react/display-name */
import { useUser } from '@auth0/nextjs-auth0';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { icons } from 'public/icon';
import { memo, useCallback } from 'react';
import { links } from 'src/components/Layout/layoutInfo';

export const Header = memo(() => {
  const { theme, setTheme } = useTheme();
  const { user } = useUser();
  const handleClickTheme = useCallback(() => {
    return setTheme(theme === 'light' ? 'dark' : 'light');
  }, [setTheme, theme]);
  return (
    <header className="flex fixed z-10 justify-between items-center w-full h-14 text-white bg-blue-400 dark:bg-blue-900 duration-200">
      <div className="flex justify-center md:w-64">
        <img
          className="w-14 h-14 rounded-full"
          src={`${user?.picture || icons.userIcon}`}
          alt="USER"
        />
      </div>

      <nav>
        {links.map((link) => {
          return (
            <Link key={link.pathName} href={link.href}>
              <a>{link.pathName}</a>
            </Link>
          );
        })}
      </nav>
      <button onClick={handleClickTheme}>change</button>
      <a href="/api/auth/logout">LOGOUT</a>
    </header>
  );
});
