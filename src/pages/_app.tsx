import { AppProps } from 'next/app';
import 'bootstrap/dist/css/bootstrap.css';
import '/src/shared/assets/quote-generator.css';

const App: React.FC<AppProps> = ({ Component, pageProps }) => {
  return <Component {...pageProps} />;
};

export default App;
