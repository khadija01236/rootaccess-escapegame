import React, { useState } from 'react'
import { useGame } from '../context/GameContext'
import Timer from '../components/Timer'
import EnigmeCard from '../components/EnigmeCard'
import Terminal from '../components/Terminal'
import ChoixNarratif from '../components/ChoixNarratif'
import JokerPanel from '../components/JokerPanel'
import ResetButton from '../components/ResetButton'
import sequences from '../data/sequences.json'

// ─── Phase 1 ────────────────────────────────────────────────────────────────

function Phase1() {
  const { addScore, setPhase, resoudreEnigme, enigmesSolues, factionDominante } = useGame()
  const data = sequences.phases[0]
  const enigme = data.enigme
  const enigmeResolue = enigmesSolues.includes(enigme.id)
  const [choixFait, setChoixFait] = useState(false)

  function handleChoix(c) {
    addScore(c.faction, c.points)
    setChoixFait(true)
  }

  function handleEnigmeSolve(id) {
    resoudreEnigme(id)
  }

  const canAdvance = choixFait && enigmeResolue

  return (
    <div className="space-y-6">
      <SectionHeader label="PHASE 1" titre={data.titre} color="nova" />

      <Narration text={data.narration_default} />

      <div className="space-y-2">
        <Label>Choix de faction</Label>
        <ChoixNarratif choix={data.choix} onChoix={handleChoix} />
      </div>

      <div className="space-y-2">
        <Label>Énigme — déchiffrement</Label>
        <EnigmeCard enigme={enigme} onSolve={handleEnigmeSolve} />
      </div>

      {canAdvance && (
        <AdvanceBtn onClick={() => setPhase('phase2')} label="PHASE 2 — DOUBLE JEU" />
      )}
      {!canAdvance && (choixFait || enigmeResolue) && (
        <p className="text-xs text-gray-600">
          {!choixFait ? '→ Faites votre choix de faction pour continuer.' : '→ Résolvez l\'énigme pour continuer.'}
        </p>
      )}
    </div>
  )
}

// ─── Phase 2 ────────────────────────────────────────────────────────────────

function Phase2() {
  const { addScore, setPhase, resoudreEnigme, enigmesSolues, factionDominante } = useGame()
  const data = sequences.phases[1]
  const [choixFait, setChoixFait] = useState(false)

  const enigme2a = data.enigmes[0]
  const enigme2b = data.enigmes[1]
  const resolue2a = enigmesSolues.includes(enigme2a.id)
  const resolue2b = enigmesSolues.includes(enigme2b.id)

  const narration = factionDominante === 'nova'
    ? data.narration_nova
    : factionDominante === 'collectif'
    ? data.narration_collectif
    : data.narration_default

  function handleChoix(c) {
    addScore(c.faction, c.points)
    setChoixFait(true)
  }

  const canAdvance = choixFait && resolue2a && resolue2b

  return (
    <div className="space-y-6">
      <SectionHeader label="PHASE 2" titre={data.titre} color={factionDominante === 'collectif' ? 'collectif' : 'nova'} />

      <Narration text={narration} />

      <div className="space-y-2">
        <Label>Choix de transmission</Label>
        <ChoixNarratif choix={data.choix} onChoix={handleChoix} />
      </div>

      <div className="space-y-2">
        <Label>Énigme A — décodage Base64</Label>
        <EnigmeCard enigme={enigme2a} onSolve={resoudreEnigme} />
      </div>

      <div className="space-y-2">
        <Label>Énigme B — terminal Linux</Label>
        <Terminal enigme={enigme2b} onSolve={resoudreEnigme} />
      </div>

      {canAdvance && (
        <AdvanceBtn onClick={() => setPhase('phase3')} label="PHASE 3 — POINT DE NON-RETOUR" color="danger" />
      )}
      {!canAdvance && (choixFait || resolue2a || resolue2b) && (
        <p className="text-xs text-gray-600">
          → Complétez toutes les étapes pour continuer.
          {!choixFait && ' Choix de faction manquant.'}
          {!resolue2a && ' Énigme A manquante.'}
          {!resolue2b && ' Énigme B manquante.'}
        </p>
      )}
    </div>
  )
}

// ─── Phase 3 ────────────────────────────────────────────────────────────────

function Phase3() {
  const { addScore, terminerPartie, resoudreEnigme, enigmesSolues, factionDominante } = useGame()
  const data = sequences.phases[2]
  const enigme = data.enigme
  const [logsState, setLogsState] = useState(() => enigme.logs.map(() => 'idle'))
  const [logEtat, setLogEtat] = useState('idle') // idle | correct | wrong
  const [enigmeResolue, setEnigmeResolue] = useState(enigmesSolues.includes(enigme.id))
  const [choixFait, setChoixFait] = useState(false)

  const narration = factionDominante === 'nova'
    ? data.narration_nova
    : factionDominante === 'collectif'
    ? data.narration_collectif
    : data.narration_default

  function handleLogClick(idx) {
    if (enigmeResolue || logEtat === 'correct') return
    if (idx === enigme.ligne_suspecte) {
      const next = [...logsState]
      next[idx] = 'correct'
      setLogsState(next)
      setLogEtat('correct')
      resoudreEnigme(enigme.id)
      setEnigmeResolue(true)
    } else {
      const next = [...logsState]
      next[idx] = 'wrong'
      setLogsState(next)
      setLogEtat('wrong')
      setTimeout(() => {
        setLogsState(prev => prev.map((v, i) => (i === idx ? 'idle' : v)))
        setLogEtat('idle')
      }, 900)
    }
  }

  function handleChoixFinal(c) {
    if (c.faction !== 'fantome') addScore(c.faction, c.points)
    setChoixFait(true)
    setTimeout(() => terminerPartie(c.fin), 1200)
  }

  return (
    <div className="space-y-6">
      <SectionHeader label="PHASE 3" titre={data.titre} color="danger" />

      <div className="border border-[#ff3333] rounded px-4 py-3 bg-[#ff333308] text-sm text-[#ff3333] font-mono animate-pulse">
        ⚠ ALERTE SYSTÈME — INTRUSION DÉTECTÉE — RÉPONSE IMMÉDIATE REQUISE
      </div>

      <Narration text={narration} />

      <div className="space-y-2">
        <Label>Énigme finale — analyse de logs</Label>
        <p className="text-xs text-gray-500">Cliquez sur la ligne de log suspecte.</p>
        <div className="terminal-window">
          <div className="terminal-header">
            <span className="w-3 h-3 rounded-full bg-red-600"></span>
            <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
            <span className="w-3 h-3 rounded-full bg-green-600"></span>
            <span className="text-xs text-gray-500 ml-2">/var/log/auth.log</span>
          </div>
          <div className="p-2 space-y-0.5">
            {enigme.logs.map((line, i) => (
              <div
                key={i}
                className={`log-line ${logsState[i]}`}
                onClick={() => handleLogClick(i)}
              >
                {line}
              </div>
            ))}
          </div>
        </div>
        {logEtat === 'correct' && (
          <p className="text-xs text-[#39ff14]" style={{ textShadow: '0 0 4px #39ff14' }}>
            ✓ Intrusion identifiée : 192.168.0.253 — IP externe inconnue.
          </p>
        )}
        {logEtat === 'wrong' && (
          <p className="text-xs text-[#ff3333]">✗ Cette ligne n'est pas suspecte. Cherchez l'anomalie.</p>
        )}
        {!enigmeResolue && enigme.indice && (
          <JokerPanel indice={enigme.indice} />
        )}
      </div>

      {enigmeResolue && !choixFait && (
        <div className="space-y-3">
          <Label>Décision finale</Label>
          <ChoixNarratif choix={data.choix} onChoix={handleChoixFinal} />
        </div>
      )}
    </div>
  )
}

// ─── Shared UI helpers ───────────────────────────────────────────────────────

function SectionHeader({ label, titre, color = 'nova' }) {
  const colorMap = {
    nova: 'text-[#00fff0]',
    collectif: 'text-[#39ff14]',
    danger: 'text-[#ff3333]',
  }
  const shadowMap = {
    nova: '0 0 8px #00fff066',
    collectif: '0 0 8px #39ff1466',
    danger: '0 0 8px #ff333366',
  }
  return (
    <div className="border-b border-gray-800 pb-3">
      <div className="text-xs text-gray-600 tracking-widest uppercase mb-1">{label}</div>
      <h2
        className={`text-xl font-bold ${colorMap[color]}`}
        style={{ textShadow: shadowMap[color] }}
      >
        {titre}
      </h2>
    </div>
  )
}

function Narration({ text }) {
  return (
    <div className="px-4 py-3 border-l-2 border-gray-700 bg-[#0d0d0d] text-sm text-gray-400 leading-7 italic">
      {text}
    </div>
  )
}

function Label({ children }) {
  return (
    <div className="text-xs text-gray-600 tracking-widest uppercase">{children}</div>
  )
}

function AdvanceBtn({ onClick, label, color = 'nova' }) {
  return (
    <button
      className={color === 'danger' ? 'btn-danger' : 'btn-nova'}
      onClick={onClick}
    >
      {'[> '}{label}{']'}
    </button>
  )
}

// ─── Main Jeu page ───────────────────────────────────────────────────────────

export default function Jeu() {
  const { phase } = useGame()

  return (
    <div className="min-h-screen">
      {/* Top bar */}
      <header className="sticky top-0 z-50 border-b border-gray-900 bg-[#0a0a0a]/95 backdrop-blur px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-[#00fff0] font-bold text-sm tracking-widest" style={{ textShadow: '0 0 8px #00fff0' }}>
            DOUBLE AGENT
          </span>
          <span className="text-gray-700">|</span>
          <span className="text-gray-600 text-xs uppercase tracking-wider">SK1LL@novacorp</span>
        </div>
        <div className="flex items-center gap-3">
          <Timer />
          <ResetButton />
        </div>
      </header>

      {/* Content */}
      <main className="max-w-2xl mx-auto px-4 py-8">
        {phase === 'phase1' && <Phase1 />}
        {phase === 'phase2' && <Phase2 />}
        {phase === 'phase3' && <Phase3 />}
      </main>
    </div>
  )
}
