# Double Agent — Escape Game Cyberpunk

> Infiltrez NovaCorp. Choisissez votre camp. Survivez.

**Double Agent** est un escape game cyberpunk jouable dans le navigateur, développé par l'équipe **RootAccess** dans le cadre du projet ESGI B3 2025-2026.

---

## Scénario

Vous incarnez **SK1LL**, agent double infiltré au sein de **NovaCorp** — courtier clandestin en vulnérabilités zero-day.

Deux factions vous contactent simultanément :
- **NovaCorp** veut que vous exfiltriez leurs données concurrentes
- **Le Collectif** hacktiviste veut que vous détruisiez NovaCorp de l'intérieur

Vos choix façonnent l'histoire. Trois fins vous attendent.

---

## Capture d'écran

```
┌─────────────────────────────────────────────────────┐
│  DOUBLE AGENT                    ⚠ Verrouillage: 07:42 │
├─────────────────────────────────────────────────────┤
│  PHASE 1 — Infiltration                             │
│                                                     │
│  > Énigme : Yn pyé qr ibûgr rfg : syntzr           │
│  [ Votre réponse... ]  [VALIDER]                    │
│                                                     │
│  [> RÉPONDRE À NOVACORP]  [> CONTACTER LE COLLECTIF]│
└─────────────────────────────────────────────────────┘
```

---

## Prérequis

- **Node.js** >= 18
- **npm** >= 9

---

## Installation & lancement

```bash
git clone https://github.com/khadija01236/rootaccess-escapegame.git
cd rootaccess-escapegame
npm install
npm run dev
```

Ouvrez ensuite [http://localhost:5173](http://localhost:5173) dans votre navigateur.

### Build de production

```bash
npm run build
npm run preview
```

### Déploiement GitHub Pages

```bash
npm run build
# Déployez le dossier dist/ sur la branche gh-pages
```

---

## Gameplay

La partie dure **10 minutes maximum**. Trois phases narratives s'enchaînent :

| Phase | Contenu | Choix de faction |
|-------|---------|-----------------|
| 1 — Infiltration | Prise de contrôle du terminal NovaCorp | NovaCorp / Collectif |
| 2 — Double Jeu | Analyse de fichiers encodés | NovaCorp / Collectif |
| 3 — Point de non-retour | Alerte système, décision finale | NovaCorp / Collectif / Fantôme |

### Les 3 fins

- **Fin A — Loyal** : SK1LL reste fidèle à NovaCorp
- **Fin B — Rebelle** : SK1LL trahit NovaCorp pour le Collectif
- **Fin C — Fantôme** : SK1LL disparaît des deux côtés *(choix spécial en phase 3)*

---

## Énigmes

Le jeu comporte **4 énigmes** de cybersécurité (sans spoil) :

1. **ROT13** — Déchiffrement d'un message intercepté sur le réseau interne
2. **Base64** — Décodage d'une chaîne encodée extraite des logs
3. **Terminal Linux** — Navigation dans un système de fichiers simulé (`ls`, `cat`, ...)
4. **Analyse de logs** — Identification d'une ligne suspecte dans des journaux système

Les réponses sont vérifiées côté client (minuscules, sans espaces superflus). Aucune solution n'est transmise à un serveur.

---

## Structure du projet

```
src/
├── components/
│   ├── Terminal.jsx        ← terminal Linux simulé
│   ├── Timer.jsx           ← compte à rebours narratif
│   ├── EnigmeCard.jsx      ← affichage d'une énigme texte
│   └── ChoixNarratif.jsx   ← boutons de choix de faction
├── pages/
│   ├── Accueil.jsx         ← écran de démarrage
│   ├── Jeu.jsx             ← page principale (3 phases)
│   └── FinPartie.jsx       ← écran de fin (3 fins)
├── data/
│   └── sequences.json      ← narrations, énigmes, fins
├── context/
│   └── GameContext.jsx     ← état global (phase, scores, timer)
└── utils/
    ├── hash.js             ← vérification des réponses
    └── storage.js          ← SessionStorage (clés da_*)
```

### SessionStorage

| Clé | Valeur |
|-----|--------|
| `da_phase` | Phase courante (`intro` \| `phase1` \| `phase2` \| `phase3` \| `fin`) |
| `da_score_nova` | Nombre de choix NovaCorp |
| `da_score_collectif` | Nombre de choix Collectif |
| `da_enigmes` | Tableau JSON des IDs d'énigmes résolues |
| `da_temps` | Secondes restantes |

---

## Stack technique

- **React 18** + **Vite**
- **Tailwind CSS** (dark UI hacker terminal)
- **React Context API** (GameContext)
- **SessionStorage** (persistance locale)
- **crypto-js** (hachage SHA-256)
- Police : JetBrains Mono (Google Fonts)

---

## Équipe RootAccess

| Membre | Rôle |
|--------|------|
| Khadidiatou Konte
---

## Licence

MIT — voir [LICENSE](LICENSE)

