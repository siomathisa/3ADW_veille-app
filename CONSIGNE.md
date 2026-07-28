# CONSIGNE PROJET — Veille Intelligente avec IA
> Bachelor 3 Dev Web — Matières : IA + Veille (évaluation septembre)

---

## 🎯 Objectif du projet

Créer une **web app de veille personnelle** qui fonctionne comme un **second cerveau** : une base de connaissances triée et fiable, alimentée par ta propre veille, dans laquelle tu pourras lancer des recherches avec un haut degré de confiance — parce que c'est toi qui auras sourcé, et l'IA qui aura bien rangé.

> ⚠️ **Point clé absolu** : Si ta veille ne débouche sur rien, un NotebookLM ou un ChatGPT font déjà le job. Ce N'EST PAS l'exercice. Ce que le prof veut voir au bout de la chaîne, c'est de la **création**. Le mot-clé du projet : **valeur ajoutée**.

---

## 📦 Le livrable

Une web app de veille articulée en **4 temps** : capter → qualifier → ranger → republier avec valeur ajoutée.

---

## ✅ Socle minimum (obligatoire)

### 1. CAPTER — Ingestion de sources

L'app doit permettre d'**envoyer des sources directement dedans** via :
- Un formulaire (coller une URL)
- Un bot ou tout autre mécanisme justifié

**Fonctionnalités attendues :**
- Capture d'URLs (articles, vidéos, posts réseaux sociaux)
- Cartographie des sources entrantes (liste / tableau de bord)
- Les sources doivent être visibles et navigables dans l'interface

---

### 2. QUALIFIER — Analyse automatique par l'IA

Chaque source doit être **triée et documentée automatiquement** par un agent IA avec les champs suivants :

| Champ | Description |
|---|---|
| **Légitimité** | La source est-elle fiable ? (haute / moyenne / faible) |
| **Provenance** | D'où vient la source ? (nom du site, auteur, plateforme) |
| **Type** | Article / Vidéo / Post réseaux sociaux / Podcast / Autre |
| **Pourquoi intéressant** | Résumé de l'intérêt de la source |
| **En quoi ça t'augmente** | Apport personnel concret |
| **Catégorie** | Métier / Pro / Perso / Culture |

---

### 3. RANGER — Classement automatique

**Modèle de données imposé par le prof :**
```
Source → Article → Tags
```

**Règles :**
- Un agent IA décide automatiquement du classement dans le bon dossier
- Les dossiers/catégories sont définis en amont
- **Une source peut avoir plusieurs tags** (ex : un article sur Claude Code = IA + automatisation + dev)
- L'utilisateur peut **ajouter ou corriger des tags manuellement** si l'IA ne les a pas détectés
- Le système doit être **scalable** : pouvoir ajouter de nouvelles catégories et tags facilement

---

### 4. REPUBLIER AVEC VALEUR AJOUTÉE — Point évalué, non négociable

> C'est le cœur de l'évaluation. Recevoir → Digérer → Restituer avec valeur ajoutée.

L'app doit permettre de **générer du contenu à partir des sources** :
- Prendre une source, la digérer, la restituer avec une plus-value
- L'objectif n'est pas d'être créateur de contenu, mais **veilleur-commentateur**

**La valeur ajoutée sert à :**
- **Personal branding** : renforcer son profil, gagner en visibilité
- **Posture marque/entreprise** : faire du social media rapidement

**Formes possibles de republication :**
- Post LinkedIn généré automatiquement
- Article / thread réseaux sociaux
- Résumé commenté avec angle personnel
- Retranscription et optimisation d'un commentaire audio

**Règle de style absolue pour tout le contenu généré :**
Ne jamais utiliser de tirets longs (—) dans les textes produits par l'IA. C'est le marqueur le plus visible d'un texte généré automatiquement. Utiliser à la place des virgules, des points-virgules ou des tirets courts (-). Le ton doit sonner naturel et humain, pas corporate. Cette règle doit être intégrée dans tous les prompts envoyés à Claude.

---

## ⭐ Bonus (pour aller plus loin)

### Agent "Pertinence"
Un agent qui va **collecter les commentaires et réactions** autour d'une source (sur les réseaux, dans les commentaires d'un article) pour déterminer :
- L'article est-il bien ou mal perçu ?
- Quels sont les arguments pour / contre ?
- Quelle est "l'humeur" de l'article ?

> Cela permet d'affiner la pertinence globale de l'app et de gagner du temps dans l'analyse.

### Capture dictaphone terrain
- Enregistrement vocal à la volée (en réunion, à VivaTech, en dîner...)
- Retranscription automatique en texte
- Transformation en pense-bête ou brouillon d'article

### Agents / Skills SEO
- Optimisation du contenu republié pour le référencement naturel
- Agents spécialisés avec footprint SEO
- Structure et ton optimisés pour la visibilité

---

## 🗄️ Modèle de données Firestore (Firebase)

### Collection `sources`
```json
{
  "id": "auto-generated",
  "url": "https://...",
  "titre": "Titre de la source",
  "type": "article | vidéo | post | note-vocale",
  "provenance": "Nom du site / auteur",
  "legitimite": "haute | moyenne | faible",
  "interet": "Résumé de pourquoi c'est intéressant",
  "apportPersonnel": "En quoi ça m'augmente",
  "categorie": "métier | pro | perso | culture",
  "tags": ["LLM", "Claude", "benchmark", "gratuit"],
  "humeur": "positif | neutre | négatif",
  "resumeReactions": "Résumé des réactions externes",
  "contenuGenere": "Post LinkedIn ou article généré",
  "statut": "à-traiter | traité | publié",
  "dateAjout": "timestamp"
}
```

---

## 🏗️ Stack technique recommandée

| Outil | Usage |
|---|---|
| **Next.js** | Framework frontend + backend (API routes) |
| **Firebase / Firestore** | Base de données + Auth |
| **API Anthropic (Claude Sonnet)** | Agent de qualification + génération de contenu |
| **Vercel** | Hébergement (branché sur GitHub) |
| **GitHub** | Versioning + déploiement automatique |

---

## 📂 Catégories de veille (exemple personnel)

### Catégorie 1 : LLM & IA *(catégorie principale)*
**Objectif :** Savoir quel LLM utiliser pour quoi, gratuit ou payant, et lequel est le meilleur pour chaque usage (code, image, rédaction, agents...).

**Tags suggérés :**
- Modèles : `Claude`, `ChatGPT`, `Gemini`, `Mistral`, `Llama`, `Grok`
- Usages : `génération-image`, `code`, `rédaction`, `analyse`, `agents`
- Critères : `gratuit`, `payant`, `rapport-qualité-prix`, `benchmark`
- Actualité : `nouvelle-version`, `comparatif`, `pricing`, `cas-usage`

*(D'autres catégories à ajouter au fil du projet)*

---

## 📋 Critères d'évaluation

L'évaluation est alignée sur les **blocs de compétences** :

```
Recevoir → Digérer → Restituer à valeur ajoutée
```

| Critère | Poids |
|---|---|
| Capture et ingestion de sources | Obligatoire |
| Qualification automatique par l'IA | Obligatoire |
| Classement Source → Article → Tags + édition manuelle | Obligatoire |
| **Republication avec valeur ajoutée** | **Point clé évalué** |
| Agent pertinence | Bonus |
| Dictaphone terrain | Bonus |
| SEO | Bonus |

> **Passage en septembre.**

---

## 🗓️ Planning suggéré (avant coaching du 15 juin)

| Jours | Objectif |
|---|---|
| Jour 1-2 | Init Next.js + Firebase + formulaire de capture |
| Jour 3-4 | Agent IA de qualification (API Anthropic) |
| Jour 5-6 | Génération de contenu (republication) |
| Jour 7 | Édition manuelle des tags + déploiement Vercel |

---

## 💡 Ce que le prof veut voir au coaching du 15 juin

Une app qui tourne vraiment, avec au minimum :
- ✅ Pouvoir coller une URL et la voir sauvegardée
- ✅ La source qualifiée automatiquement par l'IA (type, légitimité, tags...)
- ✅ Un bouton pour générer un post/contenu à partir de la source
- ✅ L'app déployée et accessible en ligne (Vercel)

---

---

## 🔑 Ce que TU dois faire manuellement (Claude Code ne peut pas le faire)

### 1. Firebase
1. Va sur [console.firebase.google.com](https://console.firebase.google.com)
2. "Créer un projet" → nom : `veille-app`
3. Désactive Google Analytics (inutile)
4. Dans le projet → **Firestore Database** → "Créer une base de données" → **mode test**
5. Clique sur l'icône **`</>`** (Web) → enregistre l'app → récupère le bloc `firebaseConfig`
6. Garde ce bloc de côté, il ira dans `.env.local`

### 2. API Anthropic
1. Va sur [console.anthropic.com](https://console.anthropic.com)
2. Crée un compte si pas déjà fait
3. Ajoute **5€** de crédits (largement suffisant)
4. Génère une **clé API** → garde-la de côté

### 3. GitHub
1. Crée un repo sur [github.com](https://github.com) → nom : `veille-app` → **privé**
2. Clone-le en local ou laisse Claude Code init le projet dedans

### 4. Vercel (à faire quand l'app tourne en local)
1. Va sur [vercel.com](https://vercel.com) → connecte ton GitHub
2. "Import project" → sélectionne `veille-app`
3. Ajoute les variables d'environnement (les mêmes que `.env.local`)
4. Deploy → c'est en ligne

### 5. Fichier `.env.local` (à créer à la racine du projet)
```bash
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=xxx
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=xxx.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=xxx
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=xxx.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=xxx
NEXT_PUBLIC_FIREBASE_APP_ID=xxx

# Anthropic
ANTHROPIC_API_KEY=sk-ant-xxx
```

> ⚠️ Ne jamais commit `.env.local` sur GitHub. Vérifie que `.gitignore` l'inclut (Next.js le fait automatiquement).

---

## 🗂️ Architecture des dossiers et fichiers

```
veille-app/
│
├── .env.local                          # Variables d'environnement (jamais committé)
├── .gitignore
├── CONSIGNE.md                         # Ce fichier
├── next.config.js
├── package.json
│
├── src/
│   │
│   ├── app/                            # App Router Next.js
│   │   ├── layout.js                   # Layout global (navbar etc.)
│   │   ├── page.js                     # Page d'accueil → dashboard
│   │   │
│   │   ├── sources/
│   │   │   ├── page.js                 # Liste de toutes les sources
│   │   │   └── [id]/
│   │   │       └── page.js             # Détail d'une source
│   │   │
│   │   ├── ajouter/
│   │   │   └── page.js                 # Formulaire d'ajout d'une source (URL)
│   │   │
│   │   └── publier/
│   │       └── page.js                 # Page de republication / contenu généré
│   │
│   ├── api/                            # API Routes Next.js (appels serveur)
│   │   ├── qualifier/
│   │   │   └── route.js                # Appel Claude → qualifie une source
│   │   ├── generer/
│   │   │   └── route.js                # Appel Claude → génère un post LinkedIn
│   │   └── pertinence/
│   │       └── route.js                # Bonus : agent humeur/réactions
│   │
│   ├── components/                     # Composants React réutilisables
│   │   ├── Navbar.js
│   │   ├── SourceCard.js               # Carte d'affichage d'une source
│   │   ├── SourceForm.js               # Formulaire d'ajout d'URL
│   │   ├── TagBadge.js                 # Badge visuel pour un tag
│   │   ├── TagEditor.js                # Édition manuelle des tags
│   │   └── PostGenere.js               # Affichage du contenu généré
│   │
│   ├── lib/                            # Utilitaires et config
│   │   ├── firebase.js                 # Init Firebase + export db
│   │   ├── anthropic.js                # Init client Anthropic
│   │   └── prompts.js                  # Tous les prompts envoyés à Claude
│   │
│   └── hooks/                          # Hooks React custom
│       ├── useSources.js               # Fetch et écoute les sources Firestore
│       └── useSource.js                # Fetch une source par ID
│
└── public/                             # Assets statiques
    └── favicon.ico
```

### Rôle de chaque dossier clé

| Dossier | Ce qu'il contient |
|---|---|
| `app/` | Les pages de l'app (ce que l'utilisateur voit) |
| `api/` | Les routes serveur qui appellent Claude (clé API sécurisée ici) |
| `components/` | Les briques UI réutilisables |
| `lib/` | La config Firebase, Anthropic, et les prompts |
| `hooks/` | La logique de récupération des données Firestore |

> 💡 **Conseil pour Claude Code** : montre-lui cette architecture dès le début et dis-lui de la respecter. Ça évitera qu'il parte dans tous les sens.

---

*Document généré pour accompagner le développement du projet — à placer à la racine du repo GitHub.*
