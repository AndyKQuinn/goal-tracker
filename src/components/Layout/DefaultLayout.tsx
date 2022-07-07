import Head from 'next/head';
import { ReactNode } from 'react';
import { ReactQueryDevtools } from 'react-query/devtools';
import Navbar from './Navbar';
// import Footer from './Footer'

type DefaultLayoutProps = { children: ReactNode };

export const DefaultLayout = ({ children }: DefaultLayoutProps) => {
  return (
    <div className="h-screen bg-grey-900">
      <Head>
        <title>Wakka Tracker</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar />
      <main
        className="h-full bg-grey-900"
      >
        {children}
      </main>
      {/* <Footer /> */}

      {process.env.NODE_ENV !== 'production' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </div>
  );
};
