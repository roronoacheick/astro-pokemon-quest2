
'use client';

import { useState, useEffect } from 'react';
import { fetchPokemonsByGeneration } from '@/lib/api';
import { useGame } from '@/components/context/GameContext';

export default function PlanetMercure() {
  const [species, setSpecies] = useState([]);
  const { caughtPokemons, unlockPlanet } = useGame();

  useEffect(() => {
    fetchPokemonsByGeneration(1)
      .then((list) => setSpecies(list))
      .catch((err) => console.error('Erreur PokeAPI →', err));
  }, []);

  useEffect(() => {
    if (species.length > 0 && caughtPokemons.length >= species.length) {
      unlockPlanet('Vénus');
    }
  }, [species, caughtPokemons, unlockPlanet]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">Planète Mercure</h2>
      <p className="mb-2">Nombre de Pokémon à capturer : {species.length}</p>
      <ul className="list-disc list-inside">
        {species.map((sp) => (
          <li key={sp.name}>{sp.name}</li>
        ))}
      </ul>
    </div>
  );
}
