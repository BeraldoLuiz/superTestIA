const supertest = require('supertest');

// baseURL vem do ambiente (.env ou variável de CI).
// Ex.: BASE_URL=https://jsonplaceholder.typicode.com
const baseURL = process.env.BASE_URL;

if (!baseURL) {
  throw new Error(
    'BASE_URL não definida. Copie .env.example para .env e configure a URL da API.'
  );
}

// Instância do SuperTest apontando para a API externa.
const request = supertest(baseURL);

module.exports = { request, baseURL };
