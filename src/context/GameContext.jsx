import React, { createContext, useContext, useReducer, useEffect, useRef, useCallback } from 'react'
import { loadState, saveState, clearAll } from '../utils/storage'

const GameContext = createContext(null)

const initialState = {
  phase: 'intro',
  scoreNova: 0,
  scoreCollectif: 0,
  enigmesSolues: [],
  temps: 600,
  timerActif: false,
  finForcee: null,
  jokers: 2,
}

function reducer(state, action) {
  switch (action.type) {
    case 'LOAD':
      return { ...state, ...action.payload, timerActif: false, finForcee: null }
    case 'SET_PHASE':
      return { ...state, phase: action.payload }
    case 'ADD_SCORE':
      if (action.faction === 'nova') return { ...state, scoreNova: state.scoreNova + action.points }
      if (action.faction === 'collectif') return { ...state, scoreCollectif: state.scoreCollectif + action.points }
      return state
    case 'RESOUDRE_ENIGME':
      if (state.enigmesSolues.includes(action.id)) return state
      return { ...state, enigmesSolues: [...state.enigmesSolues, action.id] }
    case 'TICK':
      if (state.temps <= 0) return { ...state, temps: 0 }
      return { ...state, temps: state.temps - 1 }
    case 'USE_JOKER':
      if (state.jokers === 0 || state.temps < 60) return state
      return { ...state, jokers: state.jokers - 1, temps: state.temps - 60 }
    case 'SET_TIMER_ACTIF':
      return { ...state, timerActif: action.payload }
    case 'FIN_FORCEE':
      return { ...state, phase: 'fin', finForcee: action.payload, timerActif: false }
    case 'RESET':
      clearAll()
      return { ...initialState }
    default:
      return state
  }
}

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  const intervalRef = useRef(null)

  // Load persisted state on mount
  useEffect(() => {
    const saved = loadState()
    if (saved.phase !== 'intro') {
      dispatch({ type: 'LOAD', payload: saved })
    }
  }, [])

  // Persist on every change
  useEffect(() => {
    if (state.phase !== 'intro') {
      saveState(state)
    }
  }, [state])

  // Timer
  useEffect(() => {
    if (state.timerActif && state.phase !== 'fin' && state.phase !== 'intro') {
      intervalRef.current = setInterval(() => {
        dispatch({ type: 'TICK' })
      }, 1000)
    } else {
      clearInterval(intervalRef.current)
    }
    return () => clearInterval(intervalRef.current)
  }, [state.timerActif, state.phase])

  // Timer reaches 0 → force end
  useEffect(() => {
    if (state.temps === 0 && state.timerActif) {
      const fin = state.scoreNova >= state.scoreCollectif ? 'A' : 'B'
      dispatch({ type: 'FIN_FORCEE', payload: fin })
    }
  }, [state.temps, state.timerActif, state.scoreNova, state.scoreCollectif])

  const startGame = useCallback(() => {
    dispatch({ type: 'SET_PHASE', payload: 'phase1' })
    dispatch({ type: 'SET_TIMER_ACTIF', payload: true })
  }, [])

  const setPhase = useCallback((phase) => {
    dispatch({ type: 'SET_PHASE', payload: phase })
  }, [])

  const addScore = useCallback((faction, points) => {
    dispatch({ type: 'ADD_SCORE', faction, points })
  }, [])

  const resoudreEnigme = useCallback((id) => {
    dispatch({ type: 'RESOUDRE_ENIGME', id })
  }, [])

  const terminerPartie = useCallback((fin) => {
    dispatch({ type: 'FIN_FORCEE', payload: fin })
  }, [])

  const resetGame = useCallback(() => {
    clearInterval(intervalRef.current)
    dispatch({ type: 'RESET' })
  }, [])

  const useJoker = useCallback(() => {
    dispatch({ type: 'USE_JOKER' })
  }, [])

  const factionDominante = state.scoreNova > state.scoreCollectif
    ? 'nova'
    : state.scoreCollectif > state.scoreNova
    ? 'collectif'
    : 'neutre'

  return (
    <GameContext.Provider value={{
      ...state,
      factionDominante,
      startGame,
      setPhase,
      addScore,
      resoudreEnigme,
      terminerPartie,
      resetGame,
      useJoker,
    }}>
      {children}
    </GameContext.Provider>
  )
}

export function useGame() {
  const ctx = useContext(GameContext)
  if (!ctx) throw new Error('useGame must be used inside GameProvider')
  return ctx
}
