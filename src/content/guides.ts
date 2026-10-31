export type Section = { h2: string; p?: string[]; list?: string[]; cta?: { label: string; href: string } };
export type Guide = {
  slug: string;
  title: string;
  description: string;
  h1: string;
  intro: string[];
  sections: Section[];
  faq: { q: string; a: string }[];
  published: string;
  updated: string;
};

export const GUIDES: Guide[] = [
  {
    slug: "analyse-lineaire-methode",
    title: "Analyse linéaire : la méthode complète pour le bac de français 2027",
    description: "Méthode de l'analyse linéaire pour le bac de français 2027 : introduction, projet de lecture, mouvements, procédés, conclusion. Étapes, erreurs à éviter et exemple.",
    h1: "Analyse linéaire : la méthode complète pour réussir le bac de français",
    intro: [
      "L'analyse linéaire, appelée aussi explication linéaire, est le cœur de la première partie de l'oral du bac de français. Elle compte pour 8 points sur 20 : c'est l'exercice qui pèse le plus lourd le jour de l'épreuve.",
      "Le principe est simple à énoncer mais exigeant à appliquer : tu expliques le texte dans l'ordre, du début à la fin, en montrant comment chaque passage construit le sens. Voici la méthode étape par étape, avec les erreurs qui coûtent le plus de points.",
    ],
    sections: [
      {
        h2: "Ce que le jury attend vraiment",
        p: [
          "Le jury ne veut pas une liste de figures de style. Il veut voir que tu comprends le texte et que tu sais justifier ton interprétation par des éléments précis : des mots, des images, des sonorités, une construction de phrase.",
          "Chaque remarque doit donc suivre le même mouvement : je cite, je nomme le procédé, j'explique l'effet produit et je le relie au sens global du texte. Un procédé identifié sans effet ne rapporte presque rien.",
        ],
      },
      {
        h2: "Étape 1 : l'introduction",
        list: [
          "Situer le texte : l'auteur, l'œuvre, le contexte en une ou deux phrases utiles, sans biographie.",
          "Présenter l'extrait : ce qui se passe, sa place dans l'œuvre.",
          "Formuler le projet de lecture (la problématique) : la question à laquelle ton explication va répondre.",
          "Annoncer les mouvements du texte, c'est-à-dire ses grandes étapes, avec les lignes ou les vers concernés.",
        ],
        p: ["Le projet de lecture est le fil rouge de toute l'explication. Une bonne question commence souvent par « Comment » ou « En quoi » et porte sur ce que le texte fait, pas seulement sur ce qu'il raconte."],
      },
      {
        h2: "Étape 2 : découper le texte en mouvements",
        p: [
          "Un mouvement est une étape cohérente du texte : un changement de lieu, de ton, de locuteur, de temps verbal ou d'idée. La plupart des extraits se découpent en deux à quatre mouvements.",
          "Donne un titre à chaque mouvement. Ce titre doit déjà dire quelque chose de l'interprétation : « la majesté de l'oiseau » est plus utile que « les vers 1 à 4 ».",
        ],
      },
      {
        h2: "Étape 3 : expliquer au fil du texte",
        p: [
          "C'est le corps de l'analyse. Tu avances dans l'ordre du texte, mouvement par mouvement. Pour chaque passage important, applique la règle citation, procédé, effet, interprétation.",
          "Ne cherche pas à tout commenter. Sélectionne les éléments les plus significatifs, ceux qui servent ton projet de lecture, et va en profondeur plutôt qu'en largeur.",
        ],
        list: [
          "Citer précisément : quelques mots suffisent, pas des phrases entières.",
          "Nommer le procédé avec le bon vocabulaire (métaphore, antithèse, gradation, enjambement…).",
          "Expliquer l'effet sur le lecteur et le sens produit.",
          "Faire le lien avec la problématique à la fin de chaque mouvement.",
        ],
        cta: { label: "Générer une analyse linéaire de ton texte", href: "/analyse" },
      },
      {
        h2: "Étape 4 : la conclusion",
        p: [
          "La conclusion répond clairement au projet de lecture en reprenant les idées fortes de chaque mouvement. Elle se termine par une ouverture courte et pertinente : un autre texte du même auteur, une œuvre du même mouvement littéraire ou un écho avec l'œuvre étudiée en classe.",
        ],
      },
      {
        h2: "Les erreurs qui coûtent le plus de points",
        list: [
          "La paraphrase : répéter le texte avec d'autres mots au lieu de l'analyser.",
          "Le catalogue de figures de style sans interprétation.",
          "Un projet de lecture oublié en cours de route.",
          "Réciter une analyse apprise par cœur sans pouvoir répondre aux questions de l'examinateur.",
          "Dépasser le temps : l'explication et la grammaire tiennent ensemble en 12 minutes environ.",
        ],
      },
      {
        h2: "S'entraîner efficacement",
        p: [
          "La méthode ne suffit pas : il faut la pratiquer à voix haute, chronomètre en main. Explique chaque texte de ta liste au moins une fois à l'oral dans les conditions de l'épreuve, puis repère ce qui manque : un procédé mal nommé, une transition absente, une conclusion trop rapide.",
          "BacFrançaisAI peut te fournir une analyse linéaire structurée de chacun de tes textes pour vérifier ton travail, puis te faire passer l'oral et te noter sur 20 selon les critères de l'épreuve.",
        ],
        cta: { label: "S'entraîner à l'oral avec un jury IA", href: "/oral" },
      },
    ],
    faq: [
      { q: "Quelle est la différence entre analyse linéaire et commentaire ?", a: "L'analyse linéaire suit l'ordre du texte, du début à la fin, et se pratique à l'oral. Le commentaire, à l'écrit, s'organise en axes thématiques sans suivre forcément l'ordre du texte." },
      { q: "Combien de mouvements faut-il dans une analyse linéaire ?", a: "En général deux à quatre. Le nombre dépend du texte : chaque mouvement doit correspondre à une vraie étape, un changement de ton, de lieu, de locuteur ou d'idée." },
      { q: "Combien de points vaut l'explication linéaire à l'oral ?", a: "L'explication linéaire vaut 8 points sur 20. La lecture compte pour 2 points et la question de grammaire pour 2 points, soit 12 points pour la première partie de l'oral." },
      { q: "Peut-on apprendre son analyse linéaire par cœur ?", a: "Il faut connaître ses textes et ses idées principales, mais réciter mot pour mot est risqué : à la moindre question, on perd le fil. Mieux vaut maîtriser le plan et les citations clés, puis s'entraîner à expliquer avec ses propres mots." },
    ],
    published: "2026-10-31",
    updated: "2026-10-31",
  },
  {
    slug: "oral-bac-francais-2027",
    title: "Oral du bac de français 2027 : déroulé, barème et conseils",
    description: "Tout sur l'oral du bac de français 2027 : 30 minutes de préparation, 20 minutes d'oral, barème sur 20 (lecture, explication linéaire, grammaire, œuvre choisie) et conseils.",
    h1: "Oral du bac de français 2027 : déroulé, barème et conseils pour avoir une bonne note",
    intro: [
      "L'oral du bac de français est une épreuve anticipée passée en fin de première. Il compte autant que l'écrit, et c'est souvent là que les élèves bien préparés font la différence.",
      "Voici comment se déroule l'épreuve minute par minute, comment elle est notée, et comment t'y préparer dès maintenant.",
    ],
    sections: [
      {
        h2: "Le déroulé de l'épreuve",
        p: [
          "Tu disposes de 30 minutes de préparation, puis de 20 minutes de passage devant l'examinateur. Le texte est tiré dans la liste des textes que tu as étudiés pendant l'année, présentée dans ton récapitulatif.",
        ],
        list: [
          "Première partie (environ 12 minutes, 12 points) : lecture à voix haute d'une partie du texte, explication linéaire, puis question de grammaire.",
          "Seconde partie (environ 8 minutes, 8 points) : présentation de l'œuvre que tu as choisie, suivie d'un entretien avec l'examinateur.",
        ],
      },
      {
        h2: "Le barème sur 20 points",
        list: [
          "Lecture expressive : 2 points.",
          "Explication linéaire : 8 points.",
          "Question de grammaire : 2 points.",
          "Présentation de l'œuvre choisie et entretien : 8 points.",
        ],
        p: ["L'explication linéaire et la partie sur l'œuvre représentent à elles deux 16 points sur 20. C'est là que l'entraînement rapporte le plus."],
      },
      {
        h2: "Bien utiliser les 30 minutes de préparation",
        list: [
          "Relire le texte et retrouver ton projet de lecture et tes mouvements.",
          "Noter au brouillon les citations clés de chaque mouvement, pas des phrases rédigées.",
          "Traiter la question de grammaire sans y passer plus de cinq minutes.",
          "Garder quelques minutes pour préparer l'introduction et la lecture à voix haute.",
        ],
        cta: { label: "Faire un examen blanc chronométré", href: "/examen" },
      },
      {
        h2: "Réussir la seconde partie sur l'œuvre choisie",
        p: [
          "Tu présentes une œuvre choisie parmi celles étudiées pendant l'année. L'examinateur évalue ta capacité à en parler de façon personnelle et argumentée : pourquoi ce choix, ce que l'œuvre t'a apporté, un passage qui t'a marqué.",
          "Prépare une présentation de deux à trois minutes, puis anticipe les questions : les personnages ou les thèmes principaux, le lien avec le parcours étudié, ton avis justifié.",
        ],
        cta: { label: "Réviser son œuvre avec l'IA", href: "/oeuvre" },
      },
      {
        h2: "Les conseils qui font gagner des points",
        list: [
          "Parler à l'examinateur, pas à sa feuille : regarde-le régulièrement.",
          "Annoncer clairement ton plan et tes transitions.",
          "Gérer ton temps avec une montre posée devant toi.",
          "Accepter de dire « je n'y avais pas pensé » puis réfléchir à voix haute pendant l'entretien.",
          "S'entraîner à voix haute dans les conditions réelles, pas seulement relire ses fiches.",
        ],
      },
      {
        h2: "Un calendrier de révision réaliste",
        p: [
          "L'idéal est de préparer chaque texte au fur et à mesure de l'année : une analyse propre dès qu'il est étudié en classe, puis un passage à l'oral dans la foulée. Au printemps, il ne reste plus qu'à faire des examens blancs complets.",
          "Avec BacFrançaisAI, tu peux faire noter chaque entraînement à l'oral sur 20 et savoir exactement ce qu'il faut améliorer : la connaissance du texte, la qualité de l'analyse, l'expression ou la structure.",
        ],
        cta: { label: "Tester l'oral avec un jury IA", href: "/oral" },
      },
    ],
    faq: [
      { q: "Combien de temps dure l'oral du bac de français ?", a: "L'oral dure 20 minutes, après 30 minutes de préparation : environ 12 minutes pour la lecture, l'explication linéaire et la grammaire, puis 8 minutes pour la présentation de l'œuvre choisie et l'entretien." },
      { q: "Quel est le coefficient de l'oral du bac de français ?", a: "L'oral et l'écrit des épreuves anticipées de français ont le même coefficient : l'oral compte donc autant que l'écrit." },
      { q: "Quand a lieu l'oral du bac de français 2027 ?", a: "Pour les élèves de première en 2026-2027, l'oral a lieu en fin d'année scolaire, en général de fin juin à début juillet 2027. Les dates exactes sont fixées par chaque académie." },
      { q: "Peut-on avoir une bonne note sans être bon à l'écrit ?", a: "Oui. L'oral récompense la préparation régulière et l'entraînement à voix haute. Beaucoup d'élèves y gagnent des points précieux en maîtrisant leurs textes et la méthode de l'explication." },
    ],
    published: "2026-10-31",
    updated: "2026-10-31",
  },
  {
    slug: "question-de-grammaire-bac-francais",
    title: "Question de grammaire au bac de français : méthode et exemples",
    description: "Réussir la question de grammaire à l'oral du bac de français : ce qui est demandé, méthode en 3 étapes, notions fréquentes et exemples corrigés.",
    h1: "La question de grammaire à l'oral du bac de français : méthode et exemples",
    intro: [
      "La question de grammaire ne vaut que 2 points, mais ce sont souvent les 2 points les plus faciles à aller chercher. Elle porte sur une phrase ou un court passage du texte que tu viens d'expliquer.",
      "Beaucoup d'élèves la bâclent ou la redoutent. Avec une méthode simple et un peu d'entraînement, elle devient une valeur sûre.",
    ],
    sections: [
      {
        h2: "Ce qui est demandé",
        p: [
          "L'examinateur pose une question précise sur une notion de grammaire étudiée au lycée, par exemple identifier et analyser une proposition subordonnée, une forme de négation ou une phrase interrogative. Tu réponds en général après ton explication linéaire, en deux minutes environ.",
          "On attend une analyse juste et argumentée, pas un cours. Si tu peux, termine par une phrase qui relie la remarque grammaticale au sens du texte : c'est très apprécié.",
        ],
      },
      {
        h2: "La méthode en 3 étapes",
        list: [
          "Identifier : repère précisément l'élément demandé et cite-le.",
          "Analyser : donne sa nature, sa fonction ou sa construction avec le vocabulaire exact.",
          "Interpréter : en une phrase, montre ce que cette construction apporte au texte.",
        ],
      },
      {
        h2: "Les notions qui reviennent souvent",
        list: [
          "Les propositions subordonnées : relatives, conjonctives, interrogatives indirectes, circonstancielles.",
          "L'interrogation : directe ou indirecte, totale ou partielle.",
          "La négation : totale, partielle, restrictive (« ne… que »).",
          "Les valeurs des temps et des modes verbaux.",
          "Les relations entre les propositions : juxtaposition, coordination, subordination.",
        ],
      },
      {
        h2: "Exemple corrigé",
        p: [
          "Phrase : « Le Poète est semblable au prince des nuées / Qui hante la tempête et se rit de l'archer » (Baudelaire, « L'Albatros »). Question : identifiez et analysez la proposition subordonnée.",
          "Réponse : « Qui hante la tempête et se rit de l'archer » est une proposition subordonnée relative introduite par le pronom relatif « qui ». Son antécédent est « le prince des nuées », et le pronom « qui » est sujet des verbes « hante » et « se rit ». Elle complète l'antécédent en le caractérisant. Cette relative prolonge l'image de l'albatros maître du ciel, qui affronte la tempête sans crainte et se moque du danger : elle prépare le contraste avec sa maladresse sur le sol.",
        ],
      },
      {
        h2: "S'entraîner sur des questions variées",
        p: [
          "Le meilleur entraînement consiste à traiter une question différente sur chacun de tes textes. Dans le mode examen de BacFrançaisAI, tu peux générer une question de grammaire sur la notion de ton choix et recevoir une évaluation de ta réponse avec le reste de ton oral.",
        ],
        cta: { label: "S'entraîner avec le mode examen", href: "/examen" },
      },
    ],
    faq: [
      { q: "Combien de points vaut la question de grammaire ?", a: "La question de grammaire vaut 2 points sur 20 à l'oral du bac de français." },
      { q: "À quel moment est posée la question de grammaire ?", a: "Elle est posée dans la première partie de l'oral, en général juste après l'explication linéaire, et porte sur le texte que tu viens d'expliquer." },
      { q: "Faut-il interpréter la réponse de grammaire ?", a: "Ce n'est pas obligatoire, mais relier en une phrase la construction grammaticale au sens du texte montre ta maîtrise et fait bonne impression." },
    ],
    published: "2026-10-31",
    updated: "2026-10-31",
  },
  {
    slug: "procedes-stylistiques-bac-francais",
    title: "Procédés stylistiques : la liste à connaître pour le bac de français",
    description: "Liste des procédés stylistiques à connaître pour le bac de français : métaphore, antithèse, oxymore, chiasme, anaphore, gradation… Définitions simples et exemples littéraires.",
    h1: "Les procédés stylistiques à connaître pour le bac de français (avec exemples)",
    intro: [
      "Connaître les procédés stylistiques ne suffit pas pour réussir une analyse linéaire, mais c'est indispensable pour en parler avec précision. Voici les procédés les plus utiles, classés par famille, avec une définition simple et un exemple tiré de textes classiques.",
      "Rappel essentiel : un procédé ne vaut que par l'effet qu'il produit. Nomme-le, puis explique toujours ce qu'il apporte au texte.",
    ],
    sections: [
      {
        h2: "Les figures d'analogie",
        list: [
          "Comparaison : rapprochement de deux éléments avec un outil de comparaison (comme, tel, semblable à). « Le Poète est semblable au prince des nuées » (Baudelaire).",
          "Métaphore : rapprochement sans outil de comparaison. « Ma jeunesse ne fut qu'un ténébreux orage » (Baudelaire).",
          "Personnification : attribuer des caractéristiques humaines à un objet, un animal ou une idée. « Nature, berce-le chaudement » (Rimbaud).",
        ],
      },
      {
        h2: "Les figures d'opposition",
        list: [
          "Antithèse : opposition de deux termes ou idées dans un même passage. « Je vis, je meurs ; je me brûle et me noie » (Louise Labé).",
          "Oxymore : alliance de deux termes contradictoires étroitement liés. « Cette obscure clarté qui tombe des étoiles » (Corneille).",
          "Chiasme : construction croisée de type A-B-B-A. « Il faut manger pour vivre et non pas vivre pour manger » (Molière).",
        ],
      },
      {
        h2: "Les figures d'insistance et d'atténuation",
        list: [
          "Anaphore : répétition d'un même mot en début de phrase ou de vers. « Rome, l'unique objet de mon ressentiment ! / Rome… » (Corneille).",
          "Gradation : énumération de termes d'intensité croissante. « Va, cours, vole, et nous venge » (Corneille).",
          "Hyperbole : exagération pour frapper l'esprit. « Je meurs de soif auprès de la fontaine » (Villon).",
          "Litote : dire moins pour suggérer plus. « Va, je ne te hais point » (Corneille).",
          "Euphémisme : atténuer une réalité pénible. « Il nous a quittés » pour dire qu'une personne est morte.",
        ],
      },
      {
        h2: "Les figures de substitution",
        list: [
          "Périphrase : désigner une chose par une expression plus longue. « L'astre du jour » pour le soleil.",
          "Métonymie : désigner une chose par un élément qui lui est lié. « Boire un verre » pour boire son contenu.",
        ],
      },
      {
        h2: "Les sonorités et le rythme",
        list: [
          "Allitération : répétition d'un son consonne. « Pour qui sont ces serpents qui sifflent sur vos têtes ? » (Racine), allitération en [s].",
          "Assonance : répétition d'un son voyelle. « Tout m'afflige et me nuit et conspire à me nuire » (Racine), assonance en [i].",
          "Enjambement et rejet : la phrase déborde sur le vers suivant ; le rejet met en valeur le mot isolé. « Accrochant follement aux herbes des haillons / D'argent » (Rimbaud).",
        ],
      },
      {
        h2: "Comment les utiliser dans ton analyse",
        p: [
          "Ne cherche pas à placer le plus de figures possible. Choisis celles qui servent ton projet de lecture et explique leur effet : émotion, mise en valeur, contraste, rythme, ironie.",
          "Si tu veux voir comment ces procédés s'articulent dans une vraie explication, BacFrançaisAI génère une analyse linéaire de ton texte avec, pour chaque mouvement, les procédés, les citations et leurs effets.",
        ],
        cta: { label: "Voir les procédés de ton texte", href: "/analyse" },
      },
    ],
    faq: [
      { q: "Quelle est la différence entre une métaphore et une comparaison ?", a: "La comparaison utilise un outil de comparaison (comme, tel, semblable à). La métaphore rapproche les deux éléments directement, sans outil." },
      { q: "Quelle est la différence entre une antithèse et un oxymore ?", a: "L'antithèse oppose deux termes ou idées dans un même passage. L'oxymore associe deux termes contradictoires étroitement liés, souvent un nom et un adjectif, comme « obscure clarté »." },
      { q: "Combien de procédés faut-il citer dans une analyse linéaire ?", a: "Il n'y a pas de nombre minimum. Le jury préfère quelques procédés bien choisis et bien interprétés à une longue liste sans explication." },
    ],
    published: "2026-10-31",
    updated: "2026-10-31",
  },
  {
    slug: "bac-francais-ia",
    title: "Réviser le bac de français avec l'IA : ce qui marche vraiment",
    description: "Comment utiliser l'IA pour réviser le bac de français sans tricher : analyses linéaires, entraînement à l'oral noté sur 20, examens blancs. Avantages, limites et bonnes pratiques.",
    h1: "Réviser le bac de français avec l'IA : ce qui marche vraiment (et ce qui ne marche pas)",
    intro: [
      "L'intelligence artificielle peut être un excellent partenaire de révision pour le bac de français, à condition de s'en servir pour apprendre et non pour remplacer son travail. Le jour de l'oral, personne ne parlera à ta place.",
      "Voici les usages qui font vraiment progresser, ceux qui font perdre du temps, et la façon dont BacFrançaisAI a été pensé pour la préparation de l'épreuve.",
    ],
    sections: [
      {
        h2: "Ce que l'IA fait bien",
        list: [
          "Te proposer une analyse linéaire structurée pour vérifier et compléter la tienne.",
          "Repérer les procédés stylistiques d'un passage et expliquer leurs effets.",
          "T'écouter à l'oral et te donner un retour immédiat sur le fond et la forme.",
          "Générer des questions d'entraînement sur ton œuvre ou sur la grammaire.",
          "Te faire passer des examens blancs chronométrés quand tu veux.",
        ],
      },
      {
        h2: "Les limites à connaître",
        list: [
          "Une IA peut se tromper : vérifie toujours les citations et les noms de procédés avec ton cours.",
          "Copier une analyse sans la comprendre ne sert à rien à l'oral : l'examinateur pose des questions.",
          "Les attentes de ton professeur et du programme de l'année priment sur toute réponse générée.",
        ],
      },
      {
        h2: "La bonne méthode en 4 étapes",
        list: [
          "Faire ta propre analyse du texte d'abord, même imparfaite.",
          "La comparer à une analyse générée pour repérer ce qui manque.",
          "T'entraîner à l'oral à voix haute, chronométré.",
          "Corriger tes points faibles grâce au retour, puis recommencer.",
        ],
      },
      {
        h2: "Comment fonctionne BacFrançaisAI",
        p: [
          "BacFrançaisAI regroupe les outils dont tu as besoin pour l'épreuve. Tu colles un texte et tu obtiens en quelques secondes une analyse linéaire complète : introduction, projet de lecture, mouvements, procédés avec citations et effets, conclusion et ouverture.",
          "Tu peux ensuite t'entraîner à l'oral : tu parles, ta prestation est transcrite, puis notée sur 20 selon quatre critères (connaissance du texte, qualité de l'analyse, expression orale, structuration), avec des points forts et des axes d'amélioration.",
          "Le mode examen simule l'épreuve complète avec 30 minutes de préparation, et l'assistant œuvre t'aide à réviser l'œuvre choisie pour la seconde partie.",
        ],
        cta: { label: "Essayer BacFrançaisAI", href: "/" },
      },
      {
        h2: "Rester honnête avec ses professeurs",
        p: [
          "L'IA est un outil de révision, pas un moyen de rendre un travail noté à la place de l'élève. Utilise-la pour comprendre, t'entraîner et progresser : c'est exactement ce qui sera évalué le jour de l'oral.",
        ],
      },
    ],
    faq: [
      { q: "Est-ce de la triche d'utiliser l'IA pour réviser le bac de français ?", a: "Non, tant qu'elle sert à réviser et à s'entraîner. Rendre un devoir noté rédigé par une IA à la place de son propre travail, en revanche, n'est pas honnête et n'aide pas à progresser." },
      { q: "L'IA peut-elle noter mon oral comme un vrai jury ?", a: "Elle donne une estimation sur 20 et un retour détaillé selon les critères de l'épreuve. C'est un entraînement précieux, mais seule la note de l'examinateur compte le jour J." },
      { q: "BacFrançaisAI est-il adapté à la voie technologique ?", a: "Oui. Le site s'adresse aux élèves de première générale et technologique qui préparent les épreuves anticipées de français." },
    ],
    published: "2026-10-31",
    updated: "2026-10-31",
  },
];

export const getGuide = (slug: string) => GUIDES.find((g) => g.slug === slug);
