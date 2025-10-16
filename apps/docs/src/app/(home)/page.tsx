import { type FC } from 'react';
import { Hero } from '@/components/hero';

const HomePage: FC = () => (
  <main className="relative flex flex-col flex-1 justify-center bg-black w-full min-w-screen h-full min-h-screen overflow-hidden">
    <Hero />
  </main>
);

export default HomePage;
