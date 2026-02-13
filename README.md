# 🎓 Dandela Academy

> Plateforme d'éducation digitale conçue pour l’Angola et au-delà.  
> Apprendre. Valider. Certifier. Évoluer.

---

![Next.js](https://img.shields.io/badge/Next.js-Framework-black)
![Firebase](https://img.shields.io/badge/Firebase-Backend-orange)
![Firestore](https://img.shields.io/badge/Firestore-Base%20de%20données-yellow)
![Cloud Functions](https://img.shields.io/badge/Cloud%20Functions-Serverless-blue)
![Licence](https://img.shields.io/badge/Licence-Privée-red)

---

## 📖 Table des matières

- [🌍 Vision](#-vision)
- [🚀 Stack technique](#-stack-technique)
- [🏗 Architecture](#-architecture)
- [📚 Structure académique](#-structure-académique)
- [📝 Système de validation](#-système-de-validation)
- [🔐 Sécurité](#-sécurité)
- [🌐 Internationalisation](#-internationalisation)
- [📦 Installation](#-installation)
- [☁️ Déploiement](#️-déploiement)
- [📈 Feuille de route](#-feuille-de-route)
- [👨🏾‍💻 Auteur](#-auteur)
- [📄 Licence](#-licence)

---

## 🌍 Vision

Dandela Academy a pour objectif de :

- Rendre la formation numérique accessible en Angola 🇦🇴  
- Structurer les parcours d’apprentissage par niveaux  
- Valider les compétences via des évaluations contrôlées  
- Délivrer des attestations et diplômes officiels  
- Relier formation en ligne et examens en présentiel  

> L’éducation est le socle de l’indépendance numérique.

---

## 🚀 Stack technique

### Frontend
- **Next.js**
- React
- MUI / TailwindCSS
- Système d’internationalisation (FR / PT / EN)

### Backend & Infrastructure
- **Firebase Authentication**
- **Firestore (base de données NoSQL)**
- **Firebase Storage**
- **Firebase Cloud Functions**
- Hébergement via **Vercel**

---

## 🏗 Architecture

```
Client (Next.js)
        ↓
Firebase Authentication
        ↓
Firestore (Cours, Quiz, Progression, Certificats)
        ↓
Cloud Functions (Logique métier, génération PDF, validations)
        ↓
Firebase Storage (Supports, Diplômes, Fichiers)
```

### 🔹 Principes d’architecture

- Approche serverless
- Scalabilité élevée
- Optimisé mobile
- Compatible offline
- Structure modulaire et maintenable

---

## 📚 Structure académique

Les formations sont organisées en :

### 🔹 Modules
- Introduction à l’informatique
- Microsoft Word
- Microsoft Excel
- Microsoft PowerPoint
- (Extensions futures : IA, cybersécurité…)

### 🔹 Niveaux
- Débutant
- Intermédiaire
- Compétent
- Avancé
- Expert

Chaque niveau comprend :
- Leçons structurées
- Exercices pratiques
- Quiz d’évaluation

---

## 📝 Système de validation

Le système de certification inclut :

- Nombre limité de tentatives aux quiz
- Délai entre les tentatives
- Validation des compétences
- Accès à l’examen final en présentiel
- Délivrance d’un diplôme après réussite

> Toutes les validations sensibles sont vérifiées côté backend via Cloud Functions.

---

## 🔐 Sécurité

- Authentification via Firebase
- Règles Firestore strictes
- Séparation des rôles (Admin / Étudiant)
- Vérifications côté serveur
- Génération contrôlée des certificats

---

## 🌐 Internationalisation

Langues supportées :

- 🇫🇷 Français
- 🇦🇴 Portugais (Angola)
- 🇬🇧 Anglais

Gestion via fichiers JSON de traduction.

---

## 📦 Installation

### 1️⃣ Cloner le projet

```bash
git clone https://github.com/votre-username/dandela-academy.git
cd dandela-academy
```

### 2️⃣ Installer les dépendances

```bash
npm install
```

### 3️⃣ Créer le fichier `.env.local`

```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

### 4️⃣ Lancer le projet en local

```bash
npm run dev
```

---

## ☁️ Déploiement

| Couche      | Service     |
|-------------|------------|
| Frontend    | Vercel     |
| Backend     | Firebase   |
| Base de données | Firestore  |
| Stockage    | Firebase Storage |

---

## 📈 Feuille de route

- [ ] Application mobile (React Native / Expo)
- [ ] Diplômes sécurisés avec QR code
- [ ] Intégration paiements locaux Angola
- [ ] Dashboard analytics avancé
- [ ] Assistant IA pédagogique
- [ ] Partenariats institutionnels

---

## 👨🏾‍💻 Auteur

**Daniel Mbengui**  
Fondateur – Dandela Academy  
Luanda, Angola 🇦🇴

---

## 📄 Licence

Projet privé – Tous droits réservés.

---

> Conçu pour une montée en charge à long terme.
