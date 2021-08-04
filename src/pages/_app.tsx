import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { ThemeProvider } from 'next-themes';
import { Layout } from 'src/components/Layout';

const MyApp = (props: AppProps) => {
  console.log('Render my app.');
  return (
    <>
      {console.log('Render my app 2.')}
      <ThemeProvider attribute="class">
        <Layout>
          <props.Component {...props.pageProps} />
        </Layout>
      </ThemeProvider>
    </>
  );
};

export default MyApp;
