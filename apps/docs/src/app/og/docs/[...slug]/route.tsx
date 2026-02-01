import { generate as DefaultImage } from 'fumadocs-ui/og';
import { notFound } from 'next/navigation';
import { ImageResponse } from 'next/og';
import { getPageImage, platformSource, digitalUniversitySource } from '@/lib/source';

export const revalidate = false;

export const generateStaticParams = () => {
  const platformPages = platformSource.getPages().map((page) => ({
    lang: page.locale,
    slug: getPageImage(page).segments,
  }));

  const digitalUniversityPages = digitalUniversitySource.getPages().map((page) => ({
    lang: page.locale,
    slug: getPageImage(page).segments,
  }));

  return [...platformPages, ...digitalUniversityPages];
};

export const GET = async (_req: Request, { params }: RouteContext<'/og/docs/[...slug]'>) => {
  const { slug } = await params;
  const slugPath = slug.slice(0, -1);

  // Try to find the page in either source
  let page = platformSource.getPage(slugPath);
  if (!page) {
    page = digitalUniversitySource.getPage(slugPath);
  }

  if (!page) notFound();

  return new ImageResponse(<DefaultImage title={page.data.title} description={page.data.description} site="Hyperion Docs" />, {
    width: 1200,
    height: 630,
  });
};
