import { memo } from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { useUser } from '@auth0/nextjs-auth0';
import { links } from 'src/components/Layout/layoutInfo';

export const Header = memo(() => {
  const { theme, setTheme } = useTheme();
  const { user, isLoading } = useUser();
  return (
    <header>
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
      <img
        className="rounded-full w-16 h-16"
        src={`${user?.picture}`}
        alt="USER"
      />
      <a href="/api/auth/logout">LOGOUT</a>
    </header>
  );
});
