require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuration des URLs de redirection
const GET_REDIRECT_URL = process.env.GET_REDIRECT_URL || 'https://example-get.com';
const POST_REDIRECT_URL = process.env.POST_REDIRECT_URL || 'https://example-post.com';

// Middleware de sécurité et logging
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Fonction pour faire des requêtes HTTP/HTTPS avec node-fetch
async function makeRequest(url, options) {
    try {
        const fetchOptions = {
            method: options.method,
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'YalGuep-Proxy/1.0',
                ...options.headers
            },
            timeout: 30000, // 30 secondes de timeout
            // Options pour ignorer les erreurs SSL/TLS
            rejectUnauthorized: false
        };
        
        if (options.body) {
            fetchOptions.body = options.body;
        }
        
        console.log(`Envoi de la requête vers: ${url}`);
        const response = await fetch(url, fetchOptions);
        
        const data = await response.text();
        
        return {
            statusCode: response.status,
            headers: response.headers.raw(),
            data: data
        };
    } catch (error) {
        console.error('Erreur de requête:', error.message);
        throw error;
    }
}

// Route de santé pour vérifier que le serveur fonctionne
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        message: 'YalGuep Proxy fonctionne correctement',
        timestamp: new Date().toISOString(),
        config: {
            getRedirectUrl: GET_REDIRECT_URL,
            postRedirectUrl: POST_REDIRECT_URL
        }
    });
});

// Route principale qui gère toutes les requêtes
app.all('*', async (req, res) => {
    const method = req.method.toUpperCase();
    const originalUrl = req.url;
    const headers = req.headers;
    const body = req.body;
    
    console.log(`[${new Date().toISOString()}] ${method} ${originalUrl}`);
    console.log('Headers:', JSON.stringify(headers, null, 2));
    if (Object.keys(body).length > 0) {
        console.log('Body:', JSON.stringify(body, null, 2));
    }
    
    let targetUrl;
    
    // Détection de la méthode et redirection
    if (method === 'GET') {
        targetUrl = GET_REDIRECT_URL;
        console.log(`Redirection GET vers: ${targetUrl}`);
    } else if (method === 'POST') {
        targetUrl = POST_REDIRECT_URL;
        console.log(`Redirection POST vers: ${targetUrl}`);
    } else {
        // Pour les autres méthodes (PUT, DELETE, etc.), utiliser l'URL GET par défaut
        targetUrl = GET_REDIRECT_URL;
        console.log(`Méthode ${method} non reconnue, redirection vers: ${targetUrl}`);
    }
    
    try {
        // Construction de l'URL de destination
        const destinationUrl = new URL(originalUrl, targetUrl);
        
        // Préparation des options pour la requête
        const requestOptions = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'YalGuep-Proxy/1.0',
                ...headers
            }
        };
        
        // Ajout du body pour les requêtes POST
        if (method === 'POST' && Object.keys(body).length > 0) {
            requestOptions.body = JSON.stringify(body);
        }
        
        // Envoi de la requête vers l'URL de destination
        const response = await makeRequest(destinationUrl.toString(), requestOptions);
        
        // Envoi de la réponse au client
        res.status(response.statusCode).set(response.headers).send(response.data);
        
        console.log(`Réponse envoyée avec le statut: ${response.statusCode}`);
        
    } catch (error) {
        console.error('Erreur lors de la redirection:', error);
        res.status(500).json({
            error: 'Erreur interne du serveur',
            message: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

// Gestion des erreurs
app.use((err, req, res, next) => {
    console.error('Erreur non gérée:', err);
    res.status(500).json({
        error: 'Erreur interne du serveur',
        message: err.message,
        timestamp: new Date().toISOString()
    });
});

// Démarrage du serveur
app.listen(PORT, () => {
    console.log(`🚀 YalGuep Proxy démarré sur le port ${PORT}`);
    console.log(`📡 GET requests → ${GET_REDIRECT_URL}`);
    console.log(`📡 POST requests → ${POST_REDIRECT_URL}`);
    console.log(`🏥 Health check: http://localhost:${PORT}/health`);
});

module.exports = app; 
