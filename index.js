const express = require('express');
const axios = require('axios');
const app = express();

const PORT = process.env.PORT || 8080;

const URL_GET = process.env.URL_GET || 'https://managiiha.bubbleapps.io/version-test/api/1.1/wf/webhook_crc_validation';
const URL_POST = process.env.URL_POST || 'https://managiiha.bubbleapps.io/version-test/api/1.1/wf/webhook_events/initialize';

app.use(express.json());

app.all('*', async (req, res) => {
  const method = req.method;
  const targetUrl = method === 'GET' ? URL_GET : URL_POST;

  console.log(`➡️ Reçu une requête ${method} - Redirection vers : ${targetUrl}`);

  try {
    const response = await axios({
      method,
      url: targetUrl,
      headers: {
        'user-agent': 'Mozilla/5.0 (compatible; RailwayBot/1.0)',
        ...req.headers,
      },
      data: method !== 'GET' ? req.body : undefined,
      timeout: 10000,
      httpsAgent: new (require('https').Agent)({
        rejectUnauthorized: false, // Bypass TLS check
      }),
    });

    res.status(response.status).send(response.data);
  } catch (error) {
    console.error('🔥 ERREUR Proxy :', error.message);
    res.status(502).send('Erreur de redirection proxy');
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Proxy démarré sur le port ${PORT}`);
});
