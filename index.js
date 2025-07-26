const express = require('express');
const got = require('got');

const app = express();
app.use(express.raw({ type: '*/*' }));

// Route proxy principale
app.all('/', async (req, res) => {
  const method = req.method;
  const target = method === 'GET'
    ? process.env.URL_GET
    : process.env.URL_POST;

  if (!target) return res.status(405).send('Missing target URL');

  try {
    const options = {
      method,
      headers: {
        ...req.headers,
        'user-agent': 'Railway-Proxy/1.0'
      },
      responseType: 'buffer',
      followRedirect: true,
      timeout: 7000,
      rejectUnauthorized: false // important si certificat non standard
    };

    // Pour GET et HEAD, ne pas inclure de body
    if (method !== 'GET' && method !== 'HEAD') {
      options.body = req.body;
    }

    const response = await got(target, options);
    res.status(response.statusCode).set(response.headers).send(response.body);
  } catch (err) {
    console.error('Proxy error:', err.message);
    res.status(502).send('Bad Gateway: ' + err.message);
  }
});

// Optionnel : endpoint de debug pour vérifier la version de got
app.get('/debug', (req, res) => {
  res.send(`Got version: ${require('got/package.json').version}`);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Proxy running on port ${PORT}`);
});
