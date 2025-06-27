
'use client';

import { motion } from 'framer-motion';

export default function PokemonCard({ pokemon, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex items-center justify-center bg-black/70 z-20"
    >
      <motion.div
        initial={{ scale: 0.8, y: -20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-6 w-80 rounded-2xl shadow-2xl relative"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-white text-xl hover:text-gray-200"
          aria-label="Retour en vue 3D"
        >
          ✕
        </button>

        {/* Artwork */}
        <div className="flex justify-center mb-4">
          <img
            src={pokemon.sprites.other['official-artwork'].front_default}
            alt={pokemon.name}
            className="w-40 h-40 object-contain drop-shadow-lg"
          />
        </div>

        {/* Name */}
        <h2 className="text-white text-2xl font-bold text-center capitalize mb-2">
          {pokemon.name}
        </h2>

        {/* Types */}
        <div className="flex justify-center space-x-2 mb-4">
          {pokemon.types.map(({ type }) => (
            <span
              key={type.name}
              className="px-3 py-1 bg-white bg-opacity-20 text-white text-sm rounded-full capitalize"
            >
              {type.name}
            </span>
          ))}
        </div>

        {/* Stats */}
        <div className="space-y-2 mb-6">
          {pokemon.stats.map(({ stat, base_stat }) => (
            <div key={stat.name} className="flex justify-between text-white">
              <span className="capitalize">{stat.name.replace('-', ' ')}</span>
              <span>{base_stat}</span>
            </div>
          ))}
        </div>

        {/* Return button */}
        <button
          onClick={onClose}
          className="w-full bg-white text-indigo-600 font-semibold py-2 rounded-xl shadow-md hover:bg-white/90 transition"
        >
          Retour au 3D
        </button>
      </motion.div>
    </motion.div>
  );
}
