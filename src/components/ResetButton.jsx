import React, { useState, useEffect, useRef } from 'react'
import { useGame } from '../context/GameContext'

export default function ResetButton() {
  const { resetGame } = useGame()
  const [showModal, setShowModal] = useState(false)
  const cancelRef = useRef(null)

  // ESC = annuler (le timer continue intentionnellement pendant la modale :
  // mettre le jeu en pause serait un vecteur de triche pour gagner du temps de réflexion)
  useEffect(() => {
    if (!showModal) return
    function onKeyDown(e) {
      if (e.key === 'Escape') setShowModal(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [showModal])

  // Focus sur ANNULER à l'ouverture (choix le plus sûr)
  useEffect(() => {
    if (showModal) cancelRef.current?.focus()
  }, [showModal])

  function confirm() {
    setShowModal(false)
    resetGame()
  }

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        aria-label="Réinitialiser la partie"
        className="text-xs font-mono px-2 py-1 border border-gray-800 text-gray-600 rounded
                   hover:border-gray-500 hover:text-gray-300 focus:outline-none focus:border-gray-500
                   focus:text-gray-300 transition-all duration-200 select-none"
      >
        [↻ RESET]
      </button>

      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={() => setShowModal(false)}
        >
          <div
            className="w-full max-w-sm border border-gray-700 bg-[#0d0d0d] rounded p-6 font-mono
                       shadow-2xl mx-4"
            onClick={e => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="reset-modal-title"
          >
            <div
              id="reset-modal-title"
              className="font-bold text-sm mb-2 text-gray-200"
            >
              Abandonner la partie en cours ?
            </div>
            <p className="text-gray-500 text-xs leading-6 mb-6">
              Toute progression sera perdue. Cette action est irréversible.
            </p>
            <div className="flex gap-3 flex-wrap">
              <button
                onClick={confirm}
                className="btn-danger text-xs px-4 py-2"
              >
                [CONFIRMER LE RESET]
              </button>
              <button
                ref={cancelRef}
                onClick={() => setShowModal(false)}
                className="btn-ghost text-xs px-4 py-2 focus:outline-none focus:border-gray-400
                           focus:text-gray-200"
              >
                [ANNULER]
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
