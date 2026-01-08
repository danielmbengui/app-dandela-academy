/**************************************************** EXCEL ****************************************************/
/****************************** CHAPTER 3 ******************************/
export const EXCEL_TITLES_CHAPTER_3 = [
    "Préparation des données & rappel Niveau 2",
    "Fonctions de recherche (RECHERCHEV, RECHERCHEX, index simple)",
    "Plages nommées & lisibilité des formules",
    "Fonctions texte (GAUCHE, DROITE, STXT, CONCAT/CONCATENER, TEXTE)",
    "Fonctions de date (AUJOURDHUI, MAINTENANT, DATEDIF, JOUR/MOIS/ANNEE)",
    "Nettoyage simple des données (espaces, format texte/numérique)",
    "Mini tableau de bord (indicateurs + graphiques)",
    "Mini-projet de synthèse",
];
export const EXCEL_GOALS_CHAPTER_3 = [
    ["On part d’un tableau de données un peu plus riche : ventes par produit, dates, clients, montants, etc. L'objectif est de s'assurer que les bases du Niveau 2 sont solides."],
    ["Les fonctions de recherche permettent de retrouver une information dans un tableau à partir d’une valeur (par exemple, retrouver le prix d’un produit à partir de son nom)."],
    ["Nommer des cellules ou des plages facilite la lecture des formules et évite les erreurs de référence."],
    ["Les fonctions texte permettent de nettoyer ou recomposer des informations (codes, noms, numéros)."],
    ["Les fonctions de date sont très utiles pour suivre des délais, des durées, des échéances."],
    ["Données “sales” = résultats faux. On voit comment corriger quelques problèmes fréquents."],
    ["On assemble tout : indicateurs clés (KPI), graphiques, et présentation propre sur une feuille de synthèse."],
    ["Pour consolider toutes les notions du niveau 3, l'apprenant réalise une petite analyse à partir d’un jeu de données plus riche."],
];
export const EXCEL_KEYS_CHAPTER_3 = [
    [
        "Vérifier que les formules de base (SOMME, MOYENNE, SI, SOMME.SI) sont maîtrisées.",
        "Créer une feuille Données bien structurée (en-têtes propres, pas de lignes vides).",
    ],
    [
        "➡️ (RECHERCHEV)",
        "Syntaxe : =RECHERCHEV(valeur_cherchée;table_matrice;no_index_col;[valeur_proche]).",
        "La valeur cherchée doit se trouver dans la première colonne de la table.",
        "no_index_col = numéro de la colonne à renvoyer dans la table.",
        "➡️ (RECHERCHEX / XLOOKUP si disponible)",
        "Plus flexible que RECHERCHEV (pas obligé que la donnée soit dans la première colonne).",
        "Permet de définir facilement la valeur en cas de non-trouvée.",
    ],
    [
        "Créer un nom via la zone de nom (à gauche de la barre de formule).",
        "Créer un nom via Formules → Gestionnaire de noms.",
        "Utiliser le nom dans une formule (ex: =Montant_HT * Taux_TVA).",
    ],
    [
        "GAUCHE(texte; n) : renvoie les n premiers caractères.",
        "DROITE(texte; n) : renvoie les n derniers caractères.",
        "STXT(texte; début; n) : renvoie n caractères à partir d’une position.",
        "CONCAT ou CONCATENER : fusionne plusieurs morceaux de texte.",
        "TEXTE(valeur; format) : affiche une valeur numérique avec un format texte (ex: « 01/2025 »).",
    ],
    [
        "AUJOURDHUI() : renvoie la date du jour.",
        "MAINTENANT() : renvoie date + heure actuelles.",
        "DATEDIF(date_début; date_fin; unité) : différence entre deux dates (ex: en jours, mois, années).",
        "JOUR(date), MOIS(date), ANNEE(date) : extraire le jour, le mois ou l’année.",
    ],
    [
        "Fonction SUPPRESPACE(texte) pour enlever les espaces superflus.",
        "Fonction CNUM(texte) pour convertir un texte en nombre lorsqu’il est bien formé.",
        "Vérifier s’il y a des espaces cachés dans les cellules qui semblent identiques.",
    ],
    [
        "Total des ventes, moyenne, meilleure vente, etc.",
        "Graphique par produit ou par mois.",
        "Mise en forme claire : titres, couleurs, alignements.",
    ],
    [
        "➡️ À partir d’une base de données de ventes (Produits, Clients, Dates, Montants, Pays, etc.), produire :",
        "Une feuille Données propre (après nettoyage éventuel).",
        "Une feuille Référentiel avec une liste de produits ou clients et des infos associées (prix, catégorie…).",
        "Des RECHERCHEV/RECHERCHEX pour compléter automatiquement des informations dans la feuille Données.",
        "Quelques colonnes calculées avec des fonctions texte ou date (pays, mois, année…).",
        "Une feuille Dashboard avec 3 à 5 indicateurs et 1 à 2 graphiques.",
    ]
];
export const EXCEL_EXERCICES_CHAPTER_3 = [
    [
        "Importer ou saisir un tableau de 30 à 50 lignes (Produits, Clients, Dates, Montants).",
        "Contrôler la cohérence des données (pas de textes mélangés aux chiffres dans la colonne Montants).",
    ],
    [
        "Créer une petite table de référence des Produits avec leur Prix unitaire sur une feuille « Référentiel ».",
        "Dans la feuille Données, utiliser RECHERCHEV ou RECHERCHEX pour ramener le Prix unitaire à partir du nom du produit.",
    ],
    [
        "Nommer une cellule contenant un taux de TVA (ex: Taux_TVA).",
        "Nommer une plage de données (ex: Ventes_2025).",
        "Réécrire une formule en remplaçant les références de cellules par des noms.",
    ],
    [
        "Sur une colonne de codes clients (ex: « CH-001 », « CH-002 »), extraire le pays (2 premières lettres) avec GAUCHE.",
        "Assembler un texte du type « Client X – Ville Y » avec CONCAT.",
    ],
    [
        "À partir d’une date de début de contrat et d’une date de fin, calculer le nombre de jours de contrat avec DATEDIF.",
        "Extraire le mois et l’année des dates de factures pour préparer un regroupement par mois.",
    ],
    [
        "Importer une petite liste avec des noms ou des codes contenant des espaces en trop, puis les nettoyer avec SUPPRESPACE.",
    ],
    [
        "Créer une feuille « Dashboard » avec 3 indicateurs : Total ventes, Moyenne par vente, Nombre de clients.",
        "Ajouter au moins un graphique pertinent (par produit ou par mois).",
    ],
    [
        "➡️ À partir d’une base de données de ventes (Produits, Clients, Dates, Montants, Pays, etc.), produire :",
        "Une feuille Données propre (après nettoyage éventuel).",
        "Une feuille Référentiel avec une liste de produits ou clients et des infos associées (prix, catégorie…).",
        "Des RECHERCHEV/RECHERCHEX pour compléter automatiquement des informations dans la feuille Données.",
        "Quelques colonnes calculées avec des fonctions texte ou date (pays, mois, année…).",
        "Une feuille Dashboard avec 3 à 5 indicateurs et 1 à 2 graphiques.",
    ],
]

/****************************** CHAPTER 4 ******************************/
export const EXCEL_TITLES_CHAPTER_4 = [
    "Préparation des données pour l’analyse avancée",
    "Fonctions conditionnelles avancées (SOMME.SI.ENS, NB.SI.ENS, MOYENNE.SI)",
    "Recherches avancées avec INDEX + EQUIV",
    "Fonctions matricielles modernes (UNIQUE, TRIER, FILTRE, SEQUENCE)",
    "Statistiques avancées simples (ECARTYPE, MEDIANE, QUARTILE)",
    "TCD avancés (segments, regroupements, champs calculés)",
    "Graphiques avancés & combinés",
    "Mini-projet : Dashboard d’analyse avancée",
];
export const EXCEL_GOALS_CHAPTER_4 = [
    ["Avant de lancer des analyses avancées, on vérifie que la base de données est propre, structurée en colonnes, et prête pour les fonctions et TCD."],
    ["Ces fonctions permettent de faire des calculs en tenant compte d’un ou plusieurs critères (par exemple : total des ventes pour un client donné sur une période donnée)."],
    ["INDEX + EQUIV permet des recherches plus flexibles que RECHERCHEV, notamment lorsque la colonne cherchée n’est pas la première du tableau, ou pour gérer des recherches bi-dimensionnelles."],
    ["Ces fonctions (disponibles dans les versions récentes d'Excel) permettent de travailler avec des plages de données dynamiques, qui « se répandent » automatiquement sur plusieurs cellules."],
    ["Ces fonctions permettent d'aller au-delà de la moyenne pour mieux comprendre la distribution des données."],
    ["On passe au niveau supérieur avec les TCD : regroupements par mois/année, segments pour filtrer rapidement, champs calculés pour créer des indicateurs."],
    ["Les graphiques combinés permettent de suivre plusieurs indicateurs sur un même visuel (par exemple : chiffre d’affaires en colonnes et marge en pourcentage en courbe)."],
    ["Ce mini-projet rassemble toutes les notions du niveau 4 dans un tableau de bord avancé."],
];
export const EXCEL_KEYS_CHAPTER_4 = [
    [
        "Une ligne = un enregistrement (ex: une vente, une facture, une commande).",
        "Chaque colonne a un en-tête clair (Date, Client, Produit, Montant, Catégorie, etc.).",
        "Pas de lignes ou colonnes vides au milieu du tableau.",
    ],
    [
        "SOMME.SI(plage_critère; critère; plage_somme).",
        "SOMME.SI.ENS(plage_somme; plage_critère1; critère1; plage_critère2; critère2; ...).",
        "NB.SI / NB.SI.ENS : compter le nombre de lignes qui répondent aux critères.",
        "MOYENNE.SI : moyenne des valeurs qui respectent un critère.",
    ],
    [
        "EQUIV(valeur_cherchée; plage; type) renvoie la position de la valeur.",
        "INDEX(plage; no_ligne; [no_colonne]) renvoie la valeur située à une position donnée.",
        "Combinaison : INDEX(plage_valeurs; EQUIV(valeur; plage_recherche; 0)).",
    ],
    [
        "UNIQUE(plage) : renvoie la liste des valeurs distinctes.",
        "TRIER(plage; [indice_col]; [ordre]; [par_colonne]) : trie dynamiquement un tableau.",
        "FILTRE(plage; condition) : renvoie uniquement les lignes respectant la condition.",
        "SEQUENCE(lignes; [colonnes]; [début]; [pas]) : génère une série de nombres.",
    ],
    [
        "MEDIANE(plage) : valeur médiane (au milieu des données triées).",
        "ECARTYPE(plage) : mesure de dispersion autour de la moyenne.",
        "QUARTILE(plage; quart) : renvoie les quartiles (quart = 1, 2, 3...).",
    ],
    [
        "➡️ Fonctions clés des TCD avancés :",
        "Regrouper les dates par mois / trimestre / année.",
        "Ajouter des segments (slicers) pour filtrer par pays, produit, etc.",
        "Créer un champ calculé dans le TCD (ex: Marge = Montant - Coût).",
    ],
    [
        "Créer un graphique combiné (colonnes + courbe) à partir d’un tableau synthétique.",
        "Utiliser un axe secondaire pour l’indicateur en pourcentage.",
        "Ajouter des étiquettes de données sur les KPI importants.",
    ],
    []
];
export const EXCEL_EXERCICES_CHAPTER_4 = [
    [
        "Sur une base de 200 à 500 lignes (fictive ou réelle), vérifier la cohérence des types de données (pas de texte dans les colonnes de montants, etc.).",
        "Convertir la plage de données en « Tableau » Excel (Insertion → Tableau) pour faciliter les manipulations.",
    ],
    [
        "Total des ventes pour un client donné : SOMME.SI(plage_client; Dupont; plage_montant).",
        "Total des ventes pour un client dans une année donnée : SOMME.SI.ENS(plage_montant; plage_client; Dupont; plage_annee; 2025).",
    ],
    [
        "Créer une feuille « Référentiel_clients » avec ID, Nom, Pays, Segment.",
        "Dans la feuille Données, récupérer automatiquement le Segment à partir de l’ID client en utilisant INDEX + EQUIV.",
    ],
    [
        "Créer une liste dynamique des pays distincts à partir de la colonne Pays avec UNIQUE.",
        "Créer un sous-tableau des ventes du pays « France » avec FILTRE.",
        "Trier les ventes par montant décroissant avec TRIER.",
    ],
    [
        "Calculer moyenne, médiane et écart-type des montants de vente, puis comparer ces indicateurs.",
    ],
    [
        "Construire un TCD qui affiche le total des ventes par mois et par pays, avec un segment pour filtrer par pays.",
        "Ajouter un champ calculé pour la marge.",
    ],
    [],
    [
        "➡️ À partir d’une base de données de ventes réelle ou simulée (plusieurs centaines de lignes), l’apprenant doit :",
        "Nettoyer la base si nécessaire et la structurer en Tableau.",
        "Créer des indicateurs clés avec SOMME.SI.ENS / NB.SI.ENS (par pays, par produit, par client).",
        "Mettre en place au moins une recherche avancée avec INDEX + EQUIV.",
        "Utiliser au moins une fonction matricielle (UNIQUE, TRIER, FILTRE) pour préparer des listes dynamiques.",
        "Construire un TCD avancé + graphique combiné sur une feuille Dashboard.",
    ],
]
/****************************** CHAPTER 5 ******************************/
export const EXCEL_TITLES_CHAPTER_5 = [
    "Introduction & bonnes pratiques d’un fichier expert",
    "Macros & enregistreur (VBA niveau débutant)",
    "Power Query : importer, transformer, fusionner",
    "Power Pivot & modèle de données",
    "Scénarios, Valeur cible & analyse ‘what-if’",
    "Optimisation et sécurisation du classeur",
    "Dashboard expert (KPI, segments, interactions)",
    "Mini-projet : Dashboard final automatisé",
];
export const EXCEL_GOALS_CHAPTER_5 = [
    ["Avant d'utiliser des outils très avancés, il est essentiel d'avoir une structure de fichier propre : séparation des données, des calculs et des visuels."],
    ["Les macros permettent d'automatiser des actions répétitives. L’enregistreur de macros convertit tes actions en code VBA."],
    ["Power Query est l’outil ETL (Extract – Transform – Load) d’Excel. Il permet d’importer des données de multiples sources et de les transformer sans écrire de formule."],
    ["Power Pivot permet de créer un modèle de données relationnel (plusieurs tables reliées) et de définir des mesures avec DAX."],
    ["L’analyse « what-if » permet de répondre à des questions du type : « Que se passe-t-il si je change tel paramètre ? »."],
    ["Un fichier expert doit être performant et sécurisé pour éviter les erreurs de manipulation."],
    ["On assemble toutes les briques pour créer un dashboard expert lisible, interactif et orienté décision."],
    ["Le mini-projet final réunit toutes les briques du niveau 5 pour construire un fichier Excel expert complet."],
];
export const EXCEL_KEYS_CHAPTER_5 = [
    [
        "Feuilles dédiées : Données brutes, Données transformées, Calculs, Dashboard.",
        "Nommage cohérent des plages, tableaux et mesures.",
        "Documenter le fichier (feuille « Info » ou « Lire-moi »).",
    ],
    [
        "Activer l’onglet Développeur si nécessaire.",
        "Enregistrer une macro simple (mise en forme, insertion de date, etc.).",
        "Affecter une macro à un bouton (Forme ou Contrôle).",
        "Ouvrir l’éditeur VBA et lire le code généré.",
    ],
    [
        "Données → Obtenir des données (fichiers CSV, Excel, bases de données, web…).",
        "Nettoyer : supprimer des colonnes, filtrer, remplacer des valeurs, fractionner des colonnes.",
        "Fusionner ou ajouter des requêtes (jointures et concaténation de tables).",
        "Charger les données dans Excel ou dans le modèle de données.",
    ],
    [
        "Tables de faits (ex: Ventes) et tables de dimensions (ex: Produits, Clients, Dates).",
        "Relations entre les tables (1-n, n-1).",
        "Création de mesures simples (ex: TotalVentes = SOMME(Ventes[Montant])).",
    ],
    [
        "Valeur cible (Goal Seek) : trouver la valeur d’entrée nécessaire pour obtenir un résultat donné.",
        "Gestionnaire de scénarios : comparer plusieurs jeux de valeurs pour des hypothèses différentes.",
        "Tables de données à une ou deux variables (pour voir l’impact d’un paramètre sur un résultat).",
    ],
    [
        "Protéger les feuilles critiques (formules, paramètres) et laisser certaines zones éditables.",
        "Utiliser la validation des données pour limiter les valeurs autorisées (listes déroulantes, seuils, etc.).",
        "Limiter les formules volatiles et les calculs inutiles pour éviter les lenteurs.",
    ],
    [
        "3 à 5 indicateurs clés (KPI) en haut du dashboard.",
        "1 à 2 grandes zones de graphiques (par période, par segment, par produit).",
        "Segments (slicers) pour filtrer par pays, produit, période, etc.",
        "Interaction avec les TCD/graphes reliés au modèle de données.",
    ],
    [],
];
export const EXCEL_EXERCICES_CHAPTER_5 = [
    [],
    [
        "Enregistrer une macro qui met en forme automatiquement un tableau (titres en gras, bordures, format monétaire).",
        "Affecter la macro à un bouton sur la feuille Dashboard.",
    ],
    [
        "Importer un fichier CSV de ventes brutes via Power Query.",
        "Nettoyer les colonnes, filtrer des lignes inutiles et charger le résultat dans une nouvelle feuille.",
    ],
    [
        "Charger via Power Query une table Ventes et une table Clients dans le modèle de données.",
        "Créer une relation entre Ventes[IDClient] et Clients[IDClient].",
        "Créer une mesure TotalVentes et l’utiliser dans un TCD basé sur le modèle de données.",
    ],
    [
        "Utiliser Valeur cible pour trouver le prix de vente nécessaire pour atteindre un chiffre d’affaires donné.",
        "Créer deux scénarios (optimiste / pessimiste) dans le Gestionnaire de scénarios et comparer les résultats.",
    ],
    [],
    [
        "Créer une feuille Dashboard final avec KPI, graphiques et segments connectés au modèle de données.",
    ],
    [
        "➡️ À partir de plusieurs sources de données (CSV, Excel, éventuellement base de données ou export système), l’apprenant doit :",
        "Importer les données via Power Query, les nettoyer et les charger dans le modèle de données.",
        "Construire un modèle Power Pivot simple (tables, relations, mesures).",
        "Créer un dashboard avec KPI, TCD, graphiques, segments filtrants.",
        "Automatiser une petite partie (mise en forme, actualisation, etc.) avec une macro.",
        "Documenter le fichier (feuille Info : source des données, fonctionnement global, raccourcis macros).",
    ],
]
/*
export const TITLES_CHAPTER_ = [
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
];
export const GOALS_CHAPTER_ = [
    [""],
    [""],
    [""],
    [""],
    [""],
    [""],
    [""],
    [""],
];
export const KEYS_CHAPTER_ = [
    [
        "",
        "",
    ],
    [
        "➡️",
        "",
    ],
];
export const EXERCICES_CHAPTER_ = [
    [
        "",
        "",
    ],
    [
        "➡️ ",
        "",
    ],
]
*/