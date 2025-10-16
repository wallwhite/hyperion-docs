import { type FC } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/logo';
import { Silk } from '@/components/silk-bg';

const HomePage: FC = () => {
  return (
    <main className="relative flex flex-col flex-1 justify-center w-full h-full">
      <div
        className={cn(
          'absolute inset-0 ',
          'after:content-[""] after:bg-radial after:from-cyan-500/40 after:to-black after:absolute after:inset-0',
        )}
      >
        <Silk />
      </div>
      <section className="flex flex-col flex-1 justify-center w-full text-center">
        <div className="relative flex flex-col items-center gap-10 px-5 pt-10 pb-16">
          <div className="z-20 relative flex items-center gap-1.5">
            <Logo className="w-16 h-16" />
          </div>
        </div>
        <div className="z-20 relative flex flex-col items-center gap-4 mx-auto px-6 max-w-2xl">
          <div className="bg-cyan-500/20 backdrop-blur-sm mb-6 px-2 border border-cyan-400 rounded-full text-cyan-300 text-sm">
            Ready to go documentation stack
          </div>
          <h1
            className={cn(
              'font-bold text-5xl sm:text-6xl text-center',
              'bg-gradient-to-tr from-35% from-white to-zinc-400 inline-block text-transparent bg-clip-text',
            )}
          >
            Developer-first documentation
          </h1>
          <p className="font-light text-neutral-300/80 text-lg text-balance">
            Built for developer experience with one-command setup and hot reload in Docker.
          </p>
          <div className="flex flex-col gap-2">
            <Link
              href="/docs"
              className="bg-white hover:bg-zinc-100 px-4 py-2 border rounded-full text-black text-sm hover:scale-95 transition-all duration-300"
            >
              Get started
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default HomePage;
