const express = require('express');
const fetch = require('node-fetch');
const https = require('https');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const agent = new https.Agent({
  rejectUnauthorized: false,
  keepAlive: true,
  family: 4
});

const URL_GET = process.env.URL_GET || 'https://managiiha.bubbleapps.io/version-test/api/1.1/wf/webhook_crc_validation';
const URL_POST = process.env.URL_POST || 'https://managiiha.bubbleapps.io/version-test/api/1.1/wf/webhook_events/initialize';

app.all('*', async (req, res) => {
  const isGet = req.method === 'GET';
  const targetURL = isGet ? URL_GET : URL_POST;

  console.log(`➡️ Reçu une requête ${req.method} - Redirection vers : ${targetURL}`);

  try {
    const response = await fetch(targetURL, {
      method: req.method,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Node.js Proxy)',
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        ...req.headers
      },
      body: isGet ? undefined : JSON.stringify(req.body),
      agent
    });

    const data = await response.text(); // en .text() pour éviter les erreurs si ce n’est pas du JSON
    res.status(response.status).send(data);
  } catch (error) {
    console.error(`🔥 ERREUR Proxy : ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Proxy démarré sur le port ${PORT}`);
});
