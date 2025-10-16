import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { Logo } from '@/components/logo';

export const baseOptions = (): BaseLayoutProps => {
  return {
    themeSwitch: {
      enabled: false,
    },
    nav: {
      title: (
        <>
          <Logo className="w-6 h-6" />
          <span className="flex items-center gap-1">
            Hyperion
            <span className="text-gray-400">Docs</span>
          </span>
        </>
      ),
    },
    // see https://fumadocs.dev/docs/ui/navigation/links
    links: [],
  };
};
