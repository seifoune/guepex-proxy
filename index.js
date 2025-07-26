const express = require('express');
const got = require('got');
const app = express();

app.use(express.raw({ type: '*/*' }));

app.all('/', async (req, res) => {
  const method = req.method;
  const target = method === 'GET'
    ? process.env.URL_GET
    : method === 'POST'
    ? process.env.URL_POST
    : null;

  if (!target) {
    return res.status(405).send('Method not allowed');
  }

  try {
    const options = {
      method,
      headers: {
        ...req.headers,
        'user-agent': 'Mozilla/5.0 (Node.js Proxy)'
      },
      responseType: 'buffer',
      followRedirect: true,
      https: {
        rejectUnauthorized: false
      }
    };

    // ✅ N’ajoute le body QUE si la méthode le supporte
    if (!['GET', 'HEAD'].includes(method)) {
      options.body = req.body;
    }

    const response = await got(target, options);

    res.status(response.statusCode)
       .set(response.headers)
       .send(response.body);
  } catch (error) {
    console.error('Proxy error:', error.message);
    res.status(502).send('Bad Gateway: ' + error.message);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
