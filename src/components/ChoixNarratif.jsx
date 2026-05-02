import React, { useState } from 'react'
import { useGame } from '../context/GameContext'

export default function ChoixNarratif({ choix, onChoix, disabled = false }) {
  const { factionDominante } = useGame()
  const [choixFait, setChoixFait] = useState(null)
  const [feedback, setFeedback] = useState(null)

  function handleClick(c) {
    if (disabled || choixFait) return
    setChoixFait(c.id)
    setFeedback(c.feedback)
    onChoix(c)
  }

  function getBtnClass(c) {
    if (choixFait && choixFait !== c.id) return 'btn-ghost opacity-30 cursor-not-allowed'
    if (c.faction === 'nova') return 'btn-nova'
    if (c.faction === 'collectif') return 'btn-collectif'
    if (c.faction === 'fantome') return 'btn-danger'
    return 'btn-ghost'
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-3">
        {choix.map((c) => (
          <button
            key={c.id}
            className={getBtnClass(c)}
            onClick={() => handleClick(c)}
            disabled={!!choixFait || disabled}
          >
            {c.label}
          </button>
        ))}
      </div>
      {feedback && (
        <div className="mt-3 px-4 py-3 border border-gray-700 bg-[#111] rounded text-sm text-gray-300 italic">
          <span className="text-gray-500 mr-2">//</span>
          {feedback}
        </div>
      )}
    </div>
  )
}
