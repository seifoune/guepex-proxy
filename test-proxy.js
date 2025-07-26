const fetch = require('node-fetch');

// Configuration de test
const PROXY_URL = 'http://localhost:3000';
const TEST_ENDPOINTS = [
    '/api/users',
    '/api/data',
    '/api/test'
];

async function testProxy() {
    console.log('🧪 Test du YalGuep Proxy\n');
    
    // Test des requêtes GET
    console.log('📡 Test des requêtes GET:');
    for (const endpoint of TEST_ENDPOINTS) {
        try {
            const response = await fetch(`${PROXY_URL}${endpoint}`);
            console.log(`✅ GET ${endpoint} → Status: ${response.status}`);
        } catch (error) {
            console.log(`❌ GET ${endpoint} → Erreur: ${error.message}`);
        }
    }
    
    console.log('\n📡 Test des requêtes POST:');
    for (const endpoint of TEST_ENDPOINTS) {
        try {
            const response = await fetch(`${PROXY_URL}${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    test: true,
                    endpoint: endpoint,
                    timestamp: new Date().toISOString()
                })
            });
            console.log(`✅ POST ${endpoint} → Status: ${response.status}`);
        } catch (error) {
            console.log(`❌ POST ${endpoint} → Erreur: ${error.message}`);
        }
    }
    
    // Test du health check
    console.log('\n🏥 Test du health check:');
    try {
        const response = await fetch(`${PROXY_URL}/health`);
        const data = await response.json();
        console.log(`✅ Health check → Status: ${response.status}`);
        console.log('📊 Configuration actuelle:');
        console.log(`   GET URL: ${data.config.getRedirectUrl}`);
        console.log(`   POST URL: ${data.config.postRedirectUrl}`);
    } catch (error) {
        console.log(`❌ Health check → Erreur: ${error.message}`);
    }
    
    console.log('\n✨ Tests terminés!');
}

// Exécuter les tests si le script est lancé directement
if (require.main === module) {
    testProxy().catch(console.error);
}

module.exports = { testProxy }; 