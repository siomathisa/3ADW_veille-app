export function qualifierPrompt({ url, titre, description, contenu }) {
  return `Tu es un agent de veille intelligent. Analyse cette source et retourne un JSON structuré.

Source :
- URL : ${url}
- Titre : ${titre || 'Non disponible'}
- Description : ${description || 'Non disponible'}
${contenu ? `- Extrait du contenu : ${contenu.slice(0, 800)}` : ''}

Retourne UNIQUEMENT un JSON valide avec ces champs :
{
  "titre": "titre de la source, clair et concis",
  "type": "article | vidéo | post | podcast | autre",
  "provenance": "nom du site ou de l'auteur",
  "legitimite": "haute | moyenne | faible",
  "interet": "pourquoi cette source est intéressante (2-3 phrases max)",
  "apportPersonnel": "en quoi cette source augmente les compétences du veilleur (1-2 phrases)",
  "categorie": "métier | pro | perso | culture",
  "tags": ["tag1", "tag2", "tag3"],
  "humeur": "positif | neutre | négatif"
}

Règles absolues :
- N'utilise jamais de tirets longs (—) dans tes textes
- Utilise des virgules, points-virgules ou tirets courts (-)
- Sois concis et direct, ton humain et naturel
- Retourne uniquement le JSON, sans texte avant ou après`
}

export function genererPrompt({ source }) {
  return `Tu es un veilleur-commentateur expert qui transforme des sources en posts LinkedIn à haute valeur ajoutée.

Source à traiter :
- Titre : ${source.titre}
- URL : ${source.url}
- Provenance : ${source.provenance || 'inconnue'}
- Pourquoi c'est intéressant : ${source.interet}
- Apport personnel : ${source.apportPersonnel}
- Tags : ${(source.tags || []).join(', ')}
- Catégorie : ${source.categorie}

Génère un post LinkedIn qui :
1. Accroche dès la première ligne (sans commencer par "Je")
2. Apporte une perspective personnelle avec un angle commentateur
3. Partage l'essentiel de la veille avec une valeur ajoutée claire
4. Se termine par une question ou un call-to-action engageant
5. Fait entre 150 et 300 mots
6. Inclut 3-5 hashtags pertinents à la fin

Règles absolues :
- N'utilise JAMAIS de tirets longs (—), remplace-les par des virgules ou des tirets courts (-)
- Ton naturel et humain, pas corporate
- Pas de formules creuses ("Dans un monde où...", "Il est crucial de...")
- Retourne uniquement le post, prêt à copier-coller`
}

export function rechercheSynthesePrompt({ question, sources }) {
  const contexte = sources.map((s, i) => `Source ${i + 1} :
- Titre : ${s.titre}
- URL : ${s.url}
- Catégorie : ${s.categorie}
- Tags : ${(s.tags || []).join(', ')}
- Pourquoi intéressant : ${s.interet}
- Apport personnel : ${s.apportPersonnel}`).join('\n\n')

  return `Tu es l'assistant de recherche d'une base de veille personnelle. Réponds à la question de l'utilisateur UNIQUEMENT à partir des sources fournies ci-dessous, qui viennent de sa propre base de veille.

Question : ${question}

Sources disponibles :
${contexte}

Consignes :
- Réponds directement à la question en t'appuyant sur les sources pertinentes
- Cite les sources utilisées par leur titre
- Si aucune source ne permet de répondre correctement, dis-le clairement plutôt que d'inventer
- N'utilise jamais de tirets longs (—), remplace par des virgules ou des tirets courts (-)
- Ton direct et naturel, 3-6 phrases maximum`
}

export function veilleWebPrompt({ sujet }) {
  return `Tu es un agent de veille technologique. Cherche sur le web des sources récentes et fiables sur le sujet suivant : "${sujet}".

Utilise l'outil de recherche web pour trouver 3 à 5 articles ou pages pertinentes, récentes et provenant de sources reconnues.

Une fois la recherche terminée, retourne UNIQUEMENT un JSON (tableau), sans texte avant ou après, avec ce format :
[
  {
    "titre": "titre de l'article",
    "url": "URL exacte trouvée par la recherche",
    "provenance": "nom du site",
    "resume": "résumé en 1-2 phrases de pourquoi c'est pertinent pour la veille"
  }
]

Règles :
- Uniquement des URLs réellement trouvées via l'outil de recherche, jamais inventées
- Pas de tirets longs (—), utilise des virgules ou des tirets courts (-)
- Sois concis et factuel`
}

export function seoPrompt({ source }) {
  return `Tu es un expert SEO qui optimise du contenu pour le référencement naturel, sans dénaturer le fond.

Source :
- Titre original : ${source.titre}
- Sujet : ${source.interet}
- Tags : ${(source.tags || []).join(', ')}
- Contenu déjà rédigé : ${source.contenuGenere || 'aucun'}

Retourne UNIQUEMENT un JSON avec ce format :
{
  "titreSeo": "titre optimisé SEO, 60 caractères max, avec le mot-clé principal en avant",
  "metaDescription": "description de 150-160 caractères qui donne envie de cliquer",
  "motsCles": ["mot-clé principal", "mot-clé secondaire 1", "mot-clé secondaire 2"],
  "suggestionStructure": "1-2 phrases sur comment structurer le contenu pour le référencement (titres, longueur, liens internes...)"
}

Règles :
- Pas de tirets longs (—), utilise des virgules ou des tirets courts (-)
- Reste factuel, pas de bourrage de mots-clés
- Retourne uniquement le JSON`
}

export function pertinencePrompt({ source }) {
  return `Analyse la perception et l'humeur générale autour de cette source.

URL : ${source.url}
Titre : ${source.titre}
Résumé : ${source.interet}

Retourne UNIQUEMENT un JSON :
{
  "humeur": "positif | neutre | négatif",
  "resumeReactions": "résumé des arguments pour et contre (2-3 phrases directes)"
}

Règles : pas de tirets longs (—), ton factuel et direct. Retourne uniquement le JSON.`
}
