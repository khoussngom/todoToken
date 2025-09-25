# Application Todo - Gestion des Tâches

Une application full-stack pour la gestion des tâches (Todo) avec authentification utilisateur, permissions, enregistrement audio, upload de photos, notifications et logs d'activité.

## Fonctionnalités

- **CRUD des tâches** : Créer, lire, mettre à jour et supprimer des tâches.
- **Authentification utilisateur** : Inscription, connexion avec JWT et Google OAuth.
- **Permissions** : Attribuer des permissions d'édition et suppression à d'autres utilisateurs.
- **Upload multimédia** : Ajouter des photos et enregistrements audio aux tâches.
- **Notifications** : Système de notifications en temps réel.
- **Historique d'activité** : Logs des actions des utilisateurs.
- **Interface utilisateur** : Frontend React avec Tailwind CSS et DaisyUI.

## Prérequis

Avant de commencer, assurez-vous d'avoir installé :

- [Node.js](https://nodejs.org/) (version 16 ou supérieure)
- [MySQL](https://www.mysql.com/) (ou un serveur MySQL compatible)
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)

## Installation

1. **Cloner le dépôt** :
   ```bash
   git clone <url-du-depot>
   cd toDo
   ```

2. **Configurer le backend** :
   ```bash
   cd backend
   npm install
   ```

3. **Configurer la base de données** :
   - Créez une base de données MySQL.
   - Créez un fichier `.env` dans le dossier `backend` avec les variables suivantes :
     ```
     DATABASE_URL="mysql://username:password@localhost:3306/database_name"
     JWT_SECRET="votre-secret-jwt"
     CLOUDINARY_CLOUD_NAME="votre-cloud-name"
     CLOUDINARY_API_KEY="votre-api-key"
     CLOUDINARY_API_SECRET="votre-api-secret"
     ```
     Remplacez les valeurs par vos propres configurations.

4. **Initialiser Prisma** :
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Configurer le frontend** :
   ```bash
   cd ../frontend
   npm install
   ```

## Exécution

1. **Démarrer le backend** :
   ```bash
   cd backend
   npm run dev
   ```
   Le serveur backend sera disponible sur `http://localhost:5200` (ou le port configuré).

2. **Démarrer le frontend** :
   ```bash
   cd frontend
   npm run dev
   ```
   L'application frontend sera disponible sur `http://localhost:5173` (port par défaut de Vite).

. **Démarrer le backend pour audio** :
   ```bash
   cd frontend
   npm run dev
   ```
   L'application frontend sera disponible sur `http://localhost:5000` (port par défaut de Vite).

## Utilisation

- Accédez à l'application via le navigateur sur l'URL du frontend.
- Inscrivez-vous ou connectez-vous.
- Créez, modifiez et gérez vos tâches.
- Utilisez les fonctionnalités d'upload audio et photo.
- Gérez les permissions pour partager des tâches.

## Structure du projet

- `backend/` : API serveur avec Express, TypeScript et Prisma.
- `frontend/` : Application React avec Vite, Tailwind CSS.
- `backAudioTodo/` : Serveur supplémentaire pour la gestion audio (si applicable).

## API Endpoints principaux

- `POST /api/auth/register` : Inscription utilisateur
- `POST /api/auth/login` : Connexion utilisateur
- `GET /api/todos` : Récupérer les tâches
- `POST /api/todos` : Créer une tâche
- `PUT /api/todos/:id` : Mettre à jour une tâche
- `DELETE /api/todos/:id` : Supprimer une tâche
- `POST /api/todos/:id/permissions` : Attribuer des permissions

Pour une documentation complète, consultez les fichiers de routes dans `backend/src/routes/`.

## Scripts disponibles

### Backend
- `npm run dev` : Démarrer en mode développement avec tsx watch.
- `npm run build` : Compiler TypeScript.
- `npm run start` : Démarrer le serveur en production.
- `npm run prisma:generate` : Générer le client Prisma.
- `npm run prisma:push` : Pousser le schéma vers la base de données.

### Frontend
- `npm run dev` : Démarrer le serveur de développement Vite.
- `npm run build` : Construire pour la production.
- `npm run lint` : Lancer ESLint.
- `npm run preview` : Prévisualiser la build.

## Contribution

1. Forkez le projet.
2. Créez une branche pour votre fonctionnalité (`git checkout -b feature/nouvelle-fonctionnalite`).
3. Commitez vos changements (`git commit -am 'Ajouter une nouvelle fonctionnalité'`).
4. Poussez vers la branche (`git push origin feature/nouvelle-fonctionnalite`).
5. Ouvrez une Pull Request.

## Licence

Ce projet est sous licence ISC.