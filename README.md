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

Le jeu comporte **4 énigmes** de cybersécurité réparties sur 3 phases.

Les réponses sont vérifiées côté client (minuscules, sans espaces superflus). Aucune solution n'est transmise à un serveur.

---

## Solutions complètes

> **⚠ SPOILERS** — Section réservée aux organisateurs et à l'équipe technique.

---

### Phase 1 — Énigme ROT13

**Message chiffré affiché :**
```
Yn pyé qr ibûgr rfg : syntzr
```

**Méthode :** ROT13 décale chaque lettre de 13 positions dans l'alphabet (A↔N, B↔O, ..., Z↔M). Les caractères spéciaux (`û`, `:`, espaces) ne sont pas modifiés.

**Déchiffrement lettre par lettre :**
```
Y  → L
n  → a
(espace)
p  → c
y  → l
é  → é  (caractère spécial, inchangé)
(espace)
q  → d
r  → e
(espace)
i  → v
b  → o
û  → û  (inchangé)
g  → t
r  → e
(espace)
r  → e
f  → s
g  → t
(espace)
:  → :  (inchangé)
(espace)
s  → f
y  → l
n  → a
t  → g
z  → m
r  → e
```

**Réponse à saisir :**
```
la clé de voûte est : flamme
```

> Outil en ligne : [rot13.com](https://rot13.com) — coller le texte chiffré et lire le résultat.

---

### Phase 2A — Énigme Base64

**Chaîne encodée affichée :**
```
T3BwdXJyZW5jZSA6IG9wZXJhdGlvbiBwaG9lbml4
```

**Méthode :** décodage Base64 standard.

Depuis la console du navigateur (F12) :
```js
atob('T3BwdXJyZW5jZSA6IG9wZXJhdGlvbiBwaG9lbml4')
```

Depuis un terminal Linux/Mac :
```bash
echo 'T3BwdXJyZW5jZSA6IG9wZXJhdGlvbiBwaG9lbml4' | base64 -d
```

**Réponse à saisir :**
```
occurrence : operation phoenix
```

---

### Phase 2B — Énigme Terminal Linux

Le joueur dispose d'un terminal simulé avec le système de fichiers suivant :

```
/home/sk1ll/
├── mission.txt      ← fichier cible
├── .bash_history
└── notes.enc
```

**Commandes à taper dans le terminal :**

```bash
ls -la
```
→ liste les fichiers du répertoire courant (`/home/sk1ll`)

```bash
cat mission.txt
```
→ affiche le contenu du fichier, dont la dernière ligne utile :

```
Agent confirmé. Code : VORTEX
```

**Code à saisir dans le champ de validation :**
```
VORTEX
```

> Les commandes `ls`, `ls -la`, `cat <fichier>`, `pwd`, `cd`, `clear`, `help` sont toutes acceptées. Les commandes inconnues retournent `bash: commande introuvable`.

---

### Phase 3 — Énigme Analyse de logs

**10 lignes de logs sont affichées. Le joueur doit cliquer sur la ligne suspecte.**

```
2025-03-14 02:11:05 | 10.0.0.12  | GET  /api/status | 200 | user: daemon    ← normale
2025-03-14 02:14:33 | 10.0.0.45  | GET  /api/health | 200 | user: monitor   ← normale
2025-03-14 02:30:18 | 10.0.0.12  | POST /api/auth   | 200 | user: admin     ← normale
2025-03-14 02:45:00 | 10.0.0.45  | GET  /api/status | 200 | user: daemon    ← normale
2025-03-14 03:00:12 | 10.0.0.33  | GET  /api/users  | 200 | user: admin     ← normale
2025-03-14 03:15:22 | 10.0.0.12  | GET  /api/logs   | 200 | user: admin     ← normale
2025-03-14 03:47:22 | 192.168.0.253 | POST /api/exfil | 200 | user: root   ← SUSPECTE ✓
2025-03-14 03:52:44 | 10.0.0.12  | GET  /api/status | 200 | user: daemon    ← normale
2025-03-14 04:01:09 | 10.0.0.45  | GET  /api/health | 200 | user: monitor   ← normale
2025-03-14 04:10:55 | 10.0.0.33  | POST /api/report | 200 | user: admin     ← normale
```

**Ligne suspecte (ligne 7) :**
```
2025-03-14 03:47:22 | 192.168.0.253 | POST /api/exfil | 200 | user: root
```

**Indices de détection :**
- IP `192.168.0.253` — hors du format interne `10.0.0.x`
- Endpoint `/api/exfil` — exfiltration de données
- Heure `03:47` — activité nocturne anormale
- Utilisateur `root` — compte hautement privilégié

---

### Récapitulatif des réponses

| Phase | Énigme | Réponse / Action |
|-------|--------|-----------------|
| 1 | ROT13 | `la clé de voûte est : flamme` |
| 2A | Base64 | `occurrence : operation phoenix` |
| 2B | Terminal | taper `ls -la` → `cat mission.txt` → saisir `VORTEX` |
| 3 | Logs | cliquer la ligne `192.168.0.253 POST /api/exfil` |

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
| Khadidiatou Konte | Lead Dev & Game Design |
| Mateo Perez | Frontend & UI |
| Alex Laudrin | Narration & Scénario |
| Robin Pettito | Énigmes & Cybersécurité |
| Pierre Bekonno | Intégration & Déploiement |

---

## Licence

MIT — voir [LICENSE](LICENSE)

