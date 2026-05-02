const PREFIX = 'da_'

export const KEYS = {
  phase: `${PREFIX}phase`,
  scoreNova: `${PREFIX}score_nova`,
  scoreCollectif: `${PREFIX}score_collectif`,
  enigmes: `${PREFIX}enigmes`,
  temps: `${PREFIX}temps`,
  jokers: `${PREFIX}jokers`,
}

export function getItem(key) {
  try {
    const raw = sessionStorage.getItem(key)
    if (raw === null) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function setItem(key, value) {
  sessionStorage.setItem(key, JSON.stringify(value))
}

export function clearAll() {
  Object.values(KEYS).forEach(k => sessionStorage.removeItem(k))
}

export function loadState() {
  return {
    phase: getItem(KEYS.phase) ?? 'intro',
    scoreNova: getItem(KEYS.scoreNova) ?? 0,
    scoreCollectif: getItem(KEYS.scoreCollectif) ?? 0,
    enigmesSolues: getItem(KEYS.enigmes) ?? [],
    temps: getItem(KEYS.temps) ?? 600,
    jokers: getItem(KEYS.jokers) ?? 2,
  }
}

export function saveState(state) {
  setItem(KEYS.phase, state.phase)
  setItem(KEYS.scoreNova, state.scoreNova)
  setItem(KEYS.scoreCollectif, state.scoreCollectif)
  setItem(KEYS.enigmes, state.enigmesSolues)
  setItem(KEYS.temps, state.temps)
  setItem(KEYS.jokers, state.jokers)
}
