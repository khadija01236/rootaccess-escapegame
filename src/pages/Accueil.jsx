import React, { useEffect, useState } from 'react'
import { useGame } from '../context/GameContext'

const BOOT_LINES = [
  'BIOS v2.1 — NovaCorp Secure Boot',
  'Initialisation mémoire... OK',
  'Chargement modules réseau... OK',
  'Interface réseau eth0 : 10.0.0.42',
  'Détection agent : SK1LL — CONFIRMÉ',
  'Chargement mission DOUBLE AGENT...',
  '.',
  '..',
  '...',
  'PRÊT.',
]

export default function Accueil() {
  const { startGame } = useGame()
  const [bootLines, setBootLines] = useState([])
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setBootLines([])
    setReady(false)
    let i = 0
    const interval = setInterval(() => {
      if (i < BOOT_LINES.length) {
        const line = BOOT_LINES[i]
        i++
        setBootLines(prev => [...prev, line])
      } else {
        clearInterval(interval)
        setTimeout(() => setReady(true), 400)
      }
    }, 180)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 relative">
      <div className="w-full max-w-2xl space-y-8">
        {/* Logo / Titre */}
        <div className="text-center space-y-2">
          <div className="text-xs text-gray-600 tracking-[0.3em] uppercase mb-4">
            RootAccess · ESGI B3 · 2025-2026
          </div>
          <h1
            className="text-5xl font-bold tracking-tight text-[#00fff0] flicker"
            style={{ textShadow: '0 0 20px #00fff0, 0 0 60px #00fff044' }}
          >
            DOUBLE AGENT
          </h1>
          <p className="text-gray-500 text-sm tracking-widest uppercase">
            Escape Game · Cybersécurité
          </p>
        </div>

        {/* Boot terminal */}
        <div className="terminal-window">
          <div className="terminal-header">
            <span className="w-3 h-3 rounded-full bg-red-600"></span>
            <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
            <span className="w-3 h-3 rounded-full bg-green-600"></span>
            <span className="text-xs text-gray-500 ml-2">system boot</span>
          </div>
          <div className="p-5 text-xs font-mono space-y-1 min-h-[180px]">
            {bootLines.map((line, i) => (
              <div
                key={i}
                className={
                  line === 'PRÊT.'
                    ? 'text-[#39ff14] font-bold'
                    : line?.startsWith('.')
                    ? 'text-gray-600'
                    : 'text-gray-400'
                }
              >
                {line}
              </div>
            ))}
            {!ready && <span className="cursor-blink text-gray-600"></span>}
          </div>
        </div>

        {/* Description */}
        {ready && (
          <div className="space-y-4 animate-fade-in">
            <div className="border border-gray-800 rounded p-5 bg-[#0d0d0d] text-sm text-gray-400 leading-7 space-y-3">
              <p>
                Vous incarnez <span className="text-[#00fff0] font-bold">SK1LL</span>, agent double infiltré
                au sein de <span className="text-[#00fff0]">NovaCorp</span> — courtier en vulnérabilités zero-day.
              </p>
              <p>
                Deux factions vous contactent simultanément. Leurs ordres sont contradictoires.
                Votre allégeance déterminera le destin de milliers de systèmes.
              </p>
              <p className="text-gray-600">
                ⏱ Durée : 10 minutes max · 3 phases · 3 fins possibles
              </p>
            </div>

            <div className="flex gap-4 justify-center flex-wrap">
              <button
                className="btn-nova text-sm px-8 py-3"
                onClick={startGame}
              >
                {'[> COMMENCER LA MISSION]'}
              </button>
            </div>

            <div className="text-center text-xs text-gray-700 pt-2">
              Khadidiatou Konte · Mateo Perez · Alex Laudrin · Robin Pettito · Pierre Bekonno
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
