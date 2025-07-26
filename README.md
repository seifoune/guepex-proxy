# YalGuep Proxy

Un proxy intelligent qui détecte automatiquement les requêtes GET et POST et les redirige vers différentes URLs.

## 🚀 Fonctionnalités

- **Détection automatique** des méthodes HTTP (GET, POST)
- **Redirection intelligente** vers des URLs différentes selon la méthode
- **Logging complet** de toutes les requêtes
- **Sécurité renforcée** avec Helmet et CORS
- **Déploiement Railway** prêt à l'emploi
- **Health check** intégré

## 📋 Prérequis

- Node.js 18+ 
- npm ou yarn
- Compte Railway (pour le déploiement)

## 🛠️ Installation locale

1. **Cloner le projet**
```bash
git clone <votre-repo>
cd yalguep-proxy
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configurer les variables d'environnement**
```bash
# Créer un fichier .env
GET_REDIRECT_URL=https://votre-url-get.com
POST_REDIRECT_URL=https://votre-url-post.com
PORT=3000
```

4. **Démarrer le serveur**
```bash
# Mode développement
npm run dev

# Mode production
npm start
```

## 🌐 Configuration

### Variables d'environnement

| Variable | Description | Défaut |
|----------|-------------|---------|
| `GET_REDIRECT_URL` | URL de redirection pour les requêtes GET | `https://example-get.com` |
| `POST_REDIRECT_URL` | URL de redirection pour les requêtes POST | `https://example-post.com` |
| `PORT` | Port du serveur | `3000` |

### Exemple de configuration

```env
GET_REDIRECT_URL=https://api.example.com/v1/data
POST_REDIRECT_URL=https://api.example.com/v1/submit
PORT=3000
```

## 🚀 Déploiement sur Railway

1. **Connecter votre repository GitHub à Railway**

2. **Configurer les variables d'environnement dans Railway**
   - Allez dans votre projet Railway
   - Section "Variables"
   - Ajoutez :
     - `GET_REDIRECT_URL`
     - `POST_REDIRECT_URL`

3. **Déployer**
   - Railway détectera automatiquement le fichier `railway.json`
   - Le déploiement se fera automatiquement

## 📡 Utilisation

### Test local

```bash
# Test GET
curl http://localhost:3000/api/test

# Test POST
curl -X POST http://localhost:3000/api/submit \
  -H "Content-Type: application/json" \
  -d '{"data": "test"}'

# Health check
curl http://localhost:3000/health
```

### Exemples de redirection

- **Requête GET** vers `http://votre-proxy.com/api/users`
  → Redirigée vers `GET_REDIRECT_URL/api/users`

- **Requête POST** vers `http://votre-proxy.com/api/submit`
  → Redirigée vers `POST_REDIRECT_URL/api/submit`

## 📊 Monitoring

Le proxy inclut un endpoint de santé :

```bash
GET /health
```

Réponse :
```json
{
  "status": "OK",
  "message": "YalGuep Proxy fonctionne correctement",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "config": {
    "getRedirectUrl": "https://example-get.com",
    "postRedirectUrl": "https://example-post.com"
  }
}
```

## 🔧 Structure du projet

```
yalguep-proxy/
├── server.js          # Serveur principal
├── package.json       # Dépendances et scripts
├── railway.json       # Configuration Railway
├── README.md          # Documentation
└── .gitignore         # Fichiers ignorés
```

## 🛡️ Sécurité

- **Helmet** : Headers de sécurité HTTP
- **CORS** : Gestion des requêtes cross-origin
- **Morgan** : Logging des requêtes
- **Validation** des entrées

## 📝 Logs

Le proxy log toutes les requêtes avec :
- Timestamp
- Méthode HTTP
- URL
- Headers
- Body (pour POST)
- Statut de réponse

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature
3. Commit vos changements
4. Push vers la branche
5. Ouvrir une Pull Request

## 📄 Licence

MIT License - voir le fichier LICENSE pour plus de détails.

## 🆘 Support

Pour toute question ou problème :
- Ouvrir une issue sur GitHub
- Contacter l'équipe de développement

---

**Développé avec ❤️ par YalGuep** 