import supertest from 'supertest';
import { env } from '../config/env';

/**
 * Runs once before the whole test suite.
 * Pre-flight check: confirm the API is reachable before any test runs,
 * failing fast with a clear message instead of dozens of cryptic errors.
 */
export default async function globalSetup(): Promise<void> {
  const res = await supertest(env.baseURL).get('/pokemon?limit=1');

  if (res.status !== 200) {
    throw new Error(
      `Pre-flight check failed: GET ${env.baseURL}/pokemon?limit=1 ` +
        `returned ${res.status}. Is BASE_URL correct and the API up?`,
    );
  }

  console.log(`\n✓ API reachable at ${env.baseURL}\n`);
}
