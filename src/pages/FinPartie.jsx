import React, { useEffect, useState } from 'react'
import { useGame } from '../context/GameContext'
import ResetButton from '../components/ResetButton'
import sequences from '../data/sequences.json'

const COLOR_MAP = {
  nova: { accent: '#00fff0', shadow: '0 0 20px #00fff0, 0 0 60px #00fff044', border: 'border-[#00fff0]', bg: 'bg-[#00fff008]' },
  collectif: { accent: '#39ff14', shadow: '0 0 20px #39ff14, 0 0 60px #39ff1444', border: 'border-[#39ff14]', bg: 'bg-[#39ff1408]' },
  ghost: { accent: '#888888', shadow: '0 0 20px #888888, 0 0 60px #88888844', border: 'border-gray-600', bg: 'bg-[#88888808]' },
}

const EPILOGUES = {
  A: [
    'Les données de NovaCorp ont été transmises.',
    'Des millions de systèmes sont désormais vulnérables.',
    'Votre nom figure dans leurs livres de compte.',
    'Mais nulle part ailleurs.',
  ],
  B: [
    'Les serveurs de NovaCorp sont cendres.',
    'Le Collectif diffuse votre histoire sur Tor.',
    'Les médias parlent d\'un "mystérieux hacktivist".',
    'SK1LL est devenu une légende.',
  ],
  C: [
    'Aucun log. Aucune trace. Aucun témoin.',
    'NovaCorp déclare une "anomalie système".',
    'Le Collectif cherche encore.',
    'SK1LL n\'existe plus.',
    'Sauf dans la mémoire de quelques serveurs oubliés.',
  ],
}

export default function FinPartie() {
  const { finForcee, scoreNova, scoreCollectif, temps, resetGame } = useGame()
  const [lines, setLines] = useState([])
  const [done, setDone] = useState(false)

  const finId = finForcee ?? (scoreNova >= scoreCollectif ? 'A' : 'B')
  const fin = sequences.fins[finId]
  const colors = COLOR_MAP[fin.couleur] ?? COLOR_MAP.ghost
  const epilogue = EPILOGUES[finId] ?? []

  useEffect(() => {
    let i = 0
    const interval = setInterval(() => {
      if (i < epilogue.length) {
        setLines(prev => [...prev, epilogue[i]])
        i++
      } else {
        clearInterval(interval)
        setTimeout(() => setDone(true), 500)
      }
    }, 700)
    return () => clearInterval(interval)
  }, [])

  const tempsUtilise = 600 - temps
  const mm = Math.floor(tempsUtilise / 60).toString().padStart(2, '0')
  const ss = (tempsUtilise % 60).toString().padStart(2, '0')

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <div className="fixed top-4 right-4 z-40">
        <ResetButton />
      </div>
      <div className="w-full max-w-2xl space-y-8">
        {/* Emoji + Titre */}
        <div className="text-center space-y-3">
          <div className="text-6xl">{fin.emoji}</div>
          <h1
            className="text-4xl font-bold"
            style={{ color: colors.accent, textShadow: colors.shadow }}
          >
            {fin.titre}
          </h1>
          <p className="text-gray-500 tracking-widest uppercase text-sm">{fin.sous_titre}</p>
        </div>

        {/* Épilogue terminal */}
        <div className="terminal-window">
          <div className="terminal-header">
            <span className="w-3 h-3 rounded-full bg-red-600"></span>
            <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
            <span className="w-3 h-3 rounded-full bg-green-600"></span>
            <span className="text-xs text-gray-500 ml-2">sk1ll@novacorp — epilogue</span>
          </div>
          <div className="p-5 text-sm font-mono space-y-2 min-h-[140px]">
            {lines.map((line, i) => (
              <div key={i} style={{ color: colors.accent }}>{line}</div>
            ))}
            {!done && <span className="cursor-blink text-gray-600"></span>}
          </div>
        </div>

        {/* Narration */}
        <div className={`border rounded p-5 ${colors.border} ${colors.bg} text-sm text-gray-300 leading-7`}>
          {fin.texte}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <Stat label="Score NovaCorp" value={scoreNova} color="#00fff0" />
          <Stat label="Score Collectif" value={scoreCollectif} color="#39ff14" />
          <Stat label="Temps écoulé" value={`${mm}:${ss}`} color="#888888" />
        </div>

        {/* Actions */}
        {done && (
          <div className="flex gap-4 justify-center flex-wrap">
            <button className="btn-nova" onClick={resetGame}>
              {'[> NOUVELLE PARTIE]'}
            </button>
          </div>
        )}

        <div className="text-center text-xs text-gray-700">
          RootAccess · ESGI B3 · 2025-2026
        </div>
      </div>
    </div>
  )
}

function Stat({ label, value, color }) {
  return (
    <div className="border border-gray-800 rounded p-3 bg-[#0d0d0d]">
      <div className="text-gray-600 text-xs mb-1">{label}</div>
      <div className="text-xl font-bold" style={{ color, textShadow: `0 0 8px ${color}66` }}>
        {value}
      </div>
    </div>
  )
}
