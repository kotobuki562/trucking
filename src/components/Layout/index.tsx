import type { ReactNode, VFC } from 'react';

import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { memo } from 'react';

type Props = {
  children: ReactNode;
};
export const Layout: VFC<Props> = memo((props) => {
  return (
    <main className="min-h-screen">
      <Header />
      <div className="flex">
        <Sidebar />
        <div className="h-full w-screen ml-14 mt-14 mb-10 md:ml-64">
          {props.children}
        </div>
      </div>
    </main>
  );
});
