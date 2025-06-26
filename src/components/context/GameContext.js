
'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const GameContext = createContext();


export function GameProvider({ children }) {
  // Initialisation depuis LocalStorage ou valeur par défaut
  const [unlockedPlanets, setUnlockedPlanets] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('unlockedPlanets');
      return saved ? JSON.parse(saved) : ['Mercure'];
    }
    return ['Mercure'];
  });

  const [caughtPokemons, setCaughtPokemons] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('caughtPokemons');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  
  useEffect(() => {
    localStorage.setItem('unlockedPlanets', JSON.stringify(unlockedPlanets));
  }, [unlockedPlanets]);

  useEffect(() => {
    localStorage.setItem('caughtPokemons', JSON.stringify(caughtPokemons));
  }, [caughtPokemons]);

  
  const unlockPlanet = (planetName) => {
    setUnlockedPlanets((prev) => {
      if (!prev.includes(planetName)) {
        return [...prev, planetName];
      }
      return prev;
    });
  };

  
  const catchPokemon = (pokemon) => {
    setCaughtPokemons((prev) => {
      if (!prev.find((p) => p.id === pokemon.id)) {
        return [...prev, pokemon];
      }
      return prev;
    });
  };

  return (
    <GameContext.Provider
      value={{
        unlockedPlanets,
        caughtPokemons,
        unlockPlanet,
        catchPokemon,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}


export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame doit être utilisé au sein de GameProvider');
  }
  return context;
}
