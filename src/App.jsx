import React from 'react'
import { GameProvider, useGame } from './context/GameContext'
import Accueil from './pages/Accueil'
import Jeu from './pages/Jeu'
import FinPartie from './pages/FinPartie'

function Router() {
  const { phase } = useGame()

  if (phase === 'intro') return <Accueil />
  if (phase === 'fin') return <FinPartie />
  return <Jeu />
}

export default function App() {
  return (
    <GameProvider>
      <div className="scanlines" aria-hidden="true" />
      <Router />
    </GameProvider>
  )
}
