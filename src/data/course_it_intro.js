// src/data/course_it_intro.js
import lesson1 from "@/assets/images/lessons/it/1.png";
export const COURSE_IT_INTRO = {
  uid: "course_it_intro_beginner",
  title: "Introduction à l’informatique",
  level: "Débutant",
  subtitle:
    "Prendre en main un ordinateur et un mobile, créer un e-mail, naviguer sur Internet et apprendre les bases de la sécurité.",
  estimatedHours: 6,
  parts: [
    {
      key: "A",
      title: "Prise en main (ordinateur & mobile)",
      lessons: [
        {
          slug: "a1-vocabulaire-interface",
          title: "Vocabulaire & interface",
          goal:
            "Comprendre les notions de base (système, application, fenêtre, navigateur) et se repérer sur l’écran.",
          content: [
            {
              type: "bullets",
              title: "À retenir",
              items: [
                "Un système (Windows/macOS/Android/iOS) permet d’utiliser l’appareil.",
                "Une application est un programme (ex: Photos, WhatsApp, Word).",
                "Un navigateur sert à aller sur Internet (Chrome, Safari, Edge...).",
                "Un onglet est une “page” ouverte dans le navigateur.",
              ],
            },
            {
              type: "tips",
              title: "Astuce",
              text: "Si tu es perdu, reviens à l’écran d’accueil (mobile) ou au bureau (ordinateur) et repars depuis là.",
            },
          ],
          exercise: {
            title: "Exercice A1 — Se repérer",
            steps: [
              "Allume l’appareil et attends l’écran d’accueil.",
              "Ouvre une application (ex: Calculatrice), puis ferme-la.",
              "Ouvre le navigateur, ouvre 2 onglets, puis repasse de l’un à l’autre.",
              "Fais une capture d’écran.",
            ],
            checklist: [
              "Je sais ouvrir/fermer une application",
              "Je sais passer d’un onglet à l’autre",
              "Je sais faire une capture d’écran",
            ],
          },
          images: [
            lesson1,
            //"@/assets/images/lessons/it/1.png",
            "/images/courses/it-intro/a1_02.png",
            "/images/courses/it-intro/a1_03.png",
            "/images/courses/it-intro/a1_04.png",
          ],
        },
      ],
    },

    {
      key: "B",
      title: "Fichiers & dossiers",
      lessons: [
        {
          slug: "b1-fichiers-dossiers-telechargements",
          title: "Fichiers, dossiers & téléchargements",
          goal:
            "Savoir où sont tes documents, créer des dossiers, télécharger un fichier et le retrouver.",
          content: [
            {
              type: "bullets",
              title: "À retenir",
              items: [
                "Un fichier = un contenu (photo, PDF, document).",
                "Un dossier = un “sac” qui contient des fichiers et d’autres dossiers.",
                "Téléchargements = endroit où arrivent les fichiers depuis Internet.",
                "Les extensions (ex: .pdf, .jpg) indiquent le type du fichier.",
              ],
            },
          ],
          exercise: {
            title: "Exercice B1 — Organiser ses documents",
            steps: [
              "Crée un dossier nommé MonApprentissage.",
              "Dans MonApprentissage, crée deux sous-dossiers : Documents et Photos.",
              "Télécharge un PDF depuis Internet.",
              "Déplace ce PDF dans MonApprentissage/Documents.",
              "Renomme le fichier en Guide.pdf.",
            ],
            checklist: [
              "Je sais créer un dossier",
              "Je sais déplacer un fichier",
              "Je sais renommer un fichier",
            ],
          },
          images: [
            "/images/courses/it-intro/b1_01.png",
            "/images/courses/it-intro/b1_02.png",
            "/images/courses/it-intro/b1_03.png",
            "/images/courses/it-intro/b1_04.png",
          ],
        },
      ],
    },

    {
      key: "C",
      title: "Internet & navigation",
      lessons: [
        {
          slug: "c1-naviguer-rechercher",
          title: "Naviguer et rechercher",
          goal:
            "Utiliser un navigateur, faire des recherches efficaces et enregistrer des favoris.",
          content: [
            {
              type: "bullets",
              title: "À retenir",
              items: [
                "Le navigateur ≠ Google (Google est un moteur de recherche).",
                "Une recherche efficace utilise des mots clés précis.",
                "Attention aux résultats “Sponsorisé/Annonce”.",
                "Les favoris servent à retrouver rapidement un site.",
              ],
            },
            {
              type: "tips",
              title: "Astuce de recherche",
              text: 'Essaye : mettre une phrase entre guillemets "..." pour chercher exactement cette expression.',
            },
          ],
          exercise: {
            title: "Exercice C1 — Rechercher et organiser",
            steps: [
              "Cherche un site officiel (ex: administration, école, banque).",
              "Ouvre 3 onglets liés au même sujet.",
              "Ajoute le meilleur site en favori.",
              "Ferme puis rouvre le navigateur et retrouve le favori.",
            ],
            checklist: [
              "Je sais distinguer navigateur et moteur de recherche",
              "Je sais gérer plusieurs onglets",
              "Je sais ajouter un favori",
            ],
          },
          images: [
            "/images/courses/it-intro/c1_01.png",
            "/images/courses/it-intro/c1_02.png",
            "/images/courses/it-intro/c1_03.png",
            "/images/courses/it-intro/c1_04.png",
          ],
        },
      ],
    },

    {
      key: "D",
      title: "E-mail (création & utilisation)",
      lessons: [
        {
          slug: "d1-creer-email",
          title: "Créer une adresse e-mail",
          goal:
            "Créer une adresse e-mail, choisir un mot de passe robuste et activer la récupération.",
          content: [
            {
              type: "bullets",
              title: "À retenir",
              items: [
                "Choisis une adresse simple (prenom.nom...).",
                "Utilise un mot de passe long (12+), unique, et un gestionnaire si possible.",
                "Active la double authentification (2FA).",
                "Ajoute un numéro de récupération.",
              ],
            },
          ],
          exercise: {
            title: "Exercice D1 — Création",
            steps: [
              "Choisis un fournisseur (Gmail ou Outlook).",
              "Crée ton compte avec un identifiant propre.",
              "Active la double authentification.",
              "Note ta méthode de récupération (téléphone/e-mail).",
            ],
            checklist: [
              "Compte créé",
              "Mot de passe fort",
              "2FA activée",
              "Récupération configurée",
            ],
          },
          images: [
            "/images/courses/it-intro/d1_01.png",
            "/images/courses/it-intro/d1_02.png",
            "/images/courses/it-intro/d1_03.png",
            "/images/courses/it-intro/d1_04.png",
          ],
        },
        {
          slug: "d2-utiliser-email",
          title: "Envoyer, répondre, pièces jointes",
          goal: "Envoyer un e-mail clair, joindre un fichier, et organiser sa boîte.",
          content: [
            {
              type: "bullets",
              title: "À retenir",
              items: [
                "Objet = phrase courte qui résume l’e-mail.",
                "CC = copie visible, CCI = copie cachée.",
                "Évite d’envoyer des pièces jointes trop lourdes : utilise un lien Drive/OneDrive.",
                "Range tes e-mails avec des dossiers/labels.",
              ],
            },
          ],
          exercise: {
            title: "Exercice D2 — Envoi propre",
            steps: [
              "Rédige un e-mail avec un objet clair.",
              "Ajoute une pièce jointe (PDF).",
              "Envoie-toi l’e-mail (à toi-même) pour test.",
              "Crée un label/dossier “Administratif” et range l’e-mail dedans.",
            ],
            checklist: [
              "Je sais écrire un objet clair",
              "Je sais joindre un fichier",
              "Je sais ranger mes e-mails",
            ],
          },
          images: [
            "/images/courses/it-intro/d2_01.png",
            "/images/courses/it-intro/d2_02.png",
            "/images/courses/it-intro/d2_03.png",
            "/images/courses/it-intro/d2_04.png",
          ],
        },
      ],
    },

    {
      key: "E",
      title: "Sécurité & vie privée",
      lessons: [
        {
          slug: "e1-securite-essentielle",
          title: "Arnaques, mots de passe, mises à jour",
          goal:
            "Éviter le phishing, protéger ses comptes, et comprendre les mises à jour/sauvegardes.",
          content: [
            {
              type: "bullets",
              title: "À retenir",
              items: [
                "Ne clique pas sur des liens suspects (SMS/e-mails).",
                "Vérifie l’adresse de l’expéditeur et le nom de domaine du site.",
                "Mets à jour ton système et tes apps.",
                "Fais des sauvegardes (cloud ou disque externe).",
              ],
            },
          ],
          exercise: {
            title: "Exercice E1 — Mini audit",
            steps: [
              "Active 2FA sur ton e-mail (si pas déjà fait).",
              "Vérifie les mises à jour disponibles sur ton appareil.",
              "Liste 5 signes d’un message frauduleux.",
              "Vérifie les autorisations d’une application (caméra, localisation...).",
            ],
            checklist: [
              "2FA activée",
              "Mises à jour vérifiées",
              "Je sais repérer un phishing",
            ],
          },
          images: [
            "/images/courses/it-intro/e1_01.png",
            "/images/courses/it-intro/e1_02.png",
            "/images/courses/it-intro/e1_03.png",
            "/images/courses/it-intro/e1_04.png",
          ],
        },
      ],
    },

    {
      key: "F",
      title: "Outils du quotidien",
      lessons: [
        {
          slug: "f1-scanner-partager-visio",
          title: "Scanner, partager, visio",
          goal:
            "Scanner un document avec un mobile, partager un fichier, et rejoindre une visio.",
          content: [
            {
              type: "bullets",
              title: "À retenir",
              items: [
                "Tu peux scanner un document avec l’app Notes/Drive/Office Lens (selon appareil).",
                "Partager un fichier peut se faire par lien (plus pratique).",
                "En visio : micro/caméra, mute, chat, partage d’écran.",
              ],
            },
          ],
          exercise: {
            title: "Exercice F1 — Workflow simple",
            steps: [
              "Scanne un document en PDF (1 page).",
              "Renomme le PDF (ex: Identite.pdf).",
              "Crée un lien de partage (lecture seule).",
              "Rejoins une visio de test et coupe/rallume le micro.",
            ],
            checklist: [
              "Je sais scanner en PDF",
              "Je sais partager un lien",
              "Je sais gérer micro/caméra",
            ],
          },
          images: [
            "/images/courses/it-intro/f1_01.png",
            "/images/courses/it-intro/f1_02.png",
            "/images/courses/it-intro/f1_03.png",
            "/images/courses/it-intro/f1_04.png",
          ],
        },
      ],
    },
  ],
};

// helpers
export function flattenLessons(course) {
  const out = [];
  for (const part of course.parts) {
    for (const lesson of part.lessons) {
      out.push({
        partKey: part.key,
        partTitle: part.title,
        ...lesson,
      });
    }
  }
  return out;
}

export function getLessonBySlug(course, slug) {
  return flattenLessons(course).find((l) => l.slug === slug) || null;
}
