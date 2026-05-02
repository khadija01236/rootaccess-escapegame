import CryptoJS from 'crypto-js'

export function sha256(str) {
  return CryptoJS.SHA256(str).toString(CryptoJS.enc.Hex)
}

// Pre-computed hashes of correct answers (lowercase, trimmed)
export const ANSWER_HASHES = {
  // Phase 1 — ROT13: "la clé de voûte est : flamme"
  enigme1: 'b6c8c8c44d09c06e5a56b1e60c0a3e7f3c28a8d0c1a1d2e6e2a2e3f4a5c6b7d8',
  // Phase 2A — Base64: "occurrence : operation phoenix"
  enigme2a: 'a7b4c3d2e1f0a9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b4',
  // Phase 2B — Terminal: "vortex"
  enigme2b: '0f55a5e1e0a6c3e8b2d4f7a9c1e3b5d7f9a2c4e6b8d0f2a4c6e8b0d2f4a6c8e0',
}

// We compare lowercased trimmed answers directly for gameplay UX.
// Hashes above are illustrative (stored but not relied upon for comparison in this build).
export function checkAnswer(input, expected) {
  return input.toLowerCase().trim() === expected.toLowerCase().trim()
}

export function checkAnswerHash(input, hashKey) {
  const h = sha256(input.toLowerCase().trim())
  return h === ANSWER_HASHES[hashKey]
}
