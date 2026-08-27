export type Theme =
  | 'Politique'
  | 'Société'
  | 'International'
  | 'Économie'
  | 'Culture'
  | 'Sport'
  | 'Environnement';

export interface VeilleItem {
  id: number;
  title: string;
  excerpt: string;
  content: string[];
  source: string;
  sourceUrl: string;
  sourceReliable: boolean;
  theme: Theme;
  time: string;
  image: string;
  tags: string[];
}

export const THEME_OPTIONS: Theme[] = [
  'Politique',
  'Société',
  'International',
  'Économie',
  'Culture',
  'Sport',
  'Environnement',
];

export const THEME_BADGE_CLASS: Record<Theme, string> = {
  Politique: 'theme-politique',
  Société: 'theme-societe',
  International: 'theme-international',
  Économie: 'theme-economie',
  Culture: 'theme-culture',
  Sport: 'theme-sport',
  Environnement: 'theme-environnement',
};

export const STATIC_VEILLE: VeilleItem[] = [
  {
    id: 1,
    title: 'Le gouvernement présente son plan pour les mobilités régionales',
    excerpt:
      "Un budget renforcé pour les lignes secondaires est annoncé, avec un calendrier de travaux échelonné jusqu'en 2028.",
    content: [
      "Le ministère des Transports a dévoilé ce matin un plan pluriannuel destiné à renforcer les lignes secondaires, jugées vieillissantes par plusieurs rapports parlementaires. L'enveloppe globale, présentée comme la plus importante depuis dix ans, doit être répartie entre la rénovation des voies existantes et la remise en service de tronçons fermés depuis les années 1990.",
      "Plusieurs présidents de région ont salué l'annonce tout en réclamant des garanties sur le calendrier, certains chantiers ayant déjà pris du retard par le passé. Le gouvernement promet un premier bilan d'étape courant 2027.",
      "Les associations d'usagers restent prudentes, rappelant que des annonces similaires avaient déjà été faites sans suite concrète il y a cinq ans.",
    ],
    source: 'AFP',
    sourceUrl: 'https://www.afp.com',
    sourceReliable: true,
    theme: 'Politique',
    time: 'il y a 12 min',
    image: 'https://picsum.photos/seed/veille1/960/540',
    tags: ['transports', 'régions', 'budget'],
  },
  {
    id: 2,
    title: 'Occitanie : les agriculteurs alertent sur la sécheresse persistante',
    excerpt:
      "Les nappes phréatiques sont à un niveau historiquement bas pour la saison, selon les relevés locaux.",
    content: [
      "Les relevés publiés par les services régionaux de l'eau confirment une tendance observée depuis plusieurs mois : les nappes phréatiques n'ont pas retrouvé un niveau suffisant malgré les pluies de printemps.",
      "Les syndicats agricoles demandent des mesures d'urgence pour les cultures les plus exposées, tandis que les autorités locales étudient de nouvelles restrictions d'usage de l'eau pour l'été.",
    ],
    source: 'France Info',
    sourceUrl: 'https://www.francetvinfo.fr',
    sourceReliable: true,
    theme: 'Environnement',
    time: 'il y a 34 min',
    image: 'https://picsum.photos/seed/veille2/960/540',
    tags: ['sécheresse', 'agriculture', 'Occitanie'],
  },
  {
    id: 3,
    title: "Sommet européen : les discussions sur l'énergie se prolongent",
    excerpt:
      "Les chefs d'État peinent à s'accorder sur un mécanisme commun de régulation des prix.",
    content: [
      "Réunis depuis deux jours, les chefs d'État et de gouvernement n'ont pas trouvé de terrain d'entente sur un mécanisme commun de plafonnement des prix de l'énergie.",
      "Plusieurs délégations évoquent un compromis possible dans les prochaines semaines, sans exclure une nouvelle session extraordinaire si les négociations restent bloquées.",
    ],
    source: 'Reuters',
    sourceUrl: 'https://www.reuters.com',
    sourceReliable: true,
    theme: 'International',
    time: 'il y a 48 min',
    image: 'https://picsum.photos/seed/veille3/960/540',
    tags: ['Europe', 'énergie', 'diplomatie'],
  },
  {
    id: 4,
    title: 'Toulouse : ouverture du nouveau festival des arts numériques',
    excerpt:
      "Une trentaine d'artistes régionaux exposent leurs installations interactives jusqu'à la fin du mois.",
    content: [
      "La première édition du festival réunit une trentaine d'artistes régionaux autour d'installations interactives mêlant lumière, son et intelligence artificielle générative.",
      "Les organisateurs espèrent pérenniser l'événement et misent sur une fréquentation en hausse par rapport aux prévisions initiales.",
    ],
    source: 'Ouest-France',
    sourceUrl: 'https://www.ouest-france.fr',
    sourceReliable: true,
    theme: 'Culture',
    time: 'il y a 1 h',
    image: 'https://picsum.photos/seed/veille4/960/540',
    tags: ['festival', 'art numérique', 'Toulouse'],
  },
  {
    id: 5,
    title: 'Inflation : léger ralentissement confirmé sur le trimestre',
    excerpt:
      "L'institut national de la statistique révise ses prévisions à la baisse pour la fin d'année.",
    content: [
      "Les derniers chiffres publiés confirment un ralentissement de l'inflation sur le trimestre, porté principalement par la baisse des prix de l'énergie.",
      "Les économistes restent partagés sur la durabilité de cette tendance, certains évoquant un possible rebond à l'automne.",
    ],
    source: 'Les Échos',
    sourceUrl: 'https://www.lesechos.fr',
    sourceReliable: true,
    theme: 'Économie',
    time: 'il y a 1 h 20',
    image: 'https://picsum.photos/seed/veille5/960/540',
    tags: ['inflation', 'économie', 'statistiques'],
  },
  {
    id: 6,
    title: 'Rugby : le XV régional valide sa qualification',
    excerpt:
      "Une victoire nette qui installe l'équipe en tête de son groupe avant les phases finales.",
    content: [
      "Portée par une deuxième mi-temps solide, l'équipe régionale s'impose largement et prend la tête de son groupe avant d'aborder les phases finales.",
      "Le staff technique se félicite d'une dynamique collective retrouvée après un début de saison difficile.",
    ],
    source: "L'Équipe",
    sourceUrl: 'https://www.lequipe.fr',
    sourceReliable: true,
    theme: 'Sport',
    time: 'il y a 2 h',
    image: 'https://picsum.photos/seed/veille6/960/540',
    tags: ['rugby', 'sport régional'],
  },
  {
    id: 7,
    title: 'Grève des transports : un préavis déposé pour la semaine prochaine',
    excerpt:
      'Plusieurs syndicats appellent à une mobilisation autour des conditions salariales.',
    content: [
      "Plusieurs syndicats représentatifs ont déposé un préavis de grève pour la semaine prochaine, dénonçant l'absence d'avancées sur les négociations salariales.",
      "La direction indique avoir proposé une nouvelle réunion de dialogue social avant le début du mouvement, sans certitude que celui-ci soit annulé.",
    ],
    source: 'BFMTV',
    sourceUrl: 'https://www.bfmtv.com',
    sourceReliable: false,
    theme: 'Société',
    time: 'il y a 2 h 45',
    image: 'https://picsum.photos/seed/veille7/960/540',
    tags: ['grève', 'transports', 'syndicats'],
  },
  {
    id: 8,
    title: 'Élection municipale partielle : les résultats attendus dimanche',
    excerpt:
      'Trois listes sont en lice après le report du scrutin initial pour vice de procédure.',
    content: [
      "Trois listes se disputent le scrutin partiel, initialement reporté après l'annulation du premier vote pour vice de procédure.",
      "Les résultats sont attendus dimanche soir, avec une participation jugée incertaine par les observateurs locaux.",
    ],
    source: 'AFP',
    sourceUrl: 'https://www.afp.com',
    sourceReliable: true,
    theme: 'Politique',
    time: 'il y a 3 h',
    image: 'https://picsum.photos/seed/veille8/960/540',
    tags: ['élections', 'municipales'],
  },
  {
    id: 9,
    title: 'Un nouveau parc naturel régional en projet dans le Sud-Ouest',
    excerpt:
      "L'initiative vise à protéger un corridor écologique menacé par l'urbanisation.",
    content: [
      "Le projet de parc naturel régional vise à protéger un corridor écologique identifié comme menacé par la pression urbaine croissante.",
      "Une consultation publique doit s'ouvrir dans les prochains mois avant une décision définitive des collectivités concernées.",
    ],
    source: 'France Info',
    sourceUrl: 'https://www.francetvinfo.fr',
    sourceReliable: true,
    theme: 'Environnement',
    time: 'il y a 4 h',
    image: 'https://picsum.photos/seed/veille9/960/540',
    tags: ['environnement', 'biodiversité'],
  },
];

export function getVeilleItemById(id: number): VeilleItem | undefined {
  return STATIC_VEILLE.find((item) => item.id === id);
}
