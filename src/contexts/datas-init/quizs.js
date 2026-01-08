/**************************************************** EXCEL ****************************************************/
/****************************** CHAPTER 3 ******************************/
export const EXCEL_QUESTIONS_CHAPTER_3 = [
    "La fonction RECHERCHEV permet :",
    "Quelle syntaxe est la plus proche d’une RECHERCHEV classique ?",
    "La fonction GAUCHE(texte;2) renvoie :",
    "Quelle fonction renvoie la date d’aujourd’hui ?",
    "Quel est l’intérêt de nommer une plage (Nom de cellule) ?",
    "Un tableau de bord simple dans Excel contient souvent :",
    "Quelle fonction permet de calculer le nombre de jours entre deux dates ?",
    "La fonction CONCAT ou CONCATENER sert à :",
];
export const EXCEL_PROPOSALS_CHAPTER_3 = [
    [
        { uid_intern: 1, value: "De calculer une moyenne" },
        { uid_intern: 2, value: "De rechercher une valeur dans la première colonne d’un tableau" },
        { uid_intern: 3, value: "De trier un tableau" },
        { uid_intern: 4, value: "De créer un graphique" },
    ],
    [
        { uid_intern: 1, value: "=RECHERCHEV(valeur;table;no_index_col;[valeur_proche])" },
        { uid_intern: 2, value: "=RECHERCHEV(table;valeur;no_index_col;[valeur_proche])" },
        { uid_intern: 3, value: "=RECHERCHEV(no_index_col;valeur;table)" },
        { uid_intern: 4, value: "=RECHERCHEV(valeur;no_index_col;table)" },
    ],
    [
        { uid_intern: 1, value: "Les 2 dernières lettres du texte" },
        { uid_intern: 2, value: "Les 2 premières lettres du texte" },
        { uid_intern: 3, value: "2 mots du texte" },
        { uid_intern: 4, value: "La longueur du texte" },
    ],
    [
        { uid_intern: 1, value: "DATE()" },
        { uid_intern: 2, value: "MAINTENANT()" },
        { uid_intern: 3, value: "AUJOURDHUI()" },
        { uid_intern: 4, value: "JOUR()" },
    ],
    [
        { uid_intern: 1, value: "Changer la couleur des cellules" },
        { uid_intern: 2, value: "Rendre les formules plus lisibles et réutilisables" },
        { uid_intern: 3, value: "Protéger le classeur" },
        { uid_intern: 4, value: "Créer un graphique automatiquement" },
    ],
    [
        { uid_intern: 1, value: "Uniquement des textes" },
        { uid_intern: 2, value: "Des macros uniquement" },
        { uid_intern: 3, value: "Des indicateurs, des graphiques et des chiffres clés" },
        { uid_intern: 4, value: "Uniquement des tableaux croisés dynamiques" },
    ],
    [
        { uid_intern: 1, value: "JOUR()" },
        { uid_intern: 2, value: "DATEDIF()" },
        { uid_intern: 3, value: "NB.JOURS()" },
        { uid_intern: 4, value: "MOIS()" },
    ],
    [
        { uid_intern: 1, value: "Additionner des chiffres" },
        { uid_intern: 2, value: "Fusionner plusieurs textes ou cellules en un seul texte" },
        { uid_intern: 3, value: "Supprimer des espaces" },
        { uid_intern: 4, value: "Compter des cellules" },
    ],
]
export const EXCEL_ANSWERS_CHAPTER_3 = [
    { uid_intern: 2, value: "De rechercher une valeur dans la première colonne d’un tableau" },
    { uid_intern: 1, value: "=RECHERCHEV(valeur;table;no_index_col;[valeur_proche])" },
    { uid_intern: 2, value: "Les 2 premières lettres du texte" },
    { uid_intern: 3, value: "AUJOURDHUI()" },
    { uid_intern: 2, value: "Rendre les formules plus lisibles et réutilisables" },
    { uid_intern: 3, value: "Des indicateurs, des graphiques et des chiffres clés" },
    { uid_intern: 2, value: "DATEDIF()" },
    { uid_intern: 2, value: "Fusionner plusieurs textes ou cellules en un seul texte" },
];

/****************************** CHAPTER 4 ******************************/
export const EXCEL_QUESTIONS_CHAPTER_4 = [
    "La fonction SOMME.SI.ENS permet de :",
    "Quelle combinaison est souvent utilisée pour des recherches avancées plutôt que RECHERCHEV ?",
    "La fonction UNIQUE(plage) permet de :",
    "Dans un tableau croisé dynamique avancé, un « segment » (slicer) sert à :",
    "Quel type de graphique est typiquement utilisé pour superposer un chiffre d’affaires (colonnes) et une marge (%) ?",
    "La fonction FILTRE(plage; condition) permet de :",
    "ECARTYPE(plage) est une fonction qui sert à :",
    "Power Query est utilisé principalement pour :",
];
export const EXCEL_ANSWERS_CHAPTER_4 = [
    { uid_intern: 3, value: "Faire une somme avec plusieurs critères" },
    { uid_intern: 1, value: "INDEX + EQUIV" },
    { uid_intern: 3, value: "Renvoyer les valeurs distinctes d’une plage" },
    { uid_intern: 2, value: "Filtrer les données du TCD visuellement" },
    { uid_intern: 3, value: "Graphique combiné colonnes + courbe" },
    { uid_intern: 2, value: "Afficher uniquement les lignes respectant une condition" },
    { uid_intern: 2, value: "Mesurer la dispersion des valeurs par rapport à la moyenne" },
    { uid_intern: 2, value: "Nettoyer, transformer et charger des données" },
];
export const EXCEL_PROPOSALS_CHAPTER_4 = [
    [
        { uid_intern: 1, value: "Faire une somme sans critère" },
        { uid_intern: 2, value: "Faire une somme avec un seul critère" },
        { uid_intern: 3, value: "Faire une somme avec plusieurs critères" },
        { uid_intern: 4, value: "Calculer une moyenne" },
    ],
    [
        { uid_intern: 1, value: "INDEX + EQUIV" },
        { uid_intern: 2, value: "MEDIANE + MOYENNE" },
        { uid_intern: 3, value: "NB + NBVAL" },
        { uid_intern: 4, value: "MIN + MAX" },
    ],
    [
        { uid_intern: 1, value: "Supprimer les lignes vides" },
        { uid_intern: 2, value: "Renommer les colonnes" },
        { uid_intern: 3, value: "Renvoyer les valeurs distinctes d’une plage" },
        { uid_intern: 4, value: "Trier les valeurs par ordre croissant" },
    ],
    [
        { uid_intern: 1, value: "Modifier la mise en forme" },
        { uid_intern: 2, value: "Filtrer les données du TCD visuellement" },
        { uid_intern: 3, value: "Créer un nouveau TCD" },
        { uid_intern: 4, value: "Ajouter une nouvelle feuille" },
    ],
    [
        { uid_intern: 1, value: "Graphique en secteurs" },
        { uid_intern: 2, value: "Graphique en aires" },
        { uid_intern: 3, value: "Graphique combiné colonnes + courbe" },
        { uid_intern: 4, value: "Graphique en radar" },
    ],
    [
        { uid_intern: 1, value: "Enlever les doublons" },
        { uid_intern: 2, value: "Afficher uniquement les lignes respectant une condition" },
        { uid_intern: 3, value: "Transformer le format de la date" },
        { uid_intern: 4, value: "Arrondir des nombres" },
    ],
    [
        { uid_intern: 1, value: "Trouver la valeur maximale" },
        { uid_intern: 2, value: "Mesurer la dispersion des valeurs par rapport à la moyenne" },
        { uid_intern: 3, value: "Compter les cellules non vides" },
        { uid_intern: 4, value: "Trier les valeurs par ordre croissant" },
    ],
    [
        { uid_intern: 1, value: "Créer des macros VBA" },
        { uid_intern: 2, value: "Nettoyer, transformer et charger des données" },
        { uid_intern: 3, value: "Créer des graphiques 3D" },
        { uid_intern: 4, value: "Gérer les droits d’accès au fichier" },
    ],


]

/****************************** CHAPTER 5 ******************************/
export const EXCEL_QUESTIONS_CHAPTER_5 = [
    "L’enregistreur de macros permet principalement de :",
    "Le langage utilisé derrière les macros Excel est :",
    "Power Query sert principalement à :",
    "Power Pivot et le « modèle de données » permettent de :",
    "Quel outil Excel permet de tester différents scénarios (par ex : différents niveaux de prix) ?",
    "Quel outil permet de trouver automatiquement la valeur nécessaire pour atteindre un résultat donné ?",
    "Une bonne pratique pour un dashboard Excel expert est :",
    "Une macro enregistrée avec l’enregistreur peut ensuite être :",
];
export const EXCEL_PROPOSALS_CHAPTER_5 = [
    [
        { uid_intern: 1, value: "Créer des graphiques 3D" },
        { uid_intern: 2, value: "Enregistrer une suite d’actions pour les rejouer automatiquement" },
        { uid_intern: 3, value: "Créer un tableau croisé dynamique" },
        { uid_intern: 4, value: "Traduire automatiquement des données" },
    ],
    [
        { uid_intern: 1, value: "JavaScript" },
        { uid_intern: 2, value: "Python" },
        { uid_intern: 3, value: "VBA (Visual Basic for Applications)" },
        { uid_intern: 4, value: "C#" },
    ],
    [
        { uid_intern: 1, value: "Créer des macros" },
        { uid_intern: 2, value: "Nettoyer, transformer et charger des données depuis différentes sources" },
        { uid_intern: 3, value: "Faire des graphiques avancés" },
        { uid_intern: 4, value: "Protéger des feuilles" },
    ],
    [
        { uid_intern: 1, value: "Modifier la mise en page" },
        { uid_intern: 2, value: "Créer un modèle relationnel et des mesures DAX" },
        { uid_intern: 3, value: "Changer le thème d’Excel" },
        { uid_intern: 4, value: "Envoyer des emails" },
    ],
    [
        { uid_intern: 1, value: "Gestionnaire de scénarios" },
        { uid_intern: 2, value: "Graphique combiné" },
        { uid_intern: 3, value: "Mise en forme conditionnelle" },
        { uid_intern: 4, value: "Validation des données" },
    ],
    [
        { uid_intern: 1, value: "Valeur cible (Goal Seek)" },
        { uid_intern: 2, value: "Tableau croisé dynamique" },
        { uid_intern: 3, value: "Power Query" },
        { uid_intern: 4, value: "Remplissage instantané" },
    ],
    [
        { uid_intern: 1, value: "Multiplier les couleurs et effets graphiques" },
        { uid_intern: 2, value: "Rester minimaliste et orienté sur les indicateurs clés" },
        { uid_intern: 3, value: "Éviter les segments et filtres" },
        { uid_intern: 4, value: "Mélanger les données brutes avec les visuels" },
    ],
    [
        { uid_intern: 1, value: "Supprimée uniquement" },
        { uid_intern: 2, value: "Modifiée manuellement dans l’éditeur VBA" },
        { uid_intern: 3, value: "Utilisée uniquement une fois" },
        { uid_intern: 4, value: "Exportée uniquement en PDF" },
    ],
]
export const EXCEL_ANSWERS_CHAPTER_5 = [
    { uid_intern: 2, value: "Enregistrer une suite d’actions pour les rejouer automatiquement" },
    { uid_intern: 3, value: "VBA (Visual Basic for Applications)" },
    { uid_intern: 2, value: "Nettoyer, transformer et charger des données depuis différentes sources" },
    { uid_intern: 2, value: "Créer un modèle relationnel et des mesures DAX" },
    { uid_intern: 1, value: "Gestionnaire de scénarios" },
    { uid_intern: 1, value: "Valeur cible (Goal Seek)" },
    { uid_intern: 2, value: "Rester minimaliste et orienté sur les indicateurs clés" },
    { uid_intern: 2, value: "Modifiée manuellement dans l’éditeur VBA" },
];
/*
export const QUESTIONS_CHAPTER_ = [
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
];
export const PROPOSALS_CHAPTER_ = [
    [
        { uid_intern: 1, value: "" },
        { uid_intern: 2, value: "" },
        { uid_intern: 3, value: "" },
        { uid_intern: 4, value: "" },
    ],
]
export const ANSWERS_CHAPTER_ = [
    { uid_intern: 0, value: "" },
    { uid_intern: 0, value: "" },
    { uid_intern: 0, value: "" },
    { uid_intern: 0, value: "" },
    { uid_intern: 0, value: "" },
    { uid_intern: 0, value: "" },
    { uid_intern: 0, value: "" },
    { uid_intern: 0, value: "" },
];
 */