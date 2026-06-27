const supertest = require('supertest');

// baseURL comes from the environment (.env or CI variable).
// e.g. BASE_URL=https://jsonplaceholder.typicode.com
const baseURL = process.env.BASE_URL;

if (!baseURL) {
  throw new Error(
    'BASE_URL is not set. Copy .env.example to .env and configure the API URL.'
  );
}

// SuperTest instance pointing to the external API.
const request = supertest(baseURL);

module.exports = { request, baseURL };
