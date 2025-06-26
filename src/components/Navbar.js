
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/', label: 'Système Solaire' },
  { href: '/collection', label: 'Ma Collection' },
];

export default function Navbar() {
  const path = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 w-full bg-gradient-to-r from-indigo-800 via-purple-900 to-black text-white shadow-md">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <h1 className="text-xl font-bold">Astro Pokémon</h1>
        <ul className="flex space-x-4">
          {links.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className={`px-3 py-1 rounded-md ${
                  path === href
                    ? 'bg-white text-indigo-900 font-semibold'
                    : 'hover:bg-white/20 transition'
                }`}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}