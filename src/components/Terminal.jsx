import React, { useState, useRef, useEffect } from 'react'
import { checkAnswer } from '../utils/hash'
import { useGame } from '../context/GameContext'
import JokerPanel from './JokerPanel'

const FS = {
  '/': ['home', 'var', 'etc', 'tmp'],
  '/home': ['sk1ll'],
  '/home/sk1ll': ['mission.txt', '.bash_history', 'notes.enc'],
  '/var': ['log'],
  '/var/log': ['auth.log', 'syslog'],
}

const FILE_CONTENTS = {
  'mission.txt': [
    'CLASSIFICATION: TOP SECRET / EYES ONLY',
    '─────────────────────────────────────────',
    'AGENT : SK1LL',
    'OPERATION : DOUBLE AGENT',
    'STATUT : ACTIF',
    '',
    'Objectif primaire : accès aux archives zero-day',
    'Extraction code d\'authentification niveau 5.',
    '',
    'Agent confirmé. Code : VORTEX',
    '',
    '[FIN DU FICHIER]',
  ],
  '.bash_history': [
    'ssh root@192.168.0.1',
    'wget http://internal.novacorp/payload.bin',
    'chmod +x payload.bin',
    './payload.bin --silent',
    'rm -f payload.bin',
    'history -c',
  ],
  'notes.enc': ['[FICHIER CHIFFRÉ — ACCÈS REFUSÉ]'],
  'auth.log': [
    'Mar 14 03:47 sshd[1337]: Accepted publickey for root from 192.168.0.253',
    'Mar 14 03:47 sshd[1337]: pam_unix: session opened for user root',
  ],
  'syslog': ['... truncated ...', 'kernel: panic - not syncing: system halted'],
}

function processCommand(cmd, cwd, setCwd) {
  const parts = cmd.trim().split(/\s+/)
  const command = parts[0]
  const args = parts.slice(1)

  if (!command) return []

  switch (command) {
    case 'help':
      return [
        'Commandes disponibles :',
        '  ls           — lister le répertoire courant',
        '  ls -la       — liste détaillée',
        '  cat <fichier>— afficher le contenu d\'un fichier',
        '  pwd          — répertoire courant',
        '  cd <dir>     — changer de répertoire',
        '  clear        — effacer le terminal',
        '  help         — cette aide',
      ]

    case 'pwd':
      return [cwd]

    case 'ls': {
      const detailed = args.includes('-la') || args.includes('-l')
      const dir = FS[cwd] ?? []
      if (!detailed) return [dir.join('  ') || '(vide)']
      const lines = ['total ' + dir.length * 4]
      if (cwd !== '/') lines.push('drwxr-xr-x  2 root root  4096 Mar 14 03:47 .')
      dir.forEach(name => {
        const isDir = Object.keys(FS).includes(cwd === '/' ? `/${name}` : `${cwd}/${name}`)
        const perm = isDir ? 'drwxr-xr-x' : (name.startsWith('.') ? '-rw-------' : '-rw-r--r--')
        const owner = name === 'mission.txt' ? 'root root' : 'sk1ll sk1ll'
        lines.push(`${perm}  1 ${owner}  4096 Mar 14 03:47 ${name}`)
      })
      return lines
    }

    case 'cd': {
      const target = args[0] ?? '/'
      let next = target.startsWith('/') ? target : `${cwd === '/' ? '' : cwd}/${target}`
      next = next.replace(/\/+/g, '/')
      if (target === '..') {
        const parts2 = cwd.split('/').filter(Boolean)
        parts2.pop()
        next = '/' + parts2.join('/')
        if (next === '') next = '/'
      }
      if (FS[next] !== undefined) {
        setCwd(next)
        return []
      }
      return [`bash: cd: ${target}: No such file or directory`]
    }

    case 'cat': {
      if (!args[0]) return ['Usage : cat <fichier>']
      const filename = args[0]
      const dir = FS[cwd] ?? []
      if (!dir.includes(filename)) return [`cat: ${filename}: No such file or directory`]
      return FILE_CONTENTS[filename] ?? [`cat: ${filename}: Permission denied`]
    }

    case 'clear':
      return ['__CLEAR__']

    case 'whoami':
      return ['sk1ll']

    case 'uname':
      return ['Linux novacorp-srv-01 5.15.0-novacorp #1 SMP PREEMPT']

    case 'date':
      return ['Thu Mar 14 03:47:22 UTC 2025']

    default:
      return [`bash: ${command}: command not found`]
  }
}

export default function Terminal({ enigme, onSolve }) {
  const { enigmesSolues } = useGame()
  const [history, setHistory] = useState([
    { type: 'system', text: 'NovaCorp Internal Terminal v4.2.1' },
    { type: 'system', text: 'Connexion établie. Accès root accordé.' },
    { type: 'system', text: 'Tapez "help" pour la liste des commandes.' },
    { type: 'system', text: '─────────────────────────────────────────' },
  ])
  const [input, setInput] = useState('')
  const [cwd, setCwd] = useState('/home/sk1ll')
  const [cmdHistory, setCmdHistory] = useState([])
  const [histIdx, setHistIdx] = useState(-1)
  const [codeInput, setCodeInput] = useState('')
  const [codeEtat, setCodeEtat] = useState('idle')
  const endRef = useRef(null)
  const inputRef = useRef(null)

  const dejaResolue = enigmesSolues.includes(enigme.id)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [history])

  function handleSubmit(e) {
    e.preventDefault()
    if (!input.trim()) return

    const cmd = input.trim()
    const output = processCommand(cmd, cwd, setCwd)

    setCmdHistory(h => [cmd, ...h])
    setHistIdx(-1)
    setInput('')

    if (output[0] === '__CLEAR__') {
      setHistory([])
      return
    }

    setHistory(h => [
      ...h,
      { type: 'cmd', text: `${cwd} $ ${cmd}` },
      ...output.map(line => ({ type: 'output', text: line })),
    ])
  }

  function handleKeyDown(e) {
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      const idx = Math.min(histIdx + 1, cmdHistory.length - 1)
      setHistIdx(idx)
      setInput(cmdHistory[idx] ?? '')
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      const idx = Math.max(histIdx - 1, -1)
      setHistIdx(idx)
      setInput(idx === -1 ? '' : cmdHistory[idx])
    }
  }

  function handleCodeSubmit(e) {
    e.preventDefault()
    if (dejaResolue || codeEtat === 'correct') return
    if (checkAnswer(codeInput, enigme.reponse_attendue)) {
      setCodeEtat('correct')
      onSolve(enigme.id)
    } else {
      setCodeEtat('wrong')
      setTimeout(() => setCodeEtat('idle'), 1200)
    }
  }

  return (
    <div className="space-y-4">
      <div className="terminal-window">
        <div className="terminal-header">
          <span className="w-3 h-3 rounded-full bg-red-600"></span>
          <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
          <span className="w-3 h-3 rounded-full bg-green-600"></span>
          <span className="text-xs text-gray-500 ml-2">sk1ll@novacorp-srv-01 — bash</span>
        </div>

        <div
          className="h-72 overflow-y-auto p-4 text-xs font-mono leading-6 cursor-text"
          onClick={() => inputRef.current?.focus()}
        >
          {history.map((line, i) => (
            <div
              key={i}
              className={
                line.type === 'cmd'
                  ? 'text-[#00fff0]'
                  : line.type === 'system'
                  ? 'text-gray-600'
                  : 'text-gray-300'
              }
            >
              {line.text}
            </div>
          ))}

          <form onSubmit={handleSubmit} className="flex items-center mt-1">
            <span className="text-[#00fff0] mr-1">{cwd} $</span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent outline-none text-gray-200 caret-[#00fff0]"
              spellCheck={false}
              autoComplete="off"
            />
          </form>
          <div ref={endRef} />
        </div>
      </div>

      {!dejaResolue && codeEtat !== 'correct' && enigme.indice && (
        <JokerPanel indice={enigme.indice} />
      )}

      {!dejaResolue && codeEtat !== 'correct' ? (
        <form onSubmit={handleCodeSubmit} className="flex gap-2 items-center">
          <span className="text-gray-500 text-xs shrink-0">Code trouvé dans mission.txt :</span>
          <input
            type="text"
            value={codeInput}
            onChange={e => setCodeInput(e.target.value)}
            placeholder="Entrez le code..."
            className={`flex-1 bg-black border rounded px-3 py-2 text-sm font-mono text-gray-200 focus:outline-none transition-colors ${
              codeEtat === 'wrong' ? 'border-[#ff3333]' : 'border-gray-700 focus:border-[#00fff0]'
            }`}
          />
          <button type="submit" className="btn-nova px-4 py-2 text-xs shrink-0">[VALIDER]</button>
        </form>
      ) : (
        <div className="border border-[#39ff14] rounded p-3 bg-[#39ff1408] text-[#39ff14] text-sm">
          ✓ Code VORTEX validé. Accès niveau 5 accordé.
        </div>
      )}
      {codeEtat === 'wrong' && (
        <p className="text-xs text-[#ff3333]" style={{ textShadow: '0 0 4px #ff3333' }}>
          ✗ Code incorrect. Lisez attentivement mission.txt.
        </p>
      )}
    </div>
  )
}
