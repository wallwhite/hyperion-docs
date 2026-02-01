import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { baseOptions } from '@/lib/layout.shared';
import { platformSource } from '@/lib/source';

const Layout = ({ children }: LayoutProps<'/docs/platform'>) => {
  return (
    <DocsLayout tree={platformSource.pageTree} {...baseOptions()}>
      {children}
    </DocsLayout>
  );
};

export default Layout;
