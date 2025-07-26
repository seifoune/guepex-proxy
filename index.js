const express = require('express');
const got = require('got');
const app = express();

app.use(express.raw({ type: '*/*' }));

app.all('/', async (req, res) => {
  const target = req.method === 'GET'
    ? process.env.URL_GET
    : req.method === 'POST'
    ? process.env.URL_POST
    : null;
  if (!target) {
    return res.status(405).send('Method not allowed');
  }

  try {
    const options = {
      method: req.method,
      headers: req.headers,
      responseType: 'buffer',
      // Désactiver la vérification SSL pour Railway
      https: {
        rejectUnauthorized: false
      }
    };
    
    // Ajouter le body seulement pour POST/PUT/PATCH
    if (req.method !== 'GET' && req.body) {
      options.body = req.body;
    }
    
    const response = await got(target, options);
    res.status(response.statusCode).set(response.headers).send(response.body);
  } catch (error) {
    console.error('Proxy error:', error.message);
    res.status(502).send('Bad Gateway');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
