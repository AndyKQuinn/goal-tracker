import Head from 'next/head';
import { ReactNode } from 'react';
import { ReactQueryDevtools } from 'react-query/devtools';
import Navbar from './Navbar'
// import Footer from './Footer'

type DefaultLayoutProps = { children: ReactNode };

export const DefaultLayout = ({ children }: DefaultLayoutProps) => {
  return (
    <>
      <Head>
        <title>Wakka Tracker</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <Navbar />
      <main>{children}</main>
      {/* <Footer /> */}

      {process.env.NODE_ENV !== 'production' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </>
  );
};
