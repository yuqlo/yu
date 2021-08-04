import { Switch } from '@headlessui/react';
import { MoonIcon, SunIcon } from '@heroicons/react/outline';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export const Theme = () => {
  console.log('Render theme');
  const [mounted, setMounted] = useState(false);
  const [enabledDarkMode, setEnabledDarkMode] = useState<boolean | null>(null);
  const { resolvedTheme, setTheme } = useTheme();
  useEffect(() => {
    console.log(resolvedTheme);
    mounted && setEnabledDarkMode(resolvedTheme === 'dark');
  }, [mounted]);
  useEffect(() => {
    console.log(enabledDarkMode);
    enabledDarkMode !== null && setTheme(enabledDarkMode ? 'dark' : 'light');
  }, [enabledDarkMode]);
  useEffect(() => {
    console.log('Mounted');
    setMounted((prevMounted) => !prevMounted);
  }, []);
  if (!mounted) return null;
  return (
    <>
      {console.log('Render theme 2')}
      {enabledDarkMode !== null && (
        <>
          {console.log('Render theme 3')}
          <div className="flex">
            <SunIcon className={`${enabledDarkMode ? 'text-gray-600' : ''} h-6`} />
            <Switch
              checked={enabledDarkMode}
              onChange={setEnabledDarkMode}
              className={`${
                enabledDarkMode ? 'bg-gray-200 ring-gray-500' : 'bg-gray-700 ring-gray-400'
              } h-6 w-12 rounded-full inline-flex items-center hover:ring-2 focus:outline-none focus-visible:ring-2 mx-1.5 sm:mx-1.75 lg:mx-2`}
            >
              <span className="sr-only">ダークモードを有効にします。</span>
              <span
                className={`${
                  enabledDarkMode ? 'bg-gray-800 translate-x-7' : 'bg-gray-100 translate-x-1'
                } h-4 w-4 rounded-full transform`}
              />
            </Switch>
            <MoonIcon className={`${!enabledDarkMode ? 'text-gray-300' : ''} h-6`} />
          </div>
        </>
      )}
    </>
  );
};
