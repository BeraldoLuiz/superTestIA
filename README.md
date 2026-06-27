# superTestIA

Testes de API externa com [SuperTest](https://github.com/ladjs/supertest) + [Jest](https://jestjs.io/).

Os testes apontam para uma API já em execução através de uma `BASE_URL` configurável por variável de ambiente — não há código de servidor neste repositório.

## Setup

```bash
pnpm install
cp .env.example .env   # ajuste a BASE_URL para a API que deseja testar
```

## Rodando os testes

```bash
pnpm test           # roda todos os testes uma vez
pnpm test:watch     # modo watch
pnpm test:ci        # modo CI (serial)
```

## Estrutura

```
tests/
  helpers/
    client.js      # instância do SuperTest apontando para BASE_URL
  setup.js         # carrega o .env antes dos testes
  posts.test.js    # testes de exemplo (JSONPlaceholder)
.env.example       # template de variáveis de ambiente
jest.config.js     # configuração do Jest
```

## Escrevendo novos testes

Importe o cliente já configurado e use a API do SuperTest:

```js
const { request } = require('./helpers/client');

it('exemplo', async () => {
  const res = await request.get('/endpoint');
  expect(res.status).toBe(200);
});
```
