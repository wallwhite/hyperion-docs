import Link from 'next/link';
import { Card, Cards } from 'fumadocs-ui/components/card';

export default function DocsIndexPage() {
  return (
    <main className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-4xl font-bold mb-4">Documentation</h1>
      <p className="text-lg text-fd-muted-foreground mb-8">
        Select a documentation project to browse.
      </p>

      <Cards>
        <Card
          title="Digital University"
          description="Architecture, ADRs, and technical documentation for the Digital University project"
          href="/docs/digital-university"
        />
        <Card
          title="Contributing"
          description="Documentation contributing guidelines and templates"
          href="/docs/contributing"
        />
      </Cards>
    </main>
  );
}
