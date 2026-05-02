import React, { useState } from 'react'
import { checkAnswer } from '../utils/hash'
import { useGame } from '../context/GameContext'
import JokerPanel from './JokerPanel'

export default function EnigmeCard({ enigme, onSolve }) {
  const { enigmesSolues } = useGame()
  const [input, setInput] = useState('')
  const [etat, setEtat] = useState('idle') // idle | correct | wrong
  const [tentatives, setTentatives] = useState(0)

  const dejaResolue = enigmesSolues.includes(enigme.id)

  function handleSubmit(e) {
    e.preventDefault()
    if (dejaResolue || etat === 'correct') return

    if (checkAnswer(input, enigme.reponse_attendue)) {
      setEtat('correct')
      onSolve(enigme.id)
    } else {
      setEtat('wrong')
      setTentatives(t => t + 1)
      setTimeout(() => setEtat('idle'), 1200)
    }
  }

  if (dejaResolue || etat === 'correct') {
    return (
      <div className="border border-[#39ff14] rounded p-4 bg-[#39ff1408]">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[#39ff14] text-lg">✓</span>
          <span className="text-[#39ff14] font-bold text-sm">{enigme.titre}</span>
        </div>
        <p className="text-gray-500 text-xs">Énigme résolue.</p>
      </div>
    )
  }

  return (
    <div className={`border rounded p-4 transition-colors duration-300 ${
      etat === 'wrong' ? 'border-[#ff3333] bg-[#ff333308]' : 'border-gray-700 bg-[#0d0d0d]'
    }`}>
      <div className="mb-3">
        <h3 className="text-[#00fff0] font-bold text-sm mb-1" style={{ textShadow: '0 0 6px #00fff066' }}>
          {enigme.titre}
        </h3>
        <p className="text-gray-400 text-xs leading-relaxed">{enigme.description}</p>
      </div>

      {enigme.chiffre && (
        <div className="mb-3 px-3 py-2 bg-black border border-gray-800 rounded font-mono text-sm text-yellow-400">
          {enigme.chiffre}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder={enigme.placeholder || 'Votre réponse...'}
          className="flex-1 bg-black border border-gray-700 rounded px-3 py-2 text-sm font-mono text-gray-200 focus:outline-none focus:border-[#00fff0] transition-colors"
          autoComplete="off"
        />
        <button type="submit" className="btn-nova px-4 py-2 text-xs">
          [VALIDER]
        </button>
      </form>

      <div className="mt-2 flex items-center justify-between">
        {tentatives > 0 && (
          <span className="text-xs text-gray-700">
            {tentatives} tentative{tentatives > 1 ? 's' : ''}
          </span>
        )}
      </div>

      {etat === 'wrong' && (
        <div className="mt-1 text-xs text-[#ff3333]" style={{ textShadow: '0 0 4px #ff3333' }}>
          ✗ Réponse incorrecte. Réessayez.
        </div>
      )}

      {enigme.indice && <JokerPanel indice={enigme.indice} />}
    </div>
  )
}
