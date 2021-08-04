import Link from 'next/link';
import { memo } from 'react';
import { Theme } from 'src/components/Theme';

export const Header = memo(() => {
  console.log('Render header.');
  return (
    <>
      {console.log('Render header 2.')}
      <header className="fixed w-full z-50 bg-gray-100 dark:bg-gray-800">
        <div className="container border-b border-gray-300 dark:border-gray-600 py-3 sm:py-3.5 lg:py-4">
          <div className="sm:relative flex items-center justify-between sm:justify-center">
            <Link href="/">
              <a className="text-2xl sm:text-3xl lg:text-4xl font-bold hover:text-wisteria dark:hover:text-fujiiro focus:outline-none focus-visible:text-wisteria dark:focus-visible:text-fujiiro transition-colors duration-500">
                yuqlo
              </a>
            </Link>
            <div className="sm:absolute sm:right-0">
              <Theme />
            </div>
          </div>
        </div>
      </header>
    </>
  );
});
Header.displayName = 'Header';
