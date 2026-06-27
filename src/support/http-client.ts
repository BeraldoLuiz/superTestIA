import supertest from 'supertest';
import { env } from '@config/env';

/**
 * Shared SuperTest agent pointing at the API under test.
 *
 * Routes import this to perform HTTP calls. Tests and fixtures must NOT
 * import it directly — they go through the route layer.
 */
export const api = supertest(env.baseURL);
