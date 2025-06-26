'use client';

import { useState } from 'react';
import { fetchPokemonDetails } from '@/lib/api';
import { useGame } from '@/components/context/GameContext';
import Mercure3D from '@/components/Mercure3D';

// Sélection fixe de 20 Pokémon adaptés à Mercure
const planetPokemons = [
  'charmander','vulpix','growlithe','ponyta','rapidash',
  'magmar','flareon','geodude','graveler','golem',
  'onix','rhydon','kabuto','kabutops','omanyte',
  'omastar','aerodactyl','sandshrew','sandslash','diglett'
];

export default function MercurePage() {
  const [species] = useState(planetPokemons);
  const { catchPokemon } = useGame();

  const handlePointIntersect = async (index) => {
    const name = species[index];
    try {
      const details = await fetchPokemonDetails(name);
      catchPokemon(details);
      // TODO: transition vers la vue paysage
    } catch (err) {
      console.error('Erreur capture Pokémon :', err);
    }
  };

  return (
    <div className="w-screen h-screen">
      <Mercure3D
        pointCount={species.length}
        onPointIntersect={handlePointIntersect}
      />
    </div>
  );
}
