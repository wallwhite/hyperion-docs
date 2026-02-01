import { createRelativeLink } from 'fumadocs-ui/mdx';
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from 'fumadocs-ui/page';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPageImage, platformSource } from '@/lib/source';
import { getMDXComponents } from '@/mdx-components';

export const generateStaticParams = () => {
  return platformSource.generateParams();
};

export const generateMetadata = async (props: PageProps<'/docs/platform/[[...slug]]'>): Promise<Metadata> => {
  const params = await props.params;
  const page = platformSource.getPage(params.slug);

  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
    openGraph: {
      images: getPageImage(page).url,
    },
  };
};

const Page = async (props: PageProps<'/docs/platform/[[...slug]]'>) => {
  const params = await props.params;
  const page = platformSource.getPage(params.slug);

  if (!page) notFound();

  const MDX = page.data.body;

  return (
    <DocsPage toc={page.data.toc} full={page.data.full}>
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      <DocsBody>
        <MDX
          components={getMDXComponents({
            a: createRelativeLink(platformSource, page),
          })}
        />
      </DocsBody>
    </DocsPage>
  );
};

export default Page;
