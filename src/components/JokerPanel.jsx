import React, { useState } from 'react'
import { useGame } from '../context/GameContext'

const HINT_COLORS = {
  collectif: { border: '#39ff14', bg: '#39ff1410', text: '#39ff14', shadow: '0 0 8px #39ff1466' },
  nova:      { border: '#00fff0', bg: '#00fff010', text: '#00fff0', shadow: '0 0 8px #00fff066' },
  neutre:    { border: '#888888', bg: '#88888810', text: '#aaaaaa', shadow: 'none' },
}

export default function JokerPanel({ indice }) {
  const { jokers, temps, useJoker: consumeJoker, factionDominante } = useGame()
  const [showModal, setShowModal] = useState(false)
  const [revealed, setRevealed] = useState(false)

  const insufficientTime = temps < 60
  const noJokersLeft = jokers === 0
  const canActivate = !insufficientTime && !noJokersLeft && !revealed

  function handleClick() {
    if (!canActivate) return
    setShowModal(true)
  }

  function confirm() {
    setShowModal(false)
    consumeJoker()
    setRevealed(true)
  }

  function cancel() {
    setShowModal(false)
  }

  const colors = HINT_COLORS[factionDominante] ?? HINT_COLORS.neutre

  let btnLabel
  if (noJokersLeft)        btnLabel = "[? PLUS D'INDICES DISPONIBLES]"
  else if (insufficientTime) btnLabel = '[? INDICE — TEMPS INSUFFISANT]'
  else                     btnLabel = `[? INDICE — ${jokers} RESTANT${jokers > 1 ? 'S' : ''}]`

  return (
    <div className="mt-3 space-y-2">
      {/* Joker button — disparaît une fois l'indice révélé */}
      {!revealed && (
        <button
          onClick={handleClick}
          disabled={!canActivate}
          className={`text-xs font-mono px-3 py-1.5 border rounded transition-all duration-200 ${
            canActivate
              ? 'border-[#39ff14] text-[#39ff14] cursor-pointer hover:bg-[#39ff1410]'
              : 'border-gray-800 text-gray-600 cursor-not-allowed'
          }`}
          style={canActivate
            ? { textShadow: '0 0 6px #39ff14', boxShadow: '0 0 6px #39ff1433' }
            : {}
          }
        >
          {btnLabel}
        </button>
      )}

      {/* Indice révélé */}
      {revealed && (
        <div
          className="px-4 py-3 rounded border text-xs font-mono leading-6"
          style={{
            borderColor: colors.border,
            background: colors.bg,
            color: colors.text,
            textShadow: colors.shadow,
          }}
        >
          <span className="opacity-50 mr-2 select-none">⚡ INDICE :</span>
          {indice}
        </div>
      )}

      {/* Modale de confirmation */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={cancel}
        >
          <div
            className="w-full max-w-sm border border-gray-700 bg-[#0d0d0d] rounded p-6 font-mono shadow-2xl mx-4"
            onClick={e => e.stopPropagation()}
          >
            <div
              className="font-bold text-sm mb-4"
              style={{ color: '#00fff0', textShadow: '0 0 6px #00fff0' }}
            >
              ⚠ CONFIRMATION REQUISE
            </div>

            <p className="text-gray-300 text-xs leading-6 mb-1">
              Utiliser un indice retire{' '}
              <span className="text-[#ff9900]" style={{ textShadow: '0 0 4px #ff990066' }}>
                60 secondes
              </span>{' '}
              du timer.
            </p>
            <p className="text-gray-500 text-xs mb-6">
              Jokers restants après cet usage :{' '}
              <span className="text-gray-200">{jokers - 1}</span>
            </p>

            <div className="flex gap-3">
              <button onClick={confirm} className="btn-collectif text-xs px-4 py-2">
                [CONFIRMER]
              </button>
              <button onClick={cancel} className="btn-ghost text-xs px-4 py-2">
                [ANNULER]
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
