import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { ReactNode, VFC } from 'react';

type Props = {
  children: ReactNode;
};
export const Layout: VFC<Props> = (props) => {
  return (
    <main>
      <Header />
      <div className="flex">
        <Sidebar />
        {props.children}
      </div>
    </main>
  );
};
