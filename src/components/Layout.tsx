import type { ReactNode } from 'react';
import { Footer } from 'src/components/Footer';
import { Header } from 'src/components/Header';

type Props = { children: ReactNode };

export const Layout = (props: Props) => {
  console.log('Render layout.');
  return (
    <>
      {console.log('Render layout 2.')}
      <Header />
      <main className="pt-57px sm:pt-65px lg:pt-73px">{props.children}</main>
      <Footer />
    </>
  );
};
