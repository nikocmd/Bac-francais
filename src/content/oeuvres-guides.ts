import type { Guide } from "./guides";

// One SEO page per work on the 2026-2027 programme (BO n°30, 24-07-2025).
const D = "2026-10-31";
const OEUVRE_CTA = { label: "Réviser cette œuvre avec l'IA", href: "/oeuvre" };
const ANALYSE_CTA = { label: "Faire l'analyse linéaire d'un extrait avec l'IA", href: "/analyse" };

export const OEUVRE_GUIDES: Guide[] = [
  {
    slug: "cahier-de-douai-rimbaud-bac-francais",
    kind: "oeuvre",
    objet: "poesie",
    title: "Cahier de Douai de Rimbaud : fiche bac de français 2027",
    description: "Cahier de Douai de Rimbaud pour le bac de français 2027 : résumé, poèmes clés, thèmes, parcours « Émancipations créatrices » et sujets de dissertation possibles.",
    h1: "Cahier de Douai de Rimbaud : la fiche complète pour le bac de français",
    intro: [
      "Le Cahier de Douai réunit vingt-deux poèmes qu'Arthur Rimbaud, âgé de seize ans, recopie à l'automne 1870 pendant ses fugues, et confie au poète Paul Demeny à Douai. Il est au programme du bac de français 2027 avec le parcours « Émancipations créatrices ».",
      "Ce recueil de jeunesse montre un adolescent qui se libère de tout : de sa famille, de l'école, de la religion, de l'ordre politique et des règles poétiques qu'il maîtrise déjà parfaitement.",
    ],
    sections: [
      {
        h2: "Le recueil en bref",
        p: [
          "Les poèmes sont pour la plupart des sonnets ou des pièces en alexandrins, mais Rimbaud y glisse déjà une liberté de ton nouvelle : mots familiers, ironie, images inattendues. Le recueil va de l'élan amoureux et sensuel à la satire violente des puissants, puis à l'errance heureuse.",
          "Le contexte compte : 1870, c'est la guerre franco-prussienne et la chute du Second Empire. Plusieurs poèmes y répondent directement.",
        ],
      },
      {
        h2: "Les poèmes à connaître",
        list: [
          "« Sensation » : le rêve d'une marche libre dans la nature, « par les sentiers », comme un bohémien.",
          "« Le Dormeur du val » : un sonnet qui peint un soldat endormi dans un paysage paisible, avant la chute finale qui révèle sa mort.",
          "« Le Mal » et « Rages de Césars » : la dénonciation de la guerre, de l'Église complice et de Napoléon III.",
          "« Vénus Anadyomène » : la parodie d'une figure mythologique de la beauté, transformée en corps laid et grotesque.",
          "« Roman » : « On n'est pas sérieux, quand on a dix-sept ans », l'ironie tendre sur les premiers émois.",
          "« Au Cabaret-Vert » et « La Maline » : des scènes de pause heureuse pendant la fugue.",
          "« Ma Bohème » : le poème final, où le poète vagabond fait de sa pauvreté une liberté et de la marche une création.",
        ],
        cta: ANALYSE_CTA,
      },
      {
        h2: "Les thèmes et le lien avec le parcours",
        list: [
          "La fugue et l'errance comme libération physique et poétique.",
          "La révolte contre l'autorité : la guerre, l'Empereur, la religion, la bourgeoisie de province (« À la musique »).",
          "La nature et la sensualité, vécues avec tout le corps.",
          "La transformation des formes héritées : Rimbaud respecte le sonnet tout en le détournant (familiarité, ironie, enjambements, chutes brutales).",
        ],
        p: ["« Émancipations créatrices » se lit donc dans deux sens : le jeune poète s'émancipe de son milieu, et c'est en écrivant qu'il conquiert cette liberté."],
      },
      {
        h2: "Des sujets de dissertation possibles",
        list: [
          "Peut-on dire que, dans le Cahier de Douai, la liberté du poète passe avant tout par la révolte ?",
          "La poésie de Rimbaud dans le Cahier de Douai est-elle une poésie de la rupture ou de l'héritage ?",
          "Dans quelle mesure le Cahier de Douai est-il un recueil de l'enfance et de la jeunesse ?",
        ],
        cta: OEUVRE_CTA,
      },
    ],
    faq: [
      { q: "Pourquoi s'appelle-t-il « Cahier de Douai » ?", a: "Ce n'est pas un titre choisi par Rimbaud. Le nom vient de la ville de Douai, où il a recopié et laissé ces poèmes chez Paul Demeny en 1870." },
      { q: "Combien de poèmes compte le Cahier de Douai ?", a: "Vingt-deux poèmes, écrits pour la plupart en 1870, quand Rimbaud a seize ans." },
      { q: "Quel poème choisir pour l'oral ?", a: "« Ma Bohème », « Le Dormeur du val » et « Sensation » sont les plus fréquents car ils sont courts et très riches. Choisis surtout ceux étudiés en classe et figurant sur ton récapitulatif." },
    ],
    published: D,
    updated: D,
  },
  {
    slug: "la-rage-de-l-expression-ponge-bac-francais",
    kind: "oeuvre",
    objet: "poesie",
    title: "La rage de l'expression de Ponge : fiche bac de français 2027",
    description: "La rage de l'expression de Francis Ponge pour le bac de français 2027 : présentation, textes clés, thèmes, parcours « Dans l'atelier du poète » et sujets possibles.",
    h1: "La rage de l'expression de Francis Ponge : la fiche pour le bac de français",
    intro: [
      "La rage de l'expression, publiée en 1952, rassemble des textes que Francis Ponge écrit surtout entre 1938 et 1944. Le recueil est au programme du bac de français 2027 avec le parcours « Dans l'atelier du poète ».",
      "Son originalité : au lieu de livrer un poème fini, Ponge montre l'écriture en train de se faire, avec ses notes, ses reprises, ses hésitations et ses échecs.",
    ],
    sections: [
      {
        h2: "Le recueil en bref",
        p: [
          "Ponge veut dire les choses ordinaires avec exactitude : une guêpe, un mimosa, un œillet, un bois de pins, les berges de la Loire. Il refuse les clichés poétiques et cherche les mots justes qui rendent compte de l'objet lui-même.",
          "Ces textes sont en prose, souvent datés, parfois très longs. Le lecteur voit le poète chercher, se corriger et parfois avouer qu'il n'y arrive pas : c'est la « rage » du titre.",
        ],
      },
      {
        h2: "Les textes à connaître",
        list: [
          "« Berges de la Loire » : une sorte d'art poétique où Ponge affirme préférer l'objet à l'effet littéraire.",
          "« La Guêpe » : une description vive, presque scientifique, qui joue avec les sons et le mouvement de l'insecte.",
          "« Notes prises pour un oiseau » : des notes successives qui cherchent à saisir un oiseau sans y parvenir tout à fait.",
          "« Le Carnet du bois de pins » : le journal d'écriture le plus long, avec brouillons, plans et commentaires sur le travail lui-même.",
          "« Le Mimosa » et « L'Œillet » : la lutte contre les images toutes faites attachées aux fleurs.",
        ],
        cta: ANALYSE_CTA,
      },
      {
        h2: "Les thèmes et le lien avec le parcours",
        list: [
          "Le « parti pris des choses » : partir de l'objet, pas des sentiments du poète.",
          "Le travail de la langue : étymologie, dictionnaire, jeux de sons, recherche du mot exact.",
          "L'inachèvement assumé : le brouillon devient œuvre.",
          "Une poésie en prose qui refuse le lyrisme traditionnel.",
        ],
        p: ["Avec le parcours « Dans l'atelier du poète », le recueil invite à réfléchir à ce qu'est créer : un travail patient, artisanal, plus qu'une inspiration soudaine."],
      },
      {
        h2: "Des sujets de dissertation possibles",
        list: [
          "La rage de l'expression montre-t-elle un échec ou une réussite de l'écriture poétique ?",
          "Peut-on dire que Ponge s'intéresse davantage au langage qu'aux choses ?",
          "En quoi le lecteur de La rage de l'expression est-il invité dans l'atelier du poète ?",
        ],
        cta: OEUVRE_CTA,
      },
    ],
    faq: [
      { q: "La rage de l'expression est-il vraiment de la poésie ?", a: "Oui, même s'il n'y a ni vers ni rimes. C'est de la poésie en prose, qui travaille la langue, les sons et les images avec une grande précision." },
      { q: "Que signifie le titre ?", a: "La « rage » désigne l'acharnement du poète à trouver l'expression exacte d'une chose, quitte à recommencer sans cesse." },
      { q: "Comment analyser un texte de Ponge à l'oral ?", a: "Repère comment Ponge observe l'objet, quels mots il choisit et pourquoi, et où il commente son propre travail. Relie toujours ces remarques à l'idée d'écriture en train de se faire." },
    ],
    published: D,
    updated: D,
  },
  {
    slug: "mes-forets-helene-dorion-bac-francais",
    kind: "oeuvre",
    objet: "poesie",
    title: "Mes forêts d'Hélène Dorion : fiche bac de français 2027",
    description: "Mes forêts d'Hélène Dorion pour le bac de français 2027 : présentation, thèmes, procédés, parcours « La poésie, la nature, l'intime » et sujets de dissertation.",
    h1: "Mes forêts d'Hélène Dorion : la fiche pour le bac de français",
    intro: [
      "Mes forêts est un recueil de la poétesse québécoise Hélène Dorion, publié en 2021. C'est la seule œuvre du XXIe siècle de l'objet d'étude poésie au programme du bac de français 2027, avec le parcours « La poésie, la nature, l'intime ».",
      "La forêt y est à la fois un paysage réel, observé avec précision, et un espace intérieur où la poétesse interroge le temps, la perte et la mémoire.",
    ],
    sections: [
      {
        h2: "Le recueil en bref",
        p: [
          "Le recueil est composé de poèmes courts en vers libres, sans ponctuation forte, organisés en plusieurs sections. Les arbres, l'écorce, les racines, les saisons, la neige et les oiseaux reviennent sans cesse.",
          "Le possessif du titre est essentiel : ce sont « mes » forêts. La nature devient le miroir de l'intime, et l'intime se dit à travers la nature.",
        ],
      },
      {
        h2: "Les thèmes à connaître",
        list: [
          "Le temps qui passe, le cycle des saisons, la vieillesse et la mort.",
          "La mémoire et l'héritage, ce que l'on transmet et ce qui disparaît.",
          "La fragilité du monde naturel et une conscience écologique discrète.",
          "L'humain comme partie de la nature, pas comme son maître.",
          "Le langage lui-même : écrire la forêt, c'est chercher à dire ce qui échappe.",
        ],
        cta: ANALYSE_CTA,
      },
      {
        h2: "Les procédés à repérer",
        list: [
          "Le vers libre et les blancs de la page, qui créent des silences et du rythme.",
          "Les métaphores qui associent le corps et l'arbre (veines, écorce, peau, racines).",
          "Les répétitions et anaphores qui donnent une musique proche de la litanie.",
          "Le présent, qui installe une méditation intemporelle.",
        ],
      },
      {
        h2: "Des sujets de dissertation possibles",
        list: [
          "Dans Mes forêts, la nature est-elle seulement un miroir de l'intime ?",
          "La poésie d'Hélène Dorion est-elle une poésie de la célébration ou de l'inquiétude ?",
          "En quoi Mes forêts fait-il de la forêt un lieu de mémoire ?",
        ],
        cta: OEUVRE_CTA,
      },
    ],
    faq: [
      { q: "Qui est Hélène Dorion ?", a: "Une poétesse québécoise née en 1958, autrice d'une œuvre importante, traduite dans de nombreuses langues." },
      { q: "Mes forêts est-il difficile à analyser ?", a: "Les poèmes sont courts mais denses. Concentre-toi sur les images, le rythme des vers libres et le lien entre la forêt et l'intériorité." },
      { q: "Quel lien avec l'écologie ?", a: "Le recueil n'est pas un manifeste, mais il montre la fragilité de la nature et invite à habiter le monde avec attention et humilité." },
    ],
    published: D,
    updated: D,
  },
  {
    slug: "discours-de-la-servitude-volontaire-bac-francais",
    kind: "oeuvre",
    objet: "idees",
    title: "Discours de la servitude volontaire : fiche bac de français 2027",
    description: "Discours de la servitude volontaire de La Boétie pour le bac de français 2027 : résumé, thèse, arguments, parcours « Défendre et entretenir la liberté » et sujets.",
    h1: "Discours de la servitude volontaire de La Boétie : la fiche pour le bac de français",
    intro: [
      "Étienne de La Boétie écrit le Discours de la servitude volontaire très jeune, vers 1548, et le texte circule après sa mort. Ami de Montaigne, il pose une question qui n'a pas vieilli : pourquoi tant d'hommes obéissent-ils à un seul tyran qui n'a de pouvoir que celui qu'ils lui donnent ?",
      "L'œuvre est au programme du bac de français 2027 avec le parcours « “Défendre” et “entretenir” la liberté ».",
    ],
    sections: [
      {
        h2: "La thèse en une phrase",
        p: [
          "La servitude est volontaire : le tyran n'a que la force que le peuple lui accorde. Il suffirait de cesser de le servir pour qu'il tombe, sans même avoir besoin de le combattre. C'est le sens de la formule célèbre : « Soyez résolus de ne servir plus, et vous voilà libres. »",
        ],
      },
      {
        h2: "Les arguments principaux",
        list: [
          "La liberté est naturelle : les animaux eux-mêmes résistent à la captivité.",
          "La coutume : on naît dans la servitude, on s'y habitue et on finit par ne plus désirer la liberté.",
          "Les divertissements : jeux, spectacles, banquets et largesses endorment le peuple.",
          "La religion et le prestige mis en scène par le pouvoir.",
          "La chaîne des complices : quelques proches profitent du tyran, et chacun d'eux en entraîne d'autres, si bien qu'une foule a intérêt au maintien de la tyrannie.",
        ],
        cta: ANALYSE_CTA,
      },
      {
        h2: "L'art de convaincre",
        list: [
          "Les questions rhétoriques et l'interpellation directe du lecteur.",
          "Les exemples tirés de l'Antiquité grecque et romaine.",
          "Les comparaisons et images frappantes (le feu qu'on cesse d'alimenter, les animaux).",
          "Un ton indigné, qui mêle raisonnement et émotion.",
        ],
      },
      {
        h2: "Des sujets de dissertation possibles",
        list: [
          "Le Discours de la servitude volontaire est-il un texte pessimiste ?",
          "Pour La Boétie, la liberté se défend-elle d'abord par la révolte ou par la lucidité ?",
          "En quoi ce discours cherche-t-il autant à émouvoir qu'à convaincre ?",
        ],
        cta: OEUVRE_CTA,
      },
    ],
    faq: [
      { q: "Quel âge avait La Boétie quand il a écrit le Discours ?", a: "Environ dix-huit ans selon Montaigne, ce qui explique la fougue du texte." },
      { q: "Le Discours appelle-t-il à la révolution ?", a: "Pas à la violence. Il montre que le refus d'obéir suffit et que la vraie servitude est intérieure." },
      { q: "Quelle actualité pour ce texte ?", a: "Il éclaire toutes les formes de domination consentie : propagande, habitude, divertissement, complicité. C'est un bon point d'appui pour l'entretien de l'oral." },
    ],
    published: D,
    updated: D,
  },
  {
    slug: "entretiens-sur-la-pluralite-des-mondes-fontenelle-bac-francais",
    kind: "oeuvre",
    objet: "idees",
    title: "Entretiens sur la pluralité des mondes : fiche bac français 2027",
    description: "Entretiens sur la pluralité des mondes de Fontenelle pour le bac de français 2027 : résumé des soirs, thèmes, parcours « Le goût de la science » et sujets possibles.",
    h1: "Entretiens sur la pluralité des mondes de Fontenelle : la fiche pour le bac de français",
    intro: [
      "Publiés en 1686, les Entretiens sur la pluralité des mondes de Fontenelle mettent en scène un philosophe qui, au fil de promenades nocturnes dans un parc, explique l'astronomie à une marquise curieuse et spirituelle.",
      "L'œuvre est au programme du bac de français 2027 avec le parcours « Le goût de la science ». Elle annonce l'esprit des Lumières : rendre le savoir accessible et agréable.",
    ],
    sections: [
      {
        h2: "L'œuvre en bref",
        list: [
          "Premier soir : la Terre est une planète qui tourne autour du Soleil (le système de Copernic).",
          "Deuxième soir : la Lune pourrait être une terre habitée.",
          "Troisième soir : les particularités de la Lune et l'idée que d'autres planètes sont habitées.",
          "Quatrième soir : les planètes, de Vénus à Saturne, et leurs habitants imaginés.",
          "Cinquième soir : les étoiles fixes sont autant de soleils, entourés de mondes.",
          "Sixième soir (ajouté en 1687) : nouvelles découvertes et retour sur les idées précédentes.",
        ],
      },
      {
        h2: "Les thèmes à connaître",
        list: [
          "La vulgarisation scientifique : instruire en plaisant.",
          "La remise en cause du géocentrisme et de la place centrale de l'homme.",
          "L'éloge de la raison et de l'esprit critique contre les préjugés.",
          "Le rôle de la marquise : une femme qui raisonne, objecte et progresse, à une époque où l'on écarte les femmes du savoir.",
        ],
        cta: ANALYSE_CTA,
      },
      {
        h2: "L'art du dialogue",
        p: [
          "Le dialogue rend la science vivante : questions, objections, plaisanteries et comparaisons du quotidien (l'opéra, une montre, un jardin). Le ton galant et le cadre nocturne séduisent le lecteur mondain. Le dialogue permet aussi d'avancer prudemment des idées encore audacieuses à l'époque.",
        ],
      },
      {
        h2: "Des sujets de dissertation possibles",
        list: [
          "Dans les Entretiens, le plaisir de la conversation sert-il ou dessert-il la science ?",
          "Fontenelle cherche-t-il davantage à transmettre des connaissances ou une manière de penser ?",
          "En quoi les Entretiens donnent-ils le goût de la science ?",
        ],
        cta: OEUVRE_CTA,
      },
    ],
    faq: [
      { q: "Les connaissances de Fontenelle sont-elles encore justes ?", a: "Pas toutes : il s'appuie sur les tourbillons de Descartes, dépassés depuis. Mais l'œuvre vaut surtout par sa méthode et sa manière de faire aimer la science." },
      { q: "Qui sont les personnages ?", a: "Un philosophe, qui est le narrateur, et une marquise. Ils dialoguent pendant plusieurs soirs dans le parc d'un château." },
      { q: "Pourquoi est-ce de la littérature d'idées ?", a: "Parce que le texte défend une vision du monde et une méthode de pensée, en utilisant le dialogue pour convaincre le lecteur." },
    ],
    published: D,
    updated: D,
  },
  {
    slug: "lettres-d-une-peruvienne-graffigny-bac-francais",
    kind: "oeuvre",
    objet: "idees",
    title: "Lettres d'une Péruvienne de Graffigny : fiche bac français 2027",
    description: "Lettres d'une Péruvienne de Françoise de Graffigny pour le bac de français 2027 : résumé, personnages, thèmes, parcours « Un nouvel univers s'est offert à mes yeux ».",
    h1: "Lettres d'une Péruvienne de Graffigny : la fiche pour le bac de français",
    intro: [
      "Publiées en 1747, les Lettres d'une Péruvienne de Françoise de Graffigny ont été l'un des plus grands succès du XVIIIe siècle. Le roman est au programme du bac de français 2027 avec le parcours « Un nouvel univers s'est offert à mes yeux ».",
      "Zilia, princesse inca, découvre la France et la regarde avec des yeux neufs. Son regard étranger devient une critique de la société française.",
    ],
    sections: [
      {
        h2: "Le résumé",
        p: [
          "Zilia, princesse inca, est enlevée par les conquistadors espagnols le jour où elle devait épouser Aza. Le navire espagnol est pris par des Français et elle est confiée à Déterville, un officier qui tombe amoureux d'elle et la conduit en France.",
          "Elle écrit à Aza, d'abord avec des quipus (cordelettes à nœuds), puis en français une fois la langue apprise. Elle découvre la société parisienne, ses usages et ses contradictions. Quand elle retrouve Aza, il a renoncé à elle pour une Espagnole. Zilia refuse pourtant d'épouser Déterville : elle lui offre son amitié et choisit une vie indépendante.",
        ],
      },
      {
        h2: "Les thèmes à connaître",
        list: [
          "Le regard étranger, qui révèle les absurdités de la société française (luxe, apparence, galanterie superficielle).",
          "La condition des femmes et leur éducation insuffisante, que Zilia dénonce.",
          "L'apprentissage de la langue et de l'écriture comme conquête de soi.",
          "L'amour, la perte et la liberté finale de l'héroïne.",
          "La critique de la conquête espagnole et de la violence coloniale.",
        ],
        cta: ANALYSE_CTA,
      },
      {
        h2: "La forme épistolaire",
        p: [
          "Le roman est composé de lettres de Zilia, presque toutes adressées à Aza. Ce point de vue unique crée l'intimité et l'émotion, tout en donnant la parole à une femme étrangère pour juger la France. On peut le rapprocher des Lettres persanes de Montesquieu (1721), qui utilisent le même procédé du regard étranger.",
        ],
      },
      {
        h2: "Des sujets de dissertation possibles",
        list: [
          "Les Lettres d'une Péruvienne sont-elles d'abord un roman d'amour ou une critique de la société ?",
          "En quoi le regard de Zilia sur la France est-il un regard neuf ?",
          "Peut-on dire que Zilia conquiert sa liberté par l'écriture ?",
        ],
        cta: OEUVRE_CTA,
      },
    ],
    faq: [
      { q: "Que sont les quipus ?", a: "Des cordelettes à nœuds utilisées par les Incas pour noter des informations. Zilia s'en sert pour ses premières lettres." },
      { q: "Comment finit le roman ?", a: "Aza a épousé une autre femme. Zilia refuse le mariage avec Déterville et choisit une vie libre, faite d'amitié, de lecture et de méditation." },
      { q: "Pourquoi ce roman est-il étudié en littérature d'idées ?", a: "Parce que le regard de Zilia sert une réflexion critique sur la société, la place des femmes et la colonisation." },
    ],
    published: D,
    updated: D,
  },
  {
    slug: "le-chevalier-de-la-charrette-bac-francais",
    kind: "oeuvre",
    objet: "roman",
    title: "Le Chevalier de la charrette : fiche bac de français 2027",
    description: "Le Chevalier de la charrette de Chrétien de Troyes pour le bac de français 2027 : résumé, personnages, amour courtois, parcours « Le roman et l'invention de l'amour ».",
    h1: "Le Chevalier de la charrette de Chrétien de Troyes : la fiche pour le bac de français",
    intro: [
      "Le Chevalier de la charrette, écrit par Chrétien de Troyes vers 1180 à la demande de Marie de Champagne, raconte les exploits de Lancelot pour délivrer la reine Guenièvre. C'est une nouvelle œuvre au programme du bac de français 2027, étudiée en édition bilingue avec le parcours « Le roman et l'invention de l'amour ».",
      "C'est l'un des premiers grands romans en langue française, en vers octosyllabiques, et un texte fondateur de l'amour courtois.",
    ],
    sections: [
      {
        h2: "Le résumé",
        p: [
          "Méléagant enlève la reine Guenièvre, épouse du roi Arthur, et l'emmène au royaume de Gorre, d'où personne ne revient. Un chevalier dont on ignore longtemps le nom part à sa recherche. Pour avancer, il accepte de monter dans une charrette d'infamie, réservée aux criminels, après une courte hésitation.",
          "Il traverse des épreuves (le pont de l'épée, des combats, des tentations) et l'on découvre qu'il s'appelle Lancelot. Il retrouve la reine, qui le reçoit d'abord froidement : elle lui reproche d'avoir hésité deux pas avant de monter dans la charrette. Après une nuit d'amour, de nouvelles épreuves et un emprisonnement, Lancelot affronte et tue Méléagant. Chrétien de Troyes a laissé la fin du roman à Godefroi de Leigni.",
        ],
      },
      {
        h2: "Les thèmes à connaître",
        list: [
          "L'amour courtois : le chevalier se soumet entièrement à sa dame, qui le met à l'épreuve.",
          "Le conflit entre l'honneur chevaleresque et l'amour.",
          "L'humiliation acceptée par amour, symbolisée par la charrette.",
          "Le merveilleux : royaume de l'au-delà, ponts périlleux, anneau magique.",
          "Un amour adultère, qui pose la question de la morale.",
        ],
        cta: ANALYSE_CTA,
      },
      {
        h2: "Les personnages principaux",
        list: [
          "Lancelot : le chevalier parfait, entièrement dévoué à la reine.",
          "Guenièvre : la reine, dame exigeante et souveraine.",
          "Méléagant : le ravisseur orgueilleux et déloyal.",
          "Gauvain : le neveu d'Arthur, modèle de chevalerie plus classique, qui sert de contrepoint à Lancelot.",
          "Baudemagu : le roi de Gorre, père loyal de Méléagant.",
        ],
      },
      {
        h2: "Des sujets de dissertation possibles",
        list: [
          "Dans Le Chevalier de la charrette, l'amour grandit-il ou abaisse-t-il le chevalier ?",
          "En quoi ce roman invente-t-il une nouvelle manière de raconter l'amour ?",
          "Lancelot est-il un héros exemplaire ?",
        ],
        cta: OEUVRE_CTA,
      },
    ],
    faq: [
      { q: "Pourquoi une charrette ?", a: "À l'époque, la charrette servait à exposer les criminels. Y monter, c'est accepter le déshonneur public. Lancelot le fait pour retrouver la reine." },
      { q: "Faut-il lire l'ancien français ?", a: "Non, l'édition bilingue propose une traduction. Mais connaître le texte original aide à parler de la forme (octosyllabes, rimes)." },
      { q: "Qu'est-ce que l'amour courtois ?", a: "Un code amoureux médiéval où le chevalier sert sa dame avec une soumission totale et se perfectionne à travers les épreuves qu'elle lui impose." },
    ],
    published: D,
    updated: D,
  },
  {
    slug: "pot-bouille-zola-bac-francais",
    kind: "oeuvre",
    objet: "roman",
    title: "Pot-Bouille de Zola : fiche bac de français 2027",
    description: "Pot-Bouille d'Émile Zola pour le bac de français 2027 : résumé, personnages, thèmes, parcours « Dévoiler les rouages de la société » et sujets de dissertation.",
    h1: "Pot-Bouille de Zola : la fiche pour le bac de français",
    intro: [
      "Pot-Bouille, publié en 1882, est le dixième roman des Rougon-Macquart d'Émile Zola. C'est une nouvelle œuvre au programme du bac de français 2027 en voie générale, avec le parcours « Dévoiler les rouages de la société ».",
      "Le roman se déroule presque entièrement dans un immeuble bourgeois de la rue de Choiseul, à Paris. Derrière sa façade respectable, Zola révèle hypocrisie, adultères, mariages d'argent et mépris des domestiques.",
    ],
    sections: [
      {
        h2: "Le résumé",
        p: [
          "Octave Mouret, jeune provincial ambitieux, s'installe dans l'immeuble et travaille dans un magasin de nouveautés, Au Bonheur des Dames. Il cherche à réussir grâce aux femmes et multiplie les liaisons, notamment avec Berthe Josserand, mariée à Auguste Vabre.",
          "Autour de lui, chaque appartement cache ses secrets : Mme Josserand qui cherche à tout prix à marier ses filles, les Vabre qui se disputent l'héritage, Duveyrier et sa maîtresse, les Campardon et leur ménage arrangé. À la fin, Octave épouse Mme Hédouin, la patronne du magasin, et la vie de l'immeuble reprend comme si de rien n'était.",
        ],
      },
      {
        h2: "Les thèmes à connaître",
        list: [
          "L'hypocrisie bourgeoise : la morale affichée contre les vices cachés.",
          "Le mariage comme affaire d'argent et de position sociale.",
          "L'opposition entre le grand escalier, propre et solennel, et la cour des bonnes, où les domestiques étalent tous les secrets.",
          "L'ambition d'Octave, qui annonce Au Bonheur des Dames.",
          "Le naturalisme : observer la société comme un savant, en montrant les déterminismes.",
        ],
        cta: ANALYSE_CTA,
      },
      {
        h2: "Le titre",
        p: ["Le « pot-bouille », c'est la cuisine ordinaire, le plat de tous les jours. Zola suggère que l'immeuble est une marmite où mijote la médiocrité quotidienne de la bourgeoisie."],
      },
      {
        h2: "Des sujets de dissertation possibles",
        list: [
          "Pot-Bouille est-il une satire de la bourgeoisie ou une étude sociale objective ?",
          "En quoi l'immeuble est-il un personnage à part entière du roman ?",
          "Le roman de Zola dévoile-t-il seulement les rouages de la société ou les dénonce-t-il ?",
        ],
        cta: OEUVRE_CTA,
      },
    ],
    faq: [
      { q: "Pot-Bouille est-il au programme en voie technologique ?", a: "Non. En voie technologique, il est remplacé par un autre roman de Zola, Thérèse Raquin (1867), l'histoire de Thérèse et Laurent qui noient Camille, le mari de Thérèse, puis sont rongés par le remords." },
      { q: "Faut-il avoir lu d'autres Rougon-Macquart ?", a: "Non, Pot-Bouille se lit seul. Savoir qu'il précède Au Bonheur des Dames, où Octave Mouret réapparaît, peut toutefois enrichir ta copie." },
      { q: "Qui est le personnage principal ?", a: "Octave Mouret, mais le vrai sujet est l'immeuble et l'ensemble de ses habitants." },
    ],
    published: D,
    updated: D,
  },
  {
    slug: "pluie-et-vent-sur-telumee-miracle-bac-francais",
    kind: "oeuvre",
    objet: "roman",
    title: "Pluie et vent sur Télumée Miracle : fiche bac français 2027",
    description: "Pluie et vent sur Télumée Miracle de Simone Schwarz-Bart pour le bac de français 2027 : résumé, personnages, thèmes, parcours « Tisser les mémoires, habiter le monde ».",
    h1: "Pluie et vent sur Télumée Miracle de Simone Schwarz-Bart : la fiche pour le bac de français",
    intro: [
      "Pluie et vent sur Télumée Miracle, publié en 1972, est le roman le plus connu de Simone Schwarz-Bart. C'est une nouvelle œuvre au programme du bac de français 2027, avec le parcours « Tisser les mémoires, habiter le monde ».",
      "En Guadeloupe, après l'abolition de l'esclavage, Télumée raconte sa vie et celle des femmes de sa lignée, les Lougandor, qui affrontent la misère et le malheur sans jamais se laisser abattre.",
    ],
    sections: [
      {
        h2: "Le résumé",
        p: [
          "Le roman s'ouvre sur l'histoire des aïeules : Minerve, puis Toussine, surnommée Reine Sans Nom, et Victoire, la mère de Télumée. Confiée à sa grand-mère Reine Sans Nom, Télumée grandit à Fond-Zombi et reçoit d'elle une force et une sagesse qui l'accompagneront toute sa vie.",
          "Elle vit un grand amour avec Élie, qui sombre dans l'alcool et la violence. Elle travaille dans les champs de canne, connaît la souffrance, puis trouve un nouveau compagnon, Amboise, tué lors d'une grève. Devenue vieille, entourée du respect de tous, elle se raconte et transmet ce qu'elle a appris : rester debout.",
        ],
      },
      {
        h2: "Les thèmes à connaître",
        list: [
          "La mémoire de l'esclavage et ses blessures, encore présentes après l'abolition.",
          "La transmission entre femmes, de génération en génération.",
          "La résistance au malheur : « pluie et vent » désigne les épreuves de la vie.",
          "L'enracinement dans une terre, la Guadeloupe, ses paysages, ses croyances et sa langue.",
          "La dignité et la force intérieure face à la misère.",
        ],
        cta: ANALYSE_CTA,
      },
      {
        h2: "L'écriture",
        p: ["Le récit est mené à la première personne par Télumée âgée. La langue française est imprégnée du créole : proverbes, images, rythmes de l'oralité. Cette écriture donne à la voix de Télumée la force d'un conte transmis de bouche à oreille."],
      },
      {
        h2: "Des sujets de dissertation possibles",
        list: [
          "En quoi le roman de Simone Schwarz-Bart est-il un récit de mémoire collective autant qu'individuelle ?",
          "Télumée est-elle une héroïne de la résistance ?",
          "Comment le roman montre-t-il que l'on peut habiter le monde malgré la souffrance ?",
        ],
        cta: OEUVRE_CTA,
      },
    ],
    faq: [
      { q: "Qui est Reine Sans Nom ?", a: "Toussine, la grand-mère de Télumée. Elle l'élève et lui transmet sa force morale. C'est un personnage central du roman." },
      { q: "Le roman est-il autobiographique ?", a: "Non. Simone Schwarz-Bart s'est inspirée de récits de femmes guadeloupéennes, mais Télumée est un personnage de fiction." },
      { q: "Pourquoi ce titre ?", a: "La pluie et le vent symbolisent les épreuves. « Miracle » est le surnom donné à Télumée, qui traverse ces épreuves sans être détruite." },
    ],
    published: D,
    updated: D,
  },
  {
    slug: "le-menteur-corneille-bac-francais",
    kind: "oeuvre",
    objet: "theatre",
    title: "Le Menteur de Corneille : fiche bac de français 2027",
    description: "Le Menteur de Corneille pour le bac de français 2027 : résumé acte par acte, personnages, thèmes, parcours « Mensonge et comédie » et sujets de dissertation.",
    h1: "Le Menteur de Corneille : la fiche pour le bac de français",
    intro: [
      "Le Menteur, comédie en cinq actes et en alexandrins, est jouée en 1644. Pierre Corneille s'inspire d'une pièce espagnole de Ruiz de Alarcón. L'œuvre est au programme du bac de français 2027 avec le parcours « Mensonge et comédie ».",
      "Dorante, jeune homme qui arrive à Paris, ment sans cesse, par plaisir et par goût de briller, jusqu'à se prendre au piège de ses propres inventions.",
    ],
    sections: [
      {
        h2: "Le résumé",
        p: [
          "Dorante, qui a quitté ses études de droit à Poitiers, veut briller dans la société parisienne. Aux Tuileries, il rencontre deux jeunes femmes, Clarice et Lucrèce, et se prétend héros de guerre. Il se trompe sur leurs noms et croit aimer Lucrèce alors qu'il s'est épris de Clarice.",
          "Il enchaîne les mensonges : une fête somptueuse sur l'eau qu'il n'a jamais donnée, un mariage secret à Poitiers pour échapper à celui que son père, Géronte, lui propose avec Clarice, un duel inventé. Son valet Cliton s'étonne de son talent. À la fin, démasqué et un peu perdu, Dorante accepte d'épouser Lucrèce.",
        ],
      },
      {
        h2: "Les thèmes à connaître",
        list: [
          "Le mensonge comme art : Dorante est un véritable poète de l'invention.",
          "Le théâtre dans le théâtre : mentir, c'est jouer un rôle et créer une fiction.",
          "Les quiproquos et la confusion des identités.",
          "La relation père-fils et la question de l'honneur.",
          "Paris, ville des apparences et du paraître.",
        ],
        cta: ANALYSE_CTA,
      },
      {
        h2: "Les personnages principaux",
        list: [
          "Dorante : le menteur, brillant et inventif.",
          "Cliton : son valet, témoin lucide et comique.",
          "Géronte : son père, attaché à l'honneur, trompé et blessé.",
          "Clarice et Lucrèce : les deux jeunes femmes à l'origine de la confusion.",
          "Alcippe : l'amant jaloux de Clarice.",
        ],
      },
      {
        h2: "Des sujets de dissertation possibles",
        list: [
          "Dans Le Menteur, le mensonge est-il condamné ou célébré ?",
          "Dorante est-il un personnage seulement comique ?",
          "En quoi le mensonge est-il le moteur de la comédie dans la pièce de Corneille ?",
        ],
        cta: OEUVRE_CTA,
      },
    ],
    faq: [
      { q: "Le Menteur est-il une comédie ou une tragédie ?", a: "Une comédie, même si Corneille est surtout connu pour ses tragédies comme Le Cid." },
      { q: "Dorante est-il puni à la fin ?", a: "Pas vraiment. Il se marie avec Lucrèce et s'en sort, ce qui pose la question de la morale de la pièce." },
      { q: "Quelle scène choisir pour l'oral ?", a: "Le récit de la fête sur l'eau (acte I) et la scène du faux mariage racontée à Géronte (acte II) montrent le mieux le génie du mensonge de Dorante." },
    ],
    published: D,
    updated: D,
  },
  {
    slug: "on-ne-badine-pas-avec-l-amour-musset-bac-francais",
    kind: "oeuvre",
    objet: "theatre",
    title: "On ne badine pas avec l'amour : fiche bac de français 2027",
    description: "On ne badine pas avec l'amour de Musset pour le bac de français 2027 : résumé, personnages, tirade de Perdican, parcours « Les jeux du cœur et de la parole ».",
    h1: "On ne badine pas avec l'amour de Musset : la fiche pour le bac de français",
    intro: [
      "On ne badine pas avec l'amour, publié en 1834, est un proverbe dramatique en trois actes et en prose d'Alfred de Musset. Il est au programme du bac de français 2027 avec le parcours « Les jeux du cœur et de la parole ».",
      "La pièce commence comme une comédie et finit en tragédie : par orgueil, deux jeunes gens qui s'aiment jouent avec les sentiments, et une innocente en meurt.",
    ],
    sections: [
      {
        h2: "Le résumé",
        p: [
          "Le baron veut marier son fils Perdican, qui revient de ses études, à sa nièce Camille, qui sort du couvent. Mais Camille, influencée par les religieuses et leurs déceptions amoureuses, refuse l'amour par peur de souffrir. Vexé, Perdican courtise Rosette, une jeune paysanne, sœur de lait de Camille, pour rendre Camille jalouse.",
          "Le jeu de l'orgueil s'emballe. Perdican et Camille finissent par s'avouer leur amour, mais Rosette, qui a tout entendu, meurt de chagrin. Camille dit adieu à Perdican.",
        ],
      },
      {
        h2: "Les passages à connaître",
        list: [
          "La scène d'exposition avec le chœur et les deux gouverneurs grotesques, Maître Blazius et Maître Bridaine.",
          "Le dialogue entre Camille et Perdican à l'acte II, scène 5, avec la tirade de Perdican : « Tous les hommes sont menteurs, inconstants, faux… ».",
          "La scène où Perdican déclare son amour à Rosette devant Camille cachée (acte III).",
          "Le dénouement tragique.",
        ],
        cta: ANALYSE_CTA,
      },
      {
        h2: "Les thèmes à connaître",
        list: [
          "L'orgueil, qui empêche les personnages de dire la vérité de leurs sentiments.",
          "Le langage comme arme : les personnages jouent avec les mots et se blessent.",
          "Le mélange des registres : comique, lyrique et tragique.",
          "La critique de l'éducation (couvent, gouverneurs ridicules).",
          "Le titre-proverbe, qui annonce la leçon morale.",
        ],
      },
      {
        h2: "Des sujets de dissertation possibles",
        list: [
          "On ne badine pas avec l'amour est-elle une comédie ou une tragédie ?",
          "Dans la pièce de Musset, la parole rapproche-t-elle ou sépare-t-elle les personnages ?",
          "Qui est responsable de la mort de Rosette ?",
        ],
        cta: OEUVRE_CTA,
      },
    ],
    faq: [
      { q: "Qu'est-ce qu'un proverbe dramatique ?", a: "Une courte pièce de théâtre qui illustre un proverbe, ici donné par le titre lui-même." },
      { q: "Qui est Rosette ?", a: "La sœur de lait de Camille, une jeune paysanne naïve que Perdican séduit par dépit. Elle est la victime du jeu des deux personnages." },
      { q: "Pourquoi la pièce est-elle si étudiée ?", a: "Parce qu'elle mêle les registres, contient des tirades célèbres et pose une vraie question morale sur l'amour et l'orgueil." },
    ],
    published: D,
    updated: D,
  },
  {
    slug: "pour-un-oui-ou-pour-un-non-sarraute-bac-francais",
    kind: "oeuvre",
    objet: "theatre",
    title: "Pour un oui ou pour un non de Sarraute : fiche bac français 2027",
    description: "Pour un oui ou pour un non de Nathalie Sarraute pour le bac de français 2027 : résumé, personnages, tropismes, parcours « Théâtre et dispute » et sujets possibles.",
    h1: "Pour un oui ou pour un non de Nathalie Sarraute : la fiche pour le bac de français",
    intro: [
      "Pour un oui ou pour un non est une courte pièce de Nathalie Sarraute, publiée en 1982 et d'abord conçue pour la radio. Elle est au programme du bac de français 2027 avec le parcours « Théâtre et dispute ».",
      "Deux amis de longue date se disputent à cause d'une simple intonation. Ce rien révèle tout ce qui les sépare.",
    ],
    sections: [
      {
        h2: "Le résumé",
        p: [
          "H.1 vient voir H.2 pour comprendre pourquoi son ami s'est éloigné. Après avoir hésité, H.2 avoue : un jour où H.1 lui annonçait une réussite, il a répondu « C'est bien… ça », avec un suspens et un accent qui l'ont blessé.",
          "La discussion s'envenime. Derrière ce détail, deux visions du monde s'affrontent : H.1, à l'aise dans la réussite et les conventions sociales, et H.2, poète plus retiré, attentif à ce qui se cache sous les mots. Des voisins, H.3 et F., sont appelés comme arbitres sans rien régler. La pièce se termine sur un « oui » et un « non » qui laissent la dispute ouverte.",
        ],
      },
      {
        h2: "Les notions à connaître",
        list: [
          "Les tropismes : les mouvements intérieurs, minuscules et à peine conscients, que Sarraute cherche à saisir.",
          "La sous-conversation : ce qui se dit sous les paroles échangées, dans le ton et les silences.",
          "Des personnages sans nom (H.1, H.2), presque sans décor et sans action extérieure.",
          "Le langage comme lieu du conflit : tout part d'un mot et de sa manière d'être prononcé.",
        ],
        cta: ANALYSE_CTA,
      },
      {
        h2: "Les thèmes",
        list: [
          "L'amitié et sa fragilité.",
          "L'opposition entre deux manières de vivre.",
          "La difficulté de communiquer et de se comprendre.",
          "La dispute comme moteur théâtral, presque comme un procès.",
        ],
      },
      {
        h2: "Des sujets de dissertation possibles",
        list: [
          "La dispute dans Pour un oui ou pour un non est-elle dérisoire ?",
          "En quoi la pièce de Sarraute fait-elle du langage le véritable sujet du théâtre ?",
          "Peut-on dire que la pièce oppose deux visions du monde plutôt que deux personnages ?",
        ],
        cta: OEUVRE_CTA,
      },
    ],
    faq: [
      { q: "Pourquoi les personnages s'appellent-ils H.1 et H.2 ?", a: "Pour les rendre universels et concentrer l'attention sur le langage et les mouvements intérieurs plutôt que sur leur identité." },
      { q: "Quelle est la phrase qui déclenche la dispute ?", a: "« C'est bien… ça », prononcé par H.1 avec un suspens et une intonation que H.2 a ressentis comme condescendants." },
      { q: "La pièce est-elle longue ?", a: "Non, elle se lit en moins d'une heure, mais chaque réplique est dense et mérite d'être relue." },
    ],
    published: D,
    updated: D,
  },
];
