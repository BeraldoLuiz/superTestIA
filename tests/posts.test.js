const { request } = require('./helpers/client');

// Testes de exemplo contra a API JSONPlaceholder.
// Defina BASE_URL=https://jsonplaceholder.typicode.com no .env para rodá-los.
describe('GET /posts', () => {
  it('retorna 200 e uma lista de posts', async () => {
    const res = await request.get('/posts');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('cada post tem os campos esperados', async () => {
    const res = await request.get('/posts/1');

    expect(res.status).toBe(200);
    expect(res.body).toEqual(
      expect.objectContaining({
        id: 1,
        userId: expect.any(Number),
        title: expect.any(String),
        body: expect.any(String),
      })
    );
  });
});

describe('POST /posts', () => {
  it('cria um post e retorna 201', async () => {
    const payload = { title: 'foo', body: 'bar', userId: 1 };

    const res = await request
      .post('/posts')
      .send(payload)
      .set('Content-Type', 'application/json');

    expect(res.status).toBe(201);
    expect(res.body).toEqual(expect.objectContaining(payload));
  });
});
