import tls from 'tls';
import https from 'https';

const url = process.env.URL_GET;

https.get(url, { agent: new https.Agent({ rejectUnauthorized: false }) }, (res) => {
  console.log('Code de status:', res.statusCode);
  res.on('data', (d) => process.stdout.write(d));
}).on('error', err => {
  console.error('ERREUR TLS:', err.message);
});
