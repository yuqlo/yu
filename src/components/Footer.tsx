import Link from 'next/link';
import { memo } from 'react';

export const Footer = memo(() => {
  console.log('Render footer.');
  const items = [
    { label: 'ホーム', href: '/' },
    { label: 'お問い合わせ', href: 'https://forms.gle/brPoMxYhDnzfbcjg7' },
  ] as const;
  return (
    <>
      {console.log('Render footer 2.')}
      <footer className="container text-center border-t border-gray-300 dark:border-gray-600 py-3 sm:py-3.5 lg:py-4">
        <ul className="flex justify-center mb-1.5 sm:mb-1.75 lg:mb-2">
          {items.map((item, i) => {
            return (
              <li key={item.label} className={`${i > 0 ? 'ml-3 sm:ml-3.5 lg:ml-4' : ''}`}>
                {item.label === 'お問い合わせ' ? (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline focus:outline-none focus-visible:underline"
                  >
                    {item.label}
                  </a>
                ) : (
                  <Link href={item.href}>
                    <a className="hover:underline focus:outline-none focus-visible:underline">{item.label}</a>
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
        <small>&copy; 2021 yuqlo</small>
      </footer>
    </>
  );
});
Footer.displayName = 'Footer';
