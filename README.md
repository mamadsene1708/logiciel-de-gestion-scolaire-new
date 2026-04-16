# logiciel-de-gestion-scolaire
Application Node.js (Express) pour démarrer un projet de gestion scolaire.

## Fonctionnalités actuelles
- Serveur Express minimal
- Endpoint de test `GET /`
- Chargement de configuration via `.env`

## Prérequis
- Node.js 18+ (recommandé)
- npm 9+ (recommandé)

## Installation
```bash
npm install
```
## Lancement en développement
```bash
npm run dev
```
## Lancement en production
```bash
npm start
```

## Variables d'environnement
Copier le fichier d'exemple puis adapter les valeurs :
```powershell
Copy-Item .env.example .env
```
ou
```bash
cp .env.example .env
```
Exemple :
```env
PORT=3000
```

## Structure du projet
- `src/` : code source de l'application
- `tests/` : tests
- `docs/` : documentation complémentaire
- `scripts/` : scripts utilitaires
- `config/` : fichiers de configuration

## Déploiement
### Prérequis serveur
- Node.js 18+
- npm 9+
- Accès réseau au port configuré (`PORT`)

### Étapes de déploiement
1. Cloner le dépôt
2. Installer les dépendances en mode production
3. Configurer les variables d'environnement
4. Démarrer le service

PowerShell :
```powershell
git clone https://github.com/mamadsene1708/logiciel-de-gestion-scolaire-new.git
cd logiciel-de-gestion-scolaire
npm ci --omit=dev
Copy-Item .env.example .env
npm start
```
Bash :
```bash
git clone https://github.com/mamadsene1708/logiciel-de-gestion-scolaire-new.git
cd logiciel-de-gestion-scolaire
npm ci --omit=dev
cp .env.example .env
npm start
```

### Vérifications post-déploiement
- Vérifier que le processus Node tourne
- Vérifier la réponse de l'API sur `/`
- Vérifier les logs applicatifs

### Option PM2 (recommandée en production)
```bash
npm install -g pm2
pm2 start ecosystem.config.cjs
pm2 save
```
