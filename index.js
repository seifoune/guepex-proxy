const express = require('express');
const got = require('got');

const app = express();

// Permet de lire tous types de payloads (JSON, texte brut, etc.)
app.use(express.raw({ type: '*/*' }));

// Route de debug pour t'assurer que tout est bien chargé
app.get('/debug', (req, res) => {
  const gotVersion = require('got/package.json').version;
  res.json({
    gotVersion,
    env: {
      URL_GET: process.env.URL_GET,
      URL_POST: process.env.URL_POST
    },
    note: 'Si la version de got est >=12, tu DOIS repasser à got@11.8.5'
  });
});

// Route de test
app.get('/health', (req, res) => {
  res.send('✅ Proxy en ligne');
});

// Proxy principal
app.all('/', async (req, res) => {
  const method = req.method;
  const targetUrl = method === 'GET'
    ? process.env.URL_GET
    : process.env.URL_POST;

  console.log(`➡️ Reçu une requête ${method} - Redirection vers : ${targetUrl}`);

  if (!targetUrl) {
    console.warn('❌ Aucune URL cible définie pour ce type de requête.');
    return res.status(400).send('Aucune URL cible définie');
  }

  try {
    const options = {
      method,
      headers: {
        ...req.headers,
        'user-agent': 'Railway-Proxy/1.0'
      },
      responseType: 'buffer',
      followRedirect: true,
      timeout: 10000,
      rejectUnauthorized: false // IMPORTANT : supporté uniquement par got@11
    };

    // Ne pas envoyer de body pour GET ou HEAD
    if (!['GET', 'HEAD'].includes(method)) {
      options.body = req.body;
    }

    const response = await got(targetUrl, options);
    console.log(`✅ Requête vers ${targetUrl} réussie (code ${response.statusCode})`);

    res.status(response.statusCode)
       .set(response.headers)
       .send(response.body);

  } catch (err) {
    console.error('🔥 ERREUR Proxy :', err.message);
    if (err.response) {
      console.error('📦 Réponse d’erreur :', err.response.body.toString());
    }
    res.status(502).send('Bad Gateway: ' + err.message);
  }
});

// Lancement du serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Proxy démarré sur le port ${PORT}`);
});
