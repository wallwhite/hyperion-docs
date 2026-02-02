import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { baseOptions } from '@/lib/layout.shared';
import { contributingSource } from '@/lib/source';

const Layout = ({ children }: LayoutProps<'/docs/contributing'>) => {
  return (
    <DocsLayout tree={contributingSource.pageTree} {...baseOptions()}>
      {children}
    </DocsLayout>
  );
};

export default Layout;
