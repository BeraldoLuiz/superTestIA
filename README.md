# superTestIA

External API testing with [SuperTest](https://github.com/ladjs/supertest) + [Jest](https://jestjs.io/).

The tests run against an already-running API through a configurable `BASE_URL` environment variable — there is no server code in this repository.

## Setup

```bash
pnpm install
cp .env.example .env   # set BASE_URL to the API you want to test
```

## Running the tests

```bash
pnpm test           # run all tests once
pnpm test:watch     # watch mode
pnpm test:ci        # CI mode (serial)
```

## Structure

```
tests/
  helpers/
    client.js      # SuperTest instance pointing to BASE_URL
  setup.js         # loads .env before tests
  posts.test.js    # example tests (JSONPlaceholder)
.env.example       # environment variables template
jest.config.js     # Jest configuration
```

## Writing new tests

Import the pre-configured client and use the SuperTest API:

```js
const { request } = require('./helpers/client');

it('example', async () => {
  const res = await request.get('/endpoint');
  expect(res.status).toBe(200);
});
```
