// src/app/page.js
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useGame } from '@/components/context/GameContext';

const planets = [
  { name: 'Mercure', slug: 'mercure', img: '/planets/mercury.jpg' },
  { name: 'Vénus',   slug: 'venus',   img: '/planets/venus.jpg' },
  { name: 'Terre',   slug: 'terre',   img: '/planets/earth.jpg' },
  { name: 'Mars',    slug: 'mars',    img: '/planets/mars.jpg' },
  { name: 'Jupiter', slug: 'jupiter', img: '/planets/jupiter.jpg' },
  { name: 'Saturne', slug: 'saturne', img: '/planets/saturn.jpg' },
  { name: 'Uranus',  slug: 'uranus',  img: '/planets/uranus.jpg' },
  { name: 'Neptune', slug: 'neptune', img: '/planets/neptune.jpg' },
];

export default function HomePage() {
  const { unlockedPlanets } = useGame();

  return (
    <main className="flex flex-col items-center p-4">
      <h1 className="text-2xl font-bold mb-6">Astro Pokémon Quest</h1>

      <div className="flex space-x-4 overflow-x-auto mb-6">
        {planets.map(({ name, slug, img }) => {
          const unlocked = unlockedPlanets.includes(name);
          return (
            <Link
              key={slug}
              href={unlocked ? `/${slug}` : '#'}
              className="relative inline-block"
            >
              <Image
                src={img}
                alt={name}
                width={100}
                height={100}
                className={`rounded-full transition-opacity ${
                  unlocked ? 'opacity-100' : 'opacity-40'
                }`}
              />
              {!unlocked && (
                <div className="absolute inset-0 flex items-center justify-center text-2xl">
                  🔒
                </div>
              )}
              <span className="block text-center mt-2">{name}</span>
            </Link>
          );
        })}
      </div>

      <Link
        href="/collection"
        className="mt-4 bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-500 transition"
      >
        Ma collection →
      </Link>
    </main>
  );
}
