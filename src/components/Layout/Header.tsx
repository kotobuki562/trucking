/* eslint-disable react/display-name */
import { useUser } from '@auth0/nextjs-auth0';
import { useTheme } from 'next-themes';
import { icons } from 'public/icon';
import { memo, useCallback } from 'react';

export const Header = memo(() => {
  const { theme, setTheme } = useTheme();
  const { user } = useUser();

  const handleClickTheme = useCallback(() => {
    return setTheme(theme === 'light' ? 'dark' : 'light');
  }, [setTheme, theme]);
  return (
    <header className="flex fixed z-10 justify-between items-center w-full h-14 text-white bg-blue-400 dark:bg-blue-900 border-b duration-200">
      <div className="flex justify-center w-14 md:w-64">
        <img
          className="w-12 h-12 rounded-full border border-white"
          src={`${user?.picture || icons.userIcon}`}
          alt="USER"
        />
      </div>
      <button onClick={handleClickTheme}>change</button>
      <a href="/api/auth/logout">LOGOUT</a>
    </header>
  );
});
