// src/app/layout.js
import './globals.css';
import { GameProvider } from '@/components/context/GameContext';
import Navbar from '@/components/Navbar';

export const metadata = {
  title: 'Astro Pokémon Quest',
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body className="pt-14">
        <Navbar />
        <GameProvider>
          {children}
        </GameProvider>
      </body>
    </html>
  );
}
