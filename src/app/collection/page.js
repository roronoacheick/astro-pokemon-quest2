'use client';

import { useGame } from '@/components/context/GameContext';
import PokemonCard from '@/components/PokemonCard';
import Link from 'next/link';

export default function CollectionPage() {
  const { caughtPokemons } = useGame();

  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold mb-6">Ma collection</h1>

      {caughtPokemons.length === 0 ? (
        <p>Tu n'as encore capturé aucun Pokémon.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {caughtPokemons.map((poke) => (
            <div key={poke.id} className="bg-white rounded-xl shadow p-2">
              <img
                src={poke.sprites.other['official-artwork'].front_default}
                alt={poke.name}
                className="w-full h-32 object-contain mb-2"
              />
              <h2 className="capitalize text-center font-semibold">
                {poke.name}
              </h2>
            </div>
          ))}

          {/* Slots vides jusqu'à 20 */}
          {Array.from({ length: 20 - caughtPokemons.length }).map((_, i) => (
            <div
              key={`empty-${i}`}
              className="border-2 border-dashed border-gray-300 rounded-xl p-2 flex items-center justify-center text-gray-400"
            >
              ? Slot vide
            </div>
          ))}
        </div>
      )}

      <footer className="mt-8">
        <Link
          href="/"
          className="inline-block bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-500 transition"
        >
          ← Retour au système solaire
        </Link>
      </footer>
    </main>
  );
}
