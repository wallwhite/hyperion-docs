import type { ReactNode } from 'react';

// This layout just passes through children
// The actual DocsLayout is applied in each project subdirectory
const Layout = ({ children }: { children: ReactNode }) => {
  return <>{children}</>;
};

export default Layout;
