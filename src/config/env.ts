import 'dotenv/config';

/**
 * Environment configuration loaded from `.env`.
 * Add new variables here with a sensible default or a fail-fast check.
 */
function required(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;
  if (value === undefined || value === '') {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const env = {
  /** Base URL of the API under test (e.g. https://pokeapi.co/api/v2). */
  baseURL: required('BASE_URL', 'https://pokeapi.co/api/v2'),
} as const;
