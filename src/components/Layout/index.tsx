/* eslint-disable react/display-name */
import type { ReactNode, VFC } from 'react';
import { memo } from 'react';

import { Header } from './Header';
import { Sidebar } from './Sidebar';

type Props = {
  children: ReactNode;
};
export const Layout: VFC<Props> = memo((props) => {
  return (
    <main className="min-h-screen">
      <Header />
      <div className="flex">
        <Sidebar />
        <div className="mt-14 sm:ml-14 md:ml-64 w-screen h-full">
          {props.children}
        </div>
      </div>
    </main>
  );
});
