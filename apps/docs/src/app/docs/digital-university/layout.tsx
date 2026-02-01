import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { baseOptions } from '@/lib/layout.shared';
import { digitalUniversitySource } from '@/lib/source';

const Layout = ({ children }: LayoutProps<'/docs/digital-university'>) => {
  return (
    <DocsLayout tree={digitalUniversitySource.pageTree} {...baseOptions()}>
      {children}
    </DocsLayout>
  );
};

export default Layout;
