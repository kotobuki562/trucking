import { useUser } from '@auth0/nextjs-auth0';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { icons } from 'public/icon';
import { memo } from 'react';
import { links } from 'src/components/Layout/layoutInfo';

export const Header = memo(() => {
  const { theme, setTheme } = useTheme();
  const { user, isLoading } = useUser();
  return (
    <header className="fixed w-full duration-200 flex items-center justify-between h-14 bg-blue-400 dark:bg-blue-900 text-white z-10">
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
      <button
        onClick={() => {
          setTheme(theme === 'light' ? 'dark' : 'light');
        }}>
        change
      </button>

      <a href="/api/auth/logout">LOGOUT</a>
    </header>
  );
});
