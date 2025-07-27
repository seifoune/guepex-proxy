const express = require('express');
const got = require('got');

const app = express();
app.use(express.raw({ type: '*/*' }));

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
      rejectUnauthorized: false  // got@11 supporte encore cette syntaxe ici
    };

    if (!['GET', 'HEAD'].includes(method)) {
      options.body = req.body;
    }

    const response = await got(target, options);
    res.status(response.statusCode).set(response.headers).send(response.body);
  } catch (err) {
    console.error('Proxy error:', err.message);
    res.status(502).send('Bad Gateway: ' + err.message);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Proxy running on port ${PORT}`);
});
