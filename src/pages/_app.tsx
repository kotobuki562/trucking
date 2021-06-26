import '../../styles/index.css';
import type { AppProps } from 'next/app';

const App = (props: AppProps) => {
  return <props.Component {...props.pageProps} />;
};

export default App;
