'use client';

import { useState } from 'react';
import { fetchPokemonDetails } from '@/lib/api';
import { useGame } from '@/components/context/GameContext';
import Mercure3D from '@/components/Mercure3D';
import CaptureView from '@/components/CaptureView';

const planetPokemons = [
  'charmander','vulpix','growlithe','ponyta','rapidash',
  'magmar','flareon','geodude','graveler','golem',
  'onix','rhydon','kabuto','kabutops','omanyte',
  'omastar','aerodactyl','sandshrew','sandslash','diglett'
];

export default function MercurePage() {
  // mode.view === '3d' or 'capture', pokemonIndex holds the selected index
  const [mode, setMode] = useState({ view: '3d', pokemonIndex: null });
  const [selected, setSelected] = useState(null);
  const [species] = useState(planetPokemons);
  const { catchPokemon } = useGame();

  // Quand on touche un point
  const handlePointIntersect = async (index) => {
    setMode({ view: 'capture', pokemonIndex: index });
    const name = species[index];
    try {
      const details = await fetchPokemonDetails(name);
      setSelected(details);
    } catch (err) {
      console.error('Erreur fetchPokemonDetails:', err);
    }
  };

  // Quand la capture est réussie
  const handleCaptureComplete = () => {
    if (selected) {
      catchPokemon(selected);
    }
    setMode({ view: '3d', pokemonIndex: null });
    setSelected(null);
  };

  return (
    <div className="w-screen h-screen">
      {mode.view === '3d' ? (
        <Mercure3D
          pointCount={species.length}
          onPointIntersect={handlePointIntersect}
        />
      ) : (
        selected && (
          <CaptureView
            pokemon={selected}
            onSuccess={handleCaptureComplete}
            onCancel={() => setMode({ view: '3d', pokemonIndex: null })}
          />
        )
      )}
    </div>
  );
}
