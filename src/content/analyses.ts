// Full linear analyses of public-domain texts from the 2027 programme.
export type Point = { cite: string; analyse: string };
export type Mouvement = { titre: string; lignes: string; points: Point[] };
export type Analyse = {
  slug: string;
  title: string;
  description: string;
  h1: string;
  auteur: string;
  oeuvre: string;
  oeuvreGuide: string;
  reference: string;
  texte: string;
  vers: boolean;
  intro: string[];
  problematique: string;
  mouvements: Mouvement[];
  conclusion: string[];
  grammaire: { question: string; reponse: string };
  faq: { q: string; a: string }[];
  published: string;
  updated: string;
};

const D = "2026-11-10";
const DOUAI = "cahier-de-douai-rimbaud-bac-francais";

export const ANALYSES: Analyse[] = [
  {
    slug: "ma-boheme-rimbaud",
    title: "Ma Bohème de Rimbaud : analyse linéaire complète (bac 2027)",
    description: "Analyse linéaire de « Ma Bohème » de Rimbaud (Cahier de Douai) pour l'oral du bac de français : texte, problématique, mouvements, procédés, conclusion et question de grammaire.",
    h1: "Ma Bohème de Rimbaud : analyse linéaire complète",
    auteur: "Arthur Rimbaud",
    oeuvre: "Cahier de Douai",
    oeuvreGuide: DOUAI,
    reference: "« Ma Bohème (Fantaisie) », Cahier de Douai, 1870",
    vers: true,
    texte: `Je m'en allais, les poings dans mes poches crevées ;
Mon paletot aussi devenait idéal ;
J'allais sous le ciel, Muse ! et j'étais ton féal ;
Oh ! là ! là ! que d'amours splendides j'ai rêvées !

Mon unique culotte avait un large trou.
– Petit-Poucet rêveur, j'égrenais dans ma course
Des rimes. Mon auberge était à la Grande-Ourse.
– Mes étoiles au ciel avaient un doux frou-frou

Et je les écoutais, assis au bord des routes,
Ces bons soirs de septembre où je sentais des gouttes
De rosée à mon front, comme un vin de vigueur ;

Où, rimant au milieu des ombres fantastiques,
Comme des lyres, je tirais les élastiques
De mes souliers blessés, un pied près de mon cœur !`,
    intro: [
      "« Ma Bohème » est le dernier poème du Cahier de Douai. Rimbaud a seize ans : à l'automne 1870, il fugue de Charleville et marche sur les routes des Ardennes et de Belgique. Ce sonnet en alexandrins transforme cette errance en autoportrait du poète vagabond.",
      "Le sous-titre « Fantaisie » annonce le ton : libre, léger, plein d'humour. Rimbaud reprend la forme classique du sonnet, mais il la bouscule de l'intérieur.",
    ],
    problematique: "Comment Rimbaud fait-il de son errance misérable une expérience heureuse de liberté et de création poétique ?",
    mouvements: [
      {
        titre: "Premier mouvement : le départ d'un vagabond libre",
        lignes: "vers 1 à 4",
        points: [
          { cite: "« Je m'en allais »", analyse: "Le poème s'ouvre sur un verbe de mouvement à l'imparfait, sans destination. L'imparfait installe une habitude : l'errance est un mode de vie, pas un simple voyage. Le « je » est omniprésent, c'est un autoportrait." },
          { cite: "« les poings dans mes poches crevées »", analyse: "La pauvreté apparaît dès le premier vers, mais sans plainte. Les « poings » suggèrent aussi une attitude de défi, celle d'un adolescent révolté." },
          { cite: "« Mon paletot aussi devenait idéal »", analyse: "Jeu de mots plein d'humour : le manteau est si usé qu'il n'existe presque plus, il n'est plus qu'une « idée ». Le dénuement matériel devient élévation spirituelle." },
          { cite: "« Muse ! et j'étais ton féal »", analyse: "L'apostrophe à la Muse et le mot médiéval « féal » (serviteur fidèle) font du vagabond un chevalier de la poésie. Rimbaud reprend le vocabulaire de la tradition tout en le traitant avec légèreté." },
          { cite: "« Oh ! là ! là ! que d'amours splendides j'ai rêvées ! »", analyse: "L'interjection familière brise le ton noble du vers précédent. Ce mélange des registres est une marque de la liberté de Rimbaud. Le verbe « rêvées » montre que la richesse du poète est toute intérieure." },
        ],
      },
      {
        titre: "Deuxième mouvement : la nature comme maison et source de poésie",
        lignes: "vers 5 à 11",
        points: [
          { cite: "« Mon unique culotte avait un large trou. »", analyse: "Détail trivial, presque comique, dans une phrase qui tient en un seul vers. Rimbaud fait entrer dans le sonnet une réalité prosaïque que la poésie classique excluait." },
          { cite: "« Petit-Poucet rêveur, j'égrenais dans ma course / Des rimes. »", analyse: "La référence au conte de Perrault renvoie à l'enfance. Mais au lieu de cailloux, le poète sème des rimes : la marche produit la poésie. Le rejet de « Des rimes » au vers suivant mime ce geste de semer et met le mot en valeur." },
          { cite: "« Mon auberge était à la Grande-Ourse. »", analyse: "Périphrase humoristique pour dire qu'il dort à la belle étoile. Le ciel devient une auberge : la pauvreté est transformée en luxe cosmique." },
          { cite: "« Mes étoiles au ciel avaient un doux frou-frou »", analyse: "Le possessif « mes » montre que le poète possède le ciel. La synesthésie (des étoiles que l'on entend) et l'onomatopée « frou-frou » créent un univers doux, presque maternel." },
          { cite: "« Et je les écoutais, assis au bord des routes »", analyse: "L'enjambement entre le deuxième quatrain et le premier tercet déborde la structure du sonnet. La forme elle-même devient vagabonde." },
          { cite: "« des gouttes / De rosée à mon front, comme un vin de vigueur »", analyse: "La comparaison change la rosée en vin : la nature nourrit et enivre le poète. L'allitération en [v] souligne cette énergie. Les sensations sont heureuses, le corps est en accord avec le monde." },
        ],
      },
      {
        titre: "Troisième mouvement : le vagabond devient poète",
        lignes: "vers 12 à 14",
        points: [
          { cite: "« rimant au milieu des ombres fantastiques »", analyse: "Le participe présent montre le poète en pleine création. Les « ombres fantastiques » rappellent le sous-titre « Fantaisie » : la nuit nourrit l'imagination au lieu d'effrayer." },
          { cite: "« Comme des lyres, je tirais les élastiques / De mes souliers blessés »", analyse: "La comparaison est le cœur du poème : les lacets de chaussures usées deviennent les cordes d'une lyre, instrument d'Orphée et symbole de la poésie. L'objet le plus humble devient l'instrument le plus noble. La personnification « blessés » donne une dignité aux souliers." },
          { cite: "« un pied près de mon cœur ! »", analyse: "La chute joue sur le double sens du mot « pied » : le pied du marcheur et le pied du vers, unité de mesure en poésie. Marche et écriture ne font qu'un. Le rapprochement avec le « cœur » lie le corps, l'émotion et la création." },
        ],
      },
    ],
    conclusion: [
      "Dans « Ma Bohème », Rimbaud transforme la pauvreté et l'errance en bonheur et en création. Le vagabond aux poches crevées devient un poète qui possède le ciel et fait de ses lacets une lyre.",
      "Cette liberté se lit aussi dans la forme : un sonnet respecté en apparence, mais traversé de mots familiers, d'humour et d'enjambements. Le poème illustre parfaitement le parcours « Émancipations créatrices » : c'est en s'affranchissant des règles sociales et poétiques que Rimbaud invente sa voix. On peut le rapprocher de « Sensation », qui rêvait au futur cette marche heureuse.",
    ],
    grammaire: {
      question: "Analysez la proposition subordonnée dans « Ces bons soirs de septembre où je sentais des gouttes de rosée à mon front ».",
      reponse: "« où je sentais des gouttes de rosée à mon front » est une proposition subordonnée relative. Elle est introduite par le pronom relatif « où », qui a pour antécédent le groupe nominal « ces bons soirs de septembre ». Dans la subordonnée, « où » est complément circonstanciel de temps du verbe « sentais ». La relative est épithète de son antécédent (elle complète le nom « soirs »).",
    },
    faq: [
      { q: "Quelle est la forme de « Ma Bohème » ?", a: "Un sonnet en alexandrins : deux quatrains et deux tercets. Rimbaud en garde la structure mais y introduit des mots familiers et des enjambements." },
      { q: "Pourquoi le sous-titre « Fantaisie » ?", a: "Il annonce un poème libre et léger, guidé par l'imagination, et rappelle un genre musical sans règles strictes." },
      { q: "Quelle problématique proposer à l'oral ?", a: "Par exemple : comment Rimbaud fait-il de son errance misérable une expérience heureuse de liberté et de création poétique ?" },
    ],
    published: D,
    updated: D,
  },
  {
    slug: "le-dormeur-du-val-rimbaud",
    title: "Le Dormeur du val de Rimbaud : analyse linéaire complète (bac 2027)",
    description: "Analyse linéaire du « Dormeur du val » de Rimbaud (Cahier de Douai) pour l'oral du bac de français : texte, problématique, mouvements, procédés, conclusion et grammaire.",
    h1: "Le Dormeur du val de Rimbaud : analyse linéaire complète",
    auteur: "Arthur Rimbaud",
    oeuvre: "Cahier de Douai",
    oeuvreGuide: DOUAI,
    reference: "« Le Dormeur du val », Cahier de Douai, octobre 1870",
    vers: true,
    texte: `C'est un trou de verdure où chante une rivière,
Accrochant follement aux herbes des haillons
D'argent ; où le soleil, de la montagne fière,
Luit : c'est un petit val qui mousse de rayons.

Un soldat jeune, bouche ouverte, tête nue,
Et la nuque baignant dans le frais cresson bleu,
Dort ; il est étendu dans l'herbe, sous la nue,
Pâle dans son lit vert où la lumière pleut.

Les pieds dans les glaïeuls, il dort. Souriant comme
Sourirait un enfant malade, il fait un somme :
Nature, berce-le chaudement : il a froid.

Les parfums ne font pas frissonner sa narine ;
Il dort dans le soleil, la main sur sa poitrine,
Tranquille. Il a deux trous rouges au côté droit.`,
    intro: [
      "Rimbaud écrit « Le Dormeur du val » en octobre 1870, à seize ans, pendant la guerre franco-prussienne. Ce sonnet du Cahier de Douai décrit un jeune soldat allongé dans un paysage lumineux. Ce n'est qu'au dernier vers que le lecteur comprend qu'il est mort.",
      "Le poème est donc construit comme un piège : il nous fait d'abord admirer une scène paisible pour mieux nous faire ressentir le scandale de la guerre.",
    ],
    problematique: "Comment Rimbaud dénonce-t-il la guerre en retardant jusqu'au dernier vers la révélation de la mort du soldat ?",
    mouvements: [
      {
        titre: "Premier mouvement : un paysage vivant et lumineux",
        lignes: "vers 1 à 4",
        points: [
          { cite: "« C'est un trou de verdure »", analyse: "Le présentatif « c'est » installe un tableau, comme si le lecteur découvrait la scène. Mais le mot « trou » est inquiétant : il annonce discrètement les « deux trous rouges » du dernier vers et peut évoquer une tombe." },
          { cite: "« où chante une rivière »", analyse: "La personnification donne vie à la nature, qui est joyeuse. Le poème commence par des sensations auditives et visuelles agréables." },
          { cite: "« Accrochant follement aux herbes des haillons / D'argent »", analyse: "La métaphore transforme les reflets de l'eau en tissu précieux. L'adverbe « follement » exprime une énergie débordante. Le rejet de « D'argent » met en valeur la lumière et bouscule déjà le rythme de l'alexandrin." },
          { cite: "« Luit : c'est un petit val qui mousse de rayons. »", analyse: "Nouveau rejet sur le verbe « Luit », qui fait éclater la lumière. La métaphore « mousse de rayons » mêle l'eau et la lumière. Le champ lexical de la lumière (« soleil », « luit », « rayons », « argent ») domine le quatrain : la nature est pleine de vie." },
        ],
      },
      {
        titre: "Deuxième mouvement : le portrait d'un soldat apparemment endormi",
        lignes: "vers 5 à 8",
        points: [
          { cite: "« Un soldat jeune, bouche ouverte, tête nue »", analyse: "Le personnage apparaît seulement au vers 5. L'adjectif « jeune », placé après le nom, insiste sur son âge. Mais « bouche ouverte » et « tête nue » sont ambigus : c'est l'attitude d'un dormeur, ou celle d'un cadavre." },
          { cite: "« la nuque baignant dans le frais cresson bleu »", analyse: "Le corps est immergé dans la nature comme dans un bain. Les couleurs froides (« bleu ») et la fraîcheur créent une impression de bien-être, mais préparent aussi le froid de la mort." },
          { cite: "« Dort ; »", analyse: "Le verbe est mis en relief par le rejet en début de vers. Il reviendra trois fois dans le poème : cette insistance est suspecte, comme si le poète voulait retarder la vérité." },
          { cite: "« Pâle dans son lit vert où la lumière pleut. »", analyse: "L'adjectif « pâle », en tête de vers, est un indice de mort. La métaphore du « lit vert » prolonge l'image du sommeil mais peut aussi évoquer un lit de mort. « La lumière pleut » : la métaphore associe lumière et larmes." },
        ],
      },
      {
        titre: "Troisième mouvement : des indices de plus en plus inquiétants",
        lignes: "vers 9 à 11",
        points: [
          { cite: "« Les pieds dans les glaïeuls, il dort. »", analyse: "Deuxième occurrence de « il dort ». Le glaïeul tire son nom du latin gladius, le glaive : la fleur rappelle discrètement l'arme. C'est aussi une fleur associée aux enterrements." },
          { cite: "« Souriant comme / Sourirait un enfant malade »", analyse: "La comparaison rapproche le soldat d'un enfant, ce qui souligne son innocence. Mais l'adjectif « malade » ternit le sourire. L'enjambement audacieux sur « comme » déséquilibre le vers et crée un malaise." },
          { cite: "« Nature, berce-le chaudement : il a froid. »", analyse: "Le poète s'adresse à la Nature personnifiée, comme à une mère (« berce-le »). L'impératif exprime une prière et de la tendresse. L'antithèse « chaudement » / « froid » est l'indice le plus net : ce froid est celui de la mort." },
        ],
      },
      {
        titre: "Quatrième mouvement : la révélation de la mort",
        lignes: "vers 12 à 14",
        points: [
          { cite: "« Les parfums ne font pas frissonner sa narine »", analyse: "La négation marque l'absence de sensation. Alors que tout le poème était rempli de sensations, le soldat n'en perçoit aucune : il ne respire plus." },
          { cite: "« Il dort dans le soleil, la main sur sa poitrine »", analyse: "Troisième « il dort ». La main sur la poitrine rappelle la position des gisants, ou le geste d'un homme touché." },
          { cite: "« Tranquille. »", analyse: "L'adjectif est isolé par le rejet et par le point. C'est le dernier mot d'apaisement, juste avant la chute, ce qui rend le contraste plus violent." },
          { cite: "« Il a deux trous rouges au côté droit. »", analyse: "La chute est une phrase courte, au présent, sans aucun commentaire. Le rouge du sang s'oppose brutalement au vert et au bleu du paysage. Le mot « trous » répond au « trou de verdure » du premier vers : le poème se referme sur lui-même. L'euphémisme (le mot « mort » n'est jamais écrit) rend la révélation encore plus forte." },
        ],
      },
    ],
    conclusion: [
      "Rimbaud construit son sonnet comme une révélation progressive : un paysage éclatant de vie, un soldat qui semble dormir, des indices de plus en plus inquiétants, puis la chute. Le lecteur est obligé de relire tout le poème à la lumière du dernier vers.",
      "La dénonciation de la guerre est d'autant plus efficace qu'elle est implicite : aucun discours, seulement le contraste entre une nature maternelle et la mort absurde d'un jeune homme. On peut rapprocher ce poème du « Mal », dans le même recueil, où Rimbaud attaque la guerre de façon cette fois explicite.",
    ],
    grammaire: {
      question: "Analysez la négation dans « Les parfums ne font pas frissonner sa narine ».",
      reponse: "Il s'agit d'une négation totale, car elle porte sur l'ensemble de la proposition. Elle est syntaxique et composée de deux éléments : l'adverbe « ne » (discordantiel) et l'adverbe « pas » (forclusif), qui encadrent le verbe conjugué « font ». La phrase affirmative correspondante serait : « Les parfums font frissonner sa narine. » Cette négation souligne l'absence de sensation du soldat et prépare la révélation de sa mort.",
    },
    faq: [
      { q: "Le soldat est-il mort dès le début du poème ?", a: "Oui. Le poème ne le révèle qu'au dernier vers, mais de nombreux indices l'annoncent : « trou », « pâle », « malade », « il a froid »." },
      { q: "Quelle est la forme du poème ?", a: "Un sonnet en alexandrins, avec de nombreux rejets et enjambements qui bousculent le rythme classique." },
      { q: "Quel est le contexte historique ?", a: "La guerre franco-prussienne de 1870. Rimbaud a seize ans et traverse une région touchée par les combats." },
    ],
    published: D,
    updated: D,
  },
  {
    slug: "sensation-rimbaud",
    title: "Sensation de Rimbaud : analyse linéaire complète (bac 2027)",
    description: "Analyse linéaire de « Sensation » de Rimbaud (Cahier de Douai) pour l'oral du bac de français : texte, problématique, mouvements, procédés, conclusion et grammaire.",
    h1: "Sensation de Rimbaud : analyse linéaire complète",
    auteur: "Arthur Rimbaud",
    oeuvre: "Cahier de Douai",
    oeuvreGuide: DOUAI,
    reference: "« Sensation », Cahier de Douai, mars 1870",
    vers: true,
    texte: `Par les soirs bleus d'été, j'irai dans les sentiers,
Picoté par les blés, fouler l'herbe menue :
Rêveur, j'en sentirai la fraîcheur à mes pieds.
Je laisserai le vent baigner ma tête nue.

Je ne parlerai pas, je ne penserai rien :
Mais l'amour infini me montera dans l'âme,
Et j'irai loin, bien loin, comme un bohémien,
Par la Nature, – heureux comme avec une femme.`,
    intro: [
      "« Sensation » est daté de mars 1870 : Rimbaud a quinze ans et n'a pas encore fugué. Dans ces deux quatrains d'alexandrins, il rêve au futur d'un départ dans la nature. C'est l'un des poèmes les plus courts et les plus célèbres du Cahier de Douai.",
      "Le titre donne le programme : il ne s'agit pas de raconter ou de réfléchir, mais de sentir. Le bonheur vient du contact direct du corps avec le monde.",
    ],
    problematique: "Comment ce court poème fait-il de la marche dans la nature un rêve de liberté et de bonheur absolu ?",
    mouvements: [
      {
        titre: "Premier mouvement : le bonheur des sensations",
        lignes: "vers 1 à 4",
        points: [
          { cite: "« Par les soirs bleus d'été »", analyse: "Le poème s'ouvre sur un cadre idéal : la saison et l'heure les plus douces. Le pluriel « les soirs » suggère que l'expérience se répétera. L'adjectif de couleur « bleus », appliqué aux soirs, mêle la vue et l'atmosphère." },
          { cite: "« j'irai dans les sentiers »", analyse: "Le futur domine tout le poème : c'est un projet, un rêve, pas un souvenir. Il exprime une certitude. Les « sentiers » sont des chemins modestes, à l'écart des routes et de la société." },
          { cite: "« Picoté par les blés, fouler l'herbe menue »", analyse: "Les sensations tactiles sont précises, légères. Le verbe familier « picoté » fait entrer un mot simple dans l'alexandrin. Tout le corps est concerné, des jambes aux pieds." },
          { cite: "« Rêveur, j'en sentirai la fraîcheur à mes pieds. »", analyse: "L'adjectif « rêveur », détaché en tête de vers, caractérise le poète. Le verbe « sentirai » reprend le titre. Le poème progresse des pieds (vers 3) à la tête (vers 4)." },
          { cite: "« Je laisserai le vent baigner ma tête nue. »", analyse: "Le verbe « laisserai » marque l'abandon : le poète ne domine pas la nature, il s'y livre. La métaphore du bain fait du vent un élément liquide et enveloppant. La « tête nue » est un signe de liberté, sans chapeau ni convention." },
        ],
      },
      {
        titre: "Deuxième mouvement : de la sensation à la plénitude",
        lignes: "vers 5 à 8",
        points: [
          { cite: "« Je ne parlerai pas, je ne penserai rien »", analyse: "Deux négations parallèles : le poète renonce à la parole et à la pensée. C'est paradoxal pour un poète, mais c'est la condition du bonheur : faire silence pour mieux sentir." },
          { cite: "« Mais l'amour infini me montera dans l'âme »", analyse: "La conjonction « mais » marque un basculement : du vide naît une plénitude. Le mouvement est ascendant (« montera ») et passe du corps à « l'âme ». L'adjectif « infini » donne à cette expérience une dimension presque mystique." },
          { cite: "« Et j'irai loin, bien loin, comme un bohémien »", analyse: "La répétition « loin, bien loin » étire le vers et l'espace. La comparaison avec le « bohémien » valorise une figure rejetée par la société : celle de l'errant sans attache. Elle annonce « Ma Bohème »." },
          { cite: "« Par la Nature, – heureux comme avec une femme. »", analyse: "La majuscule personnifie la Nature. Le tiret crée une pause avant la chute. La comparaison finale fait de la nature une compagne amoureuse : le bonheur est sensuel et total. Le mot « heureux » résume tout le poème." },
        ],
      },
    ],
    conclusion: [
      "En huit vers, Rimbaud passe de sensations très concrètes à un bonheur absolu. Le poème rêve une fusion avec la nature, loin de la société, de la parole et même de la pensée.",
      "Ce texte de jeunesse contient déjà le désir de départ qui animera tout le Cahier de Douai. Il illustre le parcours « Émancipations créatrices » : la liberté est d'abord celle du corps en marche. « Ma Bohème », quelques mois plus tard, racontera au passé ce que « Sensation » imaginait au futur.",
    ],
    grammaire: {
      question: "Analysez la négation dans « Je ne parlerai pas, je ne penserai rien ».",
      reponse: "La phrase contient deux négations syntaxiques. « Je ne parlerai pas » est une négation totale : elle porte sur toute la proposition et s'exprime avec « ne… pas ». « Je ne penserai rien » est une négation partielle : elle porte sur un seul élément, le complément d'objet direct, exprimé par le pronom indéfini « rien » associé à « ne ». Ces deux négations expriment le renoncement du poète à la parole et à la pensée.",
    },
    faq: [
      { q: "Pourquoi le poème est-il au futur ?", a: "Parce que Rimbaud n'a pas encore fugué quand il l'écrit. Le futur exprime un rêve de départ présenté comme certain." },
      { q: "Quelle est la forme de « Sensation » ?", a: "Deux quatrains d'alexandrins à rimes croisées. La forme est simple, comme l'expérience décrite." },
      { q: "Avec quel poème le rapprocher ?", a: "Avec « Ma Bohème », du même recueil, qui raconte l'errance réelle et en fait la source de la création poétique." },
    ],
    published: D,
    updated: D,
  },
  {
    slug: "le-mal-rimbaud",
    title: "Le Mal de Rimbaud : analyse linéaire complète (bac 2027)",
    description: "Analyse linéaire du sonnet « Le Mal » de Rimbaud (Cahier de Douai) pour l'oral du bac de français : texte, problématique, mouvements, procédés, conclusion et grammaire.",
    h1: "Le Mal de Rimbaud : analyse linéaire complète",
    auteur: "Arthur Rimbaud",
    oeuvre: "Cahier de Douai",
    oeuvreGuide: DOUAI,
    reference: "« Le Mal », Cahier de Douai, 1870",
    vers: true,
    texte: `Tandis que les crachats rouges de la mitraille
Sifflent tout le jour par l'infini du ciel bleu ;
Qu'écarlates ou verts, près du Roi qui les raille,
Croulent les bataillons en masse dans le feu ;

Tandis qu'une folie épouvantable broie
Et fait de cent milliers d'hommes un tas fumant ;
– Pauvres morts ! dans l'été, dans l'herbe, dans ta joie,
Nature ! ô toi qui fis ces hommes saintement !… –

Il est un Dieu, qui rit aux nappes damassées
Des autels, à l'encens, aux grands calices d'or ;
Qui dans le bercement des hosannah s'endort,

Et se réveille, quand des mères, ramassées
Dans l'angoisse, et pleurant sous leur vieux bonnet noir,
Lui donnent un gros sou lié dans leur mouchoir !`,
    intro: [
      "« Le Mal » est un sonnet du Cahier de Douai, écrit en 1870 pendant la guerre franco-prussienne. Rimbaud, seize ans, y attaque à la fois la guerre, les rois qui l'ordonnent et une Église qu'il juge indifférente à la souffrance.",
      "Le poème est fait d'une seule longue phrase : les quatrains décrivent le massacre, les tercets montrent un Dieu qui ne s'éveille que pour l'argent des pauvres.",
    ],
    problematique: "Comment Rimbaud fait-il de ce sonnet une double dénonciation, de la guerre et de la religion ?",
    mouvements: [
      {
        titre: "Premier mouvement : l'horreur de la guerre",
        lignes: "vers 1 à 6",
        points: [
          { cite: "« Tandis que les crachats rouges de la mitraille »", analyse: "La conjonction « Tandis que » ouvre une subordonnée : le lecteur attend la proposition principale, qui n'arrivera qu'au vers 9. La métaphore des « crachats » rend la guerre répugnante, loin de toute gloire. Le rouge évoque le sang." },
          { cite: "« Sifflent tout le jour par l'infini du ciel bleu »", analyse: "L'allitération en [s] et en [f] fait entendre les projectiles. Le contraste entre le rouge de la mitraille et le « ciel bleu » oppose la violence humaine à la beauté du monde." },
          { cite: "« Qu'écarlates ou verts, près du Roi qui les raille »", analyse: "Les couleurs désignent les uniformes français et prussiens : les soldats des deux camps sont mis sur le même plan, tous victimes. Le « Roi » (avec une majuscule ironique) se moque d'eux : les puissants méprisent ceux qu'ils envoient mourir." },
          { cite: "« Croulent les bataillons en masse dans le feu »", analyse: "L'inversion du sujet place le verbe « Croulent » en tête de vers et mime l'effondrement. Les hommes ne sont plus que des « bataillons », une « masse »." },
          { cite: "« une folie épouvantable broie / Et fait de cent milliers d'hommes un tas fumant »", analyse: "La guerre est une « folie » personnifiée, une machine qui « broie ». L'hyperbole « cent milliers » et la chute « un tas fumant » montrent la déshumanisation : les hommes sont réduits à de la matière." },
        ],
      },
      {
        titre: "Deuxième mouvement : la compassion du poète",
        lignes: "vers 7 et 8",
        points: [
          { cite: "« – Pauvres morts ! »", analyse: "Les tirets ouvrent une parenthèse lyrique. L'exclamation exprime la pitié du poète, qui prend parti pour les victimes." },
          { cite: "« dans l'été, dans l'herbe, dans ta joie, / Nature ! »", analyse: "Le rythme ternaire et l'anaphore de « dans » célèbrent la vie. L'apostrophe à la Nature, tutoyée, oppose sa « joie » à la destruction des hommes." },
          { cite: "« ô toi qui fis ces hommes saintement ! »", analyse: "C'est la Nature, et non Dieu, qui a créé les hommes « saintement ». Rimbaud déplace le sacré : le vocabulaire religieux est retiré à l'Église et donné à la Nature. Cela prépare l'attaque des tercets." },
        ],
      },
      {
        titre: "Troisième mouvement : un Dieu indifférent et cupide",
        lignes: "vers 9 à 14",
        points: [
          { cite: "« Il est un Dieu, qui rit »", analyse: "La proposition principale arrive enfin, et crée un effet de chute au milieu du poème. Le présentatif « Il est » et l'article indéfini « un Dieu » le tiennent à distance. Pendant le massacre, ce Dieu « rit » : le verbe fait écho au Roi qui « raille »." },
          { cite: "« aux nappes damassées / Des autels, à l'encens, aux grands calices d'or »", analyse: "L'énumération insiste sur le luxe de l'Église. Ce Dieu n'aime que la richesse, en contraste total avec le « tas fumant » des soldats." },
          { cite: "« Qui dans le bercement des hosannah s'endort »", analyse: "Les chants de louange le bercent comme un enfant. Dieu dort pendant que les hommes meurent : l'image est une satire violente de son indifférence." },
          { cite: "« Et se réveille, quand des mères, ramassées / Dans l'angoisse »", analyse: "Le rejet de « Et se réveille » en début de tercet crée une attente. Les mères des soldats sont décrites avec pitié : « ramassées », repliées sur leur douleur, pauvres (« vieux bonnet noir », couleur du deuil)." },
          { cite: "« Lui donnent un gros sou lié dans leur mouchoir ! »", analyse: "La chute révèle ce qui réveille Dieu : l'argent. Le « gros sou » des pauvres s'oppose aux « calices d'or ». Le mouchoir sert à la fois à nouer la pièce et à essuyer les larmes. L'exclamation finale exprime l'indignation du poète." },
        ],
      },
    ],
    conclusion: [
      "Dans ce sonnet d'une seule phrase, Rimbaud relie deux scandales : la guerre qui broie les hommes et une religion qui s'en désintéresse et profite de la douleur des pauvres. Le titre prend alors tout son sens : le « Mal », c'est à la fois le massacre et l'institution qui devrait le combattre.",
      "Le poème montre la révolte d'un adolescent contre toutes les autorités, politiques et religieuses, ce qui en fait un bon exemple du parcours « Émancipations créatrices ». On peut le rapprocher du « Dormeur du val », qui dénonce la même guerre mais de façon implicite.",
    ],
    grammaire: {
      question: "Analysez les propositions subordonnées dans le premier quatrain.",
      reponse: "Le premier quatrain contient deux propositions subordonnées conjonctives circonstancielles de temps, qui expriment la simultanéité. La première est introduite par la locution conjonctive « Tandis que » (« Tandis que les crachats rouges de la mitraille sifflent… »). La seconde est introduite par « Qu' », qui reprend « Tandis que » pour éviter de le répéter (« Qu'… croulent les bataillons »). Elles dépendent de la proposition principale « Il est un Dieu », au vers 9. On trouve aussi une subordonnée relative, « qui les raille », dont l'antécédent est « Roi ».",
    },
    faq: [
      { q: "Pourquoi le poème s'appelle-t-il « Le Mal » ?", a: "Le titre désigne à la fois la guerre, qui détruit les hommes, et l'indifférence de l'Église, que Rimbaud accuse de s'enrichir sur la souffrance." },
      { q: "Quelle est la particularité de la construction ?", a: "Le sonnet est une seule phrase. Les quatrains sont des subordonnées de temps et la proposition principale n'arrive qu'au vers 9." },
      { q: "À quel roi Rimbaud fait-il allusion ?", a: "Aux souverains qui dirigent la guerre de 1870, le roi de Prusse Guillaume Iᵉʳ et, plus largement, Napoléon III. Le mot vise tous les puissants." },
    ],
    published: D,
    updated: D,
  },
  {
    slug: "venus-anadyomene-rimbaud",
    title: "Vénus Anadyomène de Rimbaud : analyse linéaire complète (bac 2027)",
    description: "Analyse linéaire de « Vénus Anadyomène » de Rimbaud (Cahier de Douai) pour l'oral du bac de français : texte, problématique, mouvements, procédés, conclusion et grammaire.",
    h1: "Vénus Anadyomène de Rimbaud : analyse linéaire complète",
    auteur: "Arthur Rimbaud",
    oeuvre: "Cahier de Douai",
    oeuvreGuide: DOUAI,
    reference: "« Vénus Anadyomène », Cahier de Douai, juillet 1870",
    vers: true,
    texte: `Comme d'un cercueil vert en fer blanc, une tête
De femme à cheveux bruns fortement pommadés
D'une vieille baignoire émerge, lente et bête,
Avec des déficits assez mal ravaudés ;

Puis le col gras et gris, les larges omoplates
Qui saillent ; le dos court qui rentre et qui ressort ;
Puis les rondeurs des reins semblent prendre l'essor ;
La graisse sous la peau paraît en feuilles plates ;

L'échine est un peu rouge, et le tout sent un goût
Horrible étrangement ; on remarque surtout
Des singularités qu'il faut voir à la loupe…

Les reins portent deux mots gravés : Clara Venus ;
– Et tout ce corps remue et tend sa large croupe
Belle hideusement d'un ulcère à l'anus.`,
    intro: [
      "« Anadyomène » signifie en grec « qui sort de l'eau ». La naissance de Vénus, déesse de la beauté, surgissant des flots, est l'un des sujets les plus célèbres de la peinture et de la poésie. Dans ce sonnet de juillet 1870, Rimbaud reprend ce sujet pour le renverser.",
      "À la place de la déesse, il décrit une femme laide et malade qui sort d'une vieille baignoire. Le poème est une parodie provocatrice, qui s'attaque à l'idéal classique de la beauté.",
    ],
    problematique: "Comment Rimbaud détourne-t-il le mythe de Vénus pour proposer une nouvelle conception de la poésie ?",
    mouvements: [
      {
        titre: "Premier mouvement : une apparition dégradée",
        lignes: "vers 1 à 4",
        points: [
          { cite: "« Comme d'un cercueil vert en fer blanc »", analyse: "Le poème commence par une comparaison macabre : la baignoire est un « cercueil ». Là où le mythe montre une naissance, Rimbaud place une image de mort. Le « fer blanc » est un matériau pauvre, à l'opposé de la coquille et de l'écume du mythe." },
          { cite: "« une tête / De femme à cheveux bruns fortement pommadés »", analyse: "L'enjambement isole « une tête », comme détachée du corps. L'article indéfini rend la femme anonyme. Les cheveux « bruns » et « pommadés » s'opposent à la chevelure blonde et libre des Vénus des peintres." },
          { cite: "« D'une vieille baignoire émerge, lente et bête »", analyse: "Le verbe « émerge » reprend le sens d'« anadyomène », mais le décor est trivial. Les adjectifs « lente et bête » animalisent la femme et lui retirent toute grâce." },
          { cite: "« Avec des déficits assez mal ravaudés »", analyse: "Le vocabulaire de la couture (« ravaudés », c'est-à-dire raccommodés) fait du corps un vieux tissu abîmé. Le terme « déficits » désigne les défauts physiques avec une ironie froide." },
        ],
      },
      {
        titre: "Deuxième mouvement : un blason à l'envers",
        lignes: "vers 5 à 11",
        points: [
          { cite: "« Puis le col gras et gris, les larges omoplates »", analyse: "Les connecteurs « Puis… Puis… » organisent la description de haut en bas, à mesure que le corps sort de l'eau. Rimbaud parodie le blason, poème qui fait l'éloge du corps féminin partie par partie. L'allitération en [gr] (« gras et gris ») est volontairement dure." },
          { cite: "« le dos court qui rentre et qui ressort »", analyse: "Le corps est déformé, sans harmonie. Les termes anatomiques (« omoplates », « échine ») remplacent le vocabulaire poétique habituel : le regard est celui d'un médecin, pas d'un amoureux." },
          { cite: "« les rondeurs des reins semblent prendre l'essor »", analyse: "L'expression noble « prendre l'essor » (s'envoler) est appliquée ironiquement à un corps lourd. Le décalage entre le ton élevé et le sujet crée un effet burlesque." },
          { cite: "« le tout sent un goût / Horrible étrangement »", analyse: "Le corps est réduit à « le tout ». Rimbaud ajoute l'odorat à la vue. L'enjambement met en valeur « Horrible », et l'alliance avec « étrangement » montre une forme de fascination." },
          { cite: "« Des singularités qu'il faut voir à la loupe… »", analyse: "Le pronom « on » et la « loupe » invitent le lecteur à regarder de près, comme un savant. Les points de suspension créent une attente avant le dernier tercet." },
        ],
      },
      {
        titre: "Troisième mouvement : la chute provocatrice",
        lignes: "vers 12 à 14",
        points: [
          { cite: "« Les reins portent deux mots gravés : Clara Venus »", analyse: "Le nom de la déesse apparaît enfin, mais sous la forme d'un tatouage : « Clara Venus », l'illustre Vénus. Le latin noble est gravé sur un corps vulgaire, sans doute celui d'une prostituée. L'ironie est à son comble." },
          { cite: "« Et tout ce corps remue et tend sa large croupe »", analyse: "Le mot « croupe » s'emploie pour un animal. La pose de la déesse devient un geste grossier." },
          { cite: "« Belle hideusement d'un ulcère à l'anus. »", analyse: "L'oxymore « Belle hideusement » résume le projet du poème : trouver une forme de beauté dans la laideur. La rime entre « Venus » et « anus » est la provocation finale : le mot le plus noble rime avec le plus trivial. Le sonnet, forme de l'idéal, se termine sur la maladie." },
        ],
      },
    ],
    conclusion: [
      "Rimbaud prend le sujet le plus noble de la tradition et le retourne point par point : la mer devient une baignoire, la déesse une femme laide et malade, l'éloge un constat clinique. Ce n'est pas la femme qu'il attaque, mais le cliché poétique de la beauté idéale.",
      "Le poème affirme que la poésie peut tout dire, y compris le laid, comme l'avait fait Baudelaire avec « Une charogne ». Cette liberté fait de « Vénus Anadyomène » un exemple très clair du parcours « Émancipations créatrices » : Rimbaud se libère des modèles en les parodiant.",
    ],
    grammaire: {
      question: "Analysez la proposition subordonnée dans « Des singularités qu'il faut voir à la loupe ».",
      reponse: "« qu'il faut voir à la loupe » est une proposition subordonnée relative. Elle est introduite par le pronom relatif « qu' » (que élidé), dont l'antécédent est le nom « singularités ». Le pronom relatif est complément d'objet direct du verbe à l'infinitif « voir ». La relative a une fonction d'épithète de l'antécédent. « Il faut » est une tournure impersonnelle : « il » ne désigne personne.",
    },
    faq: [
      { q: "Que signifie « Anadyomène » ?", a: "C'est un mot grec qui veut dire « sortie de l'eau ». Il désigne Vénus au moment de sa naissance, surgissant de la mer." },
      { q: "Pourquoi Rimbaud décrit-il un corps laid ?", a: "Pour parodier la tradition qui idéalise le corps féminin, et pour montrer que la poésie peut s'emparer de tous les sujets, même le laid." },
      { q: "Qu'est-ce qu'un blason ?", a: "Un poème du XVIe siècle qui fait l'éloge d'une partie du corps féminin. Rimbaud en écrit ici une version inversée, appelée contre-blason." },
    ],
    published: D,
    updated: D,
  },
  {
    slug: "on-ne-badine-pas-avec-l-amour-acte-2-scene-5-tirade-perdican",
    title: "On ne badine pas avec l'amour, II, 5 : analyse linéaire de la tirade de Perdican",
    description: "Analyse linéaire de la tirade de Perdican (« Tous les hommes sont menteurs… »), On ne badine pas avec l'amour, acte II scène 5, pour l'oral du bac de français 2027.",
    h1: "On ne badine pas avec l'amour, acte II, scène 5 : analyse linéaire de la tirade de Perdican",
    auteur: "Alfred de Musset",
    oeuvre: "On ne badine pas avec l'amour",
    oeuvreGuide: "on-ne-badine-pas-avec-l-amour-musset-bac-francais",
    reference: "On ne badine pas avec l'amour, acte II, scène 5, 1834",
    vers: false,
    texte: `PERDICAN. – Adieu, Camille, retourne à ton couvent, et lorsqu'on te fera de ces récits hideux qui t'ont empoisonnée, réponds ce que je vais te dire : Tous les hommes sont menteurs, inconstants, faux, bavards, hypocrites, orgueilleux et lâches, méprisables et sensuels ; toutes les femmes sont perfides, artificieuses, vaniteuses, curieuses et dépravées ; le monde n'est qu'un égout sans fond où les phoques les plus informes rampent et se tordent sur des montagnes de fange ; mais il y a au monde une chose sainte et sublime, c'est l'union de deux de ces êtres si imparfaits et si affreux. On est souvent trompé en amour, souvent blessé et souvent malheureux ; mais on aime, et quand on est sur le bord de sa tombe, on se retourne pour regarder en arrière, et on se dit : J'ai souffert souvent, je me suis trompé quelquefois, mais j'ai aimé. C'est moi qui ai vécu, et non pas un être factice créé par mon orgueil et mon ennui.`,
    intro: [
      "On ne badine pas avec l'amour est un drame romantique d'Alfred de Musset, publié en 1834. À la fin de l'acte II, Perdican et sa cousine Camille s'affrontent près d'une fontaine. Camille, élevée au couvent, a entendu les religieuses raconter leurs déceptions amoureuses : elle refuse l'amour par peur de souffrir.",
      "Perdican lui répond par cette tirade célèbre, qui clôt la scène. Il y reconnaît toute la misère des hommes et des femmes, mais affirme que l'amour reste la seule chose qui donne un sens à la vie.",
    ],
    problematique: "Comment Perdican transforme-t-il un adieu plein de colère en un éloge passionné de l'amour ?",
    mouvements: [
      {
        titre: "Premier mouvement : un adieu en forme de leçon",
        lignes: "de « Adieu, Camille » à « ce que je vais te dire »",
        points: [
          { cite: "« Adieu, Camille, retourne à ton couvent »", analyse: "La tirade s'ouvre sur une rupture. L'impératif « retourne » et le possessif « ton couvent » ont une valeur de reproche : Perdican renvoie Camille au lieu qui, selon lui, l'a déformée." },
          { cite: "« ces récits hideux qui t'ont empoisonnée »", analyse: "La métaphore du poison accuse les religieuses d'avoir corrompu Camille. L'adjectif « hideux » est très fort. Le démonstratif « ces » marque le mépris." },
          { cite: "« réponds ce que je vais te dire »", analyse: "Second impératif : Perdican se place en maître et dicte à Camille une réponse. Les deux points annoncent un discours construit, presque une maxime à retenir." },
        ],
      },
      {
        titre: "Deuxième mouvement : un tableau très noir de l'humanité",
        lignes: "de « Tous les hommes » à « montagnes de fange »",
        points: [
          { cite: "« Tous les hommes sont menteurs, inconstants, faux, bavards, hypocrites, orgueilleux et lâches, méprisables et sensuels »", analyse: "Perdican commence par donner raison aux religieuses : c'est une concession. L'accumulation de neuf adjectifs péjoratifs, au présent de vérité générale, a la force d'un réquisitoire. Le déterminant « Tous » généralise sans exception." },
          { cite: "« toutes les femmes sont perfides, artificieuses, vaniteuses, curieuses et dépravées »", analyse: "Le parallélisme de construction (« Tous les hommes… toutes les femmes… ») met les deux sexes à égalité dans le vice. Perdican ne défend pas les hommes : il refuse seulement que les femmes soient présentées comme de pures victimes." },
          { cite: "« le monde n'est qu'un égout sans fond »", analyse: "La négation restrictive « n'est qu' » réduit le monde à une image répugnante. La métaphore de l'« égout » et l'hyperbole « sans fond » poussent le pessimisme à son comble." },
          { cite: "« où les phoques les plus informes rampent et se tordent sur des montagnes de fange »", analyse: "Les humains sont animalisés en créatures difformes. Les verbes « rampent » et « se tordent » expriment la bassesse et la souffrance. Cette noirceur extrême prépare, par contraste, le retournement qui suit." },
        ],
      },
      {
        titre: "Troisième mouvement : l'amour, seule chose sublime",
        lignes: "de « mais il y a au monde » à « mais on aime »",
        points: [
          { cite: "« mais il y a au monde une chose sainte et sublime »", analyse: "La conjonction « mais » fait basculer toute la tirade. Le vocabulaire religieux (« sainte ») est retiré au couvent et donné à l'amour : c'est une réponse directe à Camille. L'opposition avec l'« égout » est totale." },
          { cite: "« c'est l'union de deux de ces êtres si imparfaits et si affreux »", analyse: "Le paradoxe est au cœur de la pensée romantique : la grandeur naît de l'union de deux êtres misérables. Les intensifs « si… si… » rappellent leur imperfection pour mieux faire ressortir le miracle de l'amour." },
          { cite: "« On est souvent trompé en amour, souvent blessé et souvent malheureux »", analyse: "Nouvelle concession. La répétition de « souvent » et le rythme ternaire reconnaissent la souffrance amoureuse, celle-là même que craint Camille. Le pronom « on » donne à la phrase une valeur universelle." },
          { cite: "« mais on aime »", analyse: "Second « mais ». La proposition est très brève, après une longue phrase : trois mots suffisent à balayer toutes les objections. Aimer devient une valeur en soi, quel qu'en soit le prix." },
        ],
      },
      {
        titre: "Quatrième mouvement : le bilan d'une vie",
        lignes: "de « et quand on est sur le bord de sa tombe » à la fin",
        points: [
          { cite: "« quand on est sur le bord de sa tombe, on se retourne pour regarder en arrière »", analyse: "Perdican se projette au moment de la mort, celui du bilan. L'image du regard en arrière invite Camille à juger sa vie depuis sa fin : que regrettera-t-elle ?" },
          { cite: "« J'ai souffert souvent, je me suis trompé quelquefois, mais j'ai aimé. »", analyse: "Passage au discours direct et à la première personne : la leçon générale devient une confession. Le rythme ternaire se termine sur « mais j'ai aimé », troisième « mais » du texte. Le passé composé fait le bilan d'une vie accomplie." },
          { cite: "« C'est moi qui ai vécu »", analyse: "La tournure emphatique « C'est moi qui » affirme que vivre vraiment, c'est aimer. Celui qui a pris le risque de souffrir a réellement existé." },
          { cite: "« et non pas un être factice créé par mon orgueil et mon ennui »", analyse: "La dernière phrase vise Camille : en refusant l'amour, elle risque de n'être qu'un « être factice », un masque. Le mot « orgueil » nomme le vrai obstacle entre les deux personnages, et annonce le drame de l'acte III." },
        ],
      },
    ],
    conclusion: [
      "La tirade suit un mouvement d'opposition : un adieu autoritaire, un tableau très sombre de l'humanité, puis un renversement qui place l'amour au-dessus de tout. Perdican accepte tous les arguments de Camille pour mieux les dépasser : oui, on souffre, mais ne pas aimer, c'est ne pas vivre.",
      "Ce texte exprime la conception romantique de l'amour, inspirée d'une lettre de George Sand à Musset. Il éclaire aussi le parcours « Les jeux du cœur et de la parole » : Perdican parle admirablement de l'amour, mais son orgueil et celui de Camille les pousseront, à l'acte III, à jouer avec les sentiments de Rosette, jusqu'à la tragédie.",
    ],
    grammaire: {
      question: "Analysez la négation dans « le monde n'est qu'un égout sans fond ».",
      reponse: "Il s'agit d'une négation restrictive (ou exceptive), formée de l'adverbe « ne » et de « que ». Elle n'a pas de valeur réellement négative : elle signifie « seulement » ou « uniquement » (« le monde est seulement un égout sans fond »). Elle exclut tout ce qui n'est pas l'attribut « un égout sans fond ». Cette restriction renforce le pessimisme du tableau avant le retournement introduit par « mais ».",
    },
    faq: [
      { q: "Où se situe cette tirade dans la pièce ?", a: "À la fin de l'acte II, scène 5. C'est la dernière réplique de la scène et de l'acte, après la longue discussion entre Camille et Perdican près de la fontaine." },
      { q: "D'où vient la phrase « J'ai souffert souvent, je me suis trompé quelquefois, mais j'ai aimé » ?", a: "Musset s'inspire presque mot pour mot d'une lettre que George Sand lui a écrite en 1834, après leur séjour à Venise." },
      { q: "Est-ce un texte en vers ?", a: "Non, la pièce est en prose. Mais la tirade est très rythmée : accumulations, parallélismes, rythmes ternaires et répétition de « mais »." },
    ],
    published: D,
    updated: D,
  },
];

export const getAnalyse = (slug: string) => ANALYSES.find((a) => a.slug === slug);
