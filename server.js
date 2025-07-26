// index.js
const express = require('express');
const got = require('got');
const app = express();
app.use(express.raw({type: "*/*"}));

app.all('/', async (req, res) => {
  const target = req.method === 'GET' ? process.env.URL_GET
               : req.method === 'POST' ? process.env.URL_POST
               : null;
  if (!target) return res.status(405).send('Method not allowed');

  try {
    const response = await got(target, {
      method: req.method,
      headers: req.headers,
      body: req.body,
      responseType: 'buffer'
    });
    res.status(response.statusCode).set(response.headers).send(response.body);
  } catch (err) {
    res.status(502).send('Proxy error');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Listening on ${PORT}`));
