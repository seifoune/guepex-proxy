require('dotenv').config();

console.log('Test des variables d\'environnement:');
console.log('GET_REDIRECT_URL:', process.env.GET_REDIRECT_URL);
console.log('POST_REDIRECT_URL:', process.env.POST_REDIRECT_URL);
console.log('PORT:', process.env.PORT); 