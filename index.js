const got = require('got');

app.get('*', async (req, res) => {
  console.log(`➡️ Reçu une requête GET - Redirection vers : ${URL_GET}`);

  try {
    const response = await got.get(URL_GET, {
      headers: {
        'user-agent': 'proxy-railway'
      },
      https: {
        rejectUnauthorized: false
      },
      timeout: 10000
    });

    res.status(response.statusCode).send(response.body);
  } catch (error) {
    console.error('🔥 ERREUR Proxy :', error.message);
    res.status(502).send('Erreur lors de la redirection GET');
  }
});
