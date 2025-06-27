'use client';

import { useState, useRef, useEffect } from 'react';

export default function CaptureView({ pokemon, onSuccess, onCancel }) {
  const containerRef = useRef(null);
  const timeInsideRef = useRef(0);
  const insideRef = useRef(false);

  const POKE_SIZE = 96;      // taille du sprite en px
  const RADIUS = 60;         // zone de capture en px
  const REQUIRED = 5000;     // durée cumulée requise en ms
  const INTERVAL = 100;      // fréquence de vérification en ms

  const [pokePos, setPokePos] = useState({ x: 0, y: 0 });
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [capturing, setCapturing] = useState(false);
  const [progress, setProgress] = useState(0);

  // Position initiale du Pokémon (centre)
  useEffect(() => {
    const rect = containerRef.current.getBoundingClientRect();
    setPokePos({ x: rect.width / 2 - POKE_SIZE/2, y: rect.height / 2 - POKE_SIZE/2 });
  }, []);

  // Déplacement aléatoire continu
  useEffect(() => {
    const iv = setInterval(() => {
      const { clientWidth: w, clientHeight: h } = containerRef.current;
      setPokePos({ x: Math.random() * (w - POKE_SIZE), y: Math.random() * (h - POKE_SIZE) });
    }, 2000);
    return () => clearInterval(iv);
  }, []);

  // Suivi du curseur
  const onMouseMove = (e) => {
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setCursorPos({ x, y });
    const cx = pokePos.x + POKE_SIZE/2;
    const cy = pokePos.y + POKE_SIZE/2;
    insideRef.current = Math.hypot(x - cx, y - cy) < RADIUS;
  };

  // Effet de capture 5s cumulées
  useEffect(() => {
    if (!capturing) return;
    timeInsideRef.current = 0;
    setProgress(0);

    const iv = setInterval(() => {
      if (insideRef.current) {
        timeInsideRef.current = Math.min(timeInsideRef.current + INTERVAL, REQUIRED);
        const pct = timeInsideRef.current / REQUIRED;
        setProgress(pct);
        if (timeInsideRef.current >= REQUIRED) {
          clearInterval(iv);
          setCapturing(false);
          onSuccess();
        }
      }
    }, INTERVAL);

    return () => clearInterval(iv);
  }, [capturing, onSuccess]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden"
      onMouseMove={onMouseMove}
      style={{
        backgroundImage: "url('/mercury_view.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      {/* Pokémon animé */}
      <img
        src={pokemon.sprites.front_default}
        alt={pokemon.name}
        draggable={false}
        className="absolute w-24 h-24"
        style={{
          left: pokePos.x,
          top: pokePos.y,
          transition: 'left 1s linear, top 1s linear',
          pointerEvents: 'none'
        }}
      />

      {/* Curseur */}
      {capturing && (
        <div
          className="pointer-events-none absolute w-8 h-8 rounded-full border-2 border-white"
          style={{ left: cursorPos.x - 16, top: cursorPos.y - 16 }}
        />
      )}

      {/* Barre de progression */}
      {capturing && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 w-3/4 h-3 bg-white bg-opacity-30 rounded z-40">
          <div
            className="h-full bg-white rounded"
            style={{ width: `${progress * 100}%`, transition: `width ${INTERVAL}ms linear` }}
          />
          <span className="absolute w-full text-center text-xs text-white">
            {Math.round(progress * 100)}%
          </span>
        </div>
      )}

      {/* Bouton Pokéball / Annuler */}
      {!capturing ? (
        <button
          onClick={() => setCapturing(true)}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-white rounded-full w-16 h-16 flex items-center justify-center text-2xl z-50"
        >
          ⚪
        </button>
      ) : (
        <button
          onClick={() => { setCapturing(false); onCancel(); }}
          className="fixed top-16 right-4 text-white z-50"
        >
          Annuler
        </button>
      )}
    </div>
  );
}
