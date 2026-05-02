import React from 'react'
import { useGame } from '../context/GameContext'

function formatTime(seconds) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0')
  const s = (seconds % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

export default function Timer() {
  const { temps } = useGame()

  const isRed = temps <= 60
  const isOrange = temps <= 180 && temps > 60

  let colorClass = 'text-[#00fff0]'
  let shadowStyle = { textShadow: '0 0 8px #00fff0' }
  let animClass = ''

  if (isRed) {
    colorClass = 'text-[#ff3333]'
    shadowStyle = { textShadow: '0 0 12px #ff3333' }
    animClass = 'animate-pulse'
  } else if (isOrange) {
    colorClass = 'text-[#ff9900]'
    shadowStyle = { textShadow: '0 0 10px #ff9900' }
  }

  return (
    <div className={`flex items-center gap-2 font-mono text-sm select-none ${animClass}`}>
      <span className="text-gray-500">⚠</span>
      <span className="text-gray-500">Verrouillage système dans</span>
      <span className={`font-bold text-base tracking-widest ${colorClass}`} style={shadowStyle}>
        {formatTime(temps)}
      </span>
    </div>
  )
}
