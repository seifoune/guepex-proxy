const express = require('express');
const got = require('got');
const app = express();

const PORT = process.env.PORT || 8080;

// URLs de redirection
const URL_GET = process.env.URL_GET || 'https://managiiha.bubbleapps.io/version-test/api/1.1/wf/webhook_crc_validation';
const URL_POST = process.env.URL_POST || 'https://managiiha.bubbleapps.io/version-test/api/1.1/wf/webhook_events/initialize';

app.use(express.json());

app.all('*', async (req, res) => {
  const method = req.method;
  const targetUrl = method === 'GET' ? URL_GET : URL_POST;

  console.log(`➡️ Reçu une requête ${method} - Redirection vers : ${targetUrl}`);

  try {
    const response = await got(targetUrl, {
      method,
      headers: {
        'user-agent': 'railway-proxy',
        ...req.headers,
      },
      ...(method !== 'GET' ? { json: req.body } : {}),
      https: {
        rejectUnauthorized: false, // Pour éviter l'erreur TLS
      },
      timeout: 10000,
    });

    res.status(response.statusCode).send(response.body);
  } catch (error) {
    console.error('🔥 ERREUR Proxy :', error.message);
    res.status(502).send('Erreur de redirection proxy');
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Proxy démarré sur le port ${PORT}`);
});
