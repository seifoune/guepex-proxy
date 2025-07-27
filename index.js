const express = require('express');
const fetch = require('node-fetch');
const https = require('https');

const app = express();
const PORT = process.env.PORT || 8080;

const URL_GET = process.env.URL_GET || 'https://managiiha.bubbleapps.io/version-test/api/1.1/wf/webhook_crc_validation';
const URL_POST = process.env.URL_POST || 'https://managiiha.bubbleapps.io/version-test/api/1.1/wf/webhook_events/initialize';

const agent = new https.Agent({
  keepAlive: true,
  rejectUnauthorized: false // Si le certificat TLS est mal reconnu
});

app.use(express.json());

app.all('*', async (req, res) => {
  const method = req.method;
  const targetUrl = method === 'GET' ? URL_GET : URL_POST;

  console.log(`➡️ Reçu une requête ${method} - Redirection vers : ${targetUrl}`);

  try {
    const options = {
      method,
      headers: {
        ...req.headers,
        'User-Agent': 'Node-Fetch-Agent',
      },
      agent
    };

    if (method !== 'GET') {
      options.body = JSON.stringify(req.body);
      options.headers['Content-Type'] = 'application/json';
    }

    const response = await fetch(targetUrl, options);
    const responseBody = await response.text();

    res.status(response.status).send(responseBody);
  } catch (err) {
    console.error('🔥 ERREUR Proxy :', err.message);
    res.status(502).send('Erreur de redirection proxy');
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Proxy démarré sur le port ${PORT}`);
});
