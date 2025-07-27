const express = require('express');
const fetch = require('node-fetch');
const https = require('https');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 8080;

const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
  keepAlive: true
});

const URL_GET = process.env.URL_GET;
const URL_POST = process.env.URL_POST;

app.use(express.json());

app.all('*', async (req, res) => {
  try {
    const targetURL = req.method === 'GET' ? URL_GET : URL_POST;
    console.log(`➡️ Reçu une requête ${req.method} - Redirection vers : ${targetURL}`);

    const response = await fetch(targetURL, {
      method: req.method,
      headers: req.headers,
      body: req.method === 'GET' ? undefined : JSON.stringify(req.body),
      agent: httpsAgent,
    });

    const data = await response.text();
    res.status(response.status).send(data);

  } catch (error) {
    console.error('🔥 ERREUR Proxy :', error.message);
    res.status(500).send({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`🚀 Proxy démarré sur le port ${port}`);
});
