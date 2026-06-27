const { request } = require('./helpers/client');

// Example tests against the JSONPlaceholder API.
// Set BASE_URL=https://jsonplaceholder.typicode.com in .env to run them.
describe('GET /posts', () => {
  it('returns 200 and a list of posts', async () => {
    const res = await request.get('/posts');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('each post has the expected fields', async () => {
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
  it('creates a post and returns 201', async () => {
    const payload = { title: 'foo', body: 'bar', userId: 1 };

    const res = await request
      .post('/posts')
      .send(payload)
      .set('Content-Type', 'application/json');

    expect(res.status).toBe(201);
    expect(res.body).toEqual(expect.objectContaining(payload));
  });
});
