
import './globals.css'
import { GameProvider } from '@/components/context/GameContext'

export const metadata = {
  title: 'Astro Pokémon Quest',
}

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>
        <GameProvider>
          {children}
        </GameProvider>
      </body>
    </html>
  )
}
