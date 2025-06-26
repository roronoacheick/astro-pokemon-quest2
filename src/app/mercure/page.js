
'use client';

import { useGame } from '@/components/context/GameContext';
import Mercure3D from '@/components/Mercure3D';

export default function MercurePage() {
  const { species /* à venir : caughtPokemons, catchPokemon */ } = useGame();

  return (
    <main className="w-screen h-screen relative bg-black">
      <Mercure3D
        onPointIntersect={(pointIndex) => {
          // TODO : gérer collision et transition vers vue Paysage
          console.log('Intersection sur le point #', pointIndex);
        }}
      />
    </main>
  );
}
