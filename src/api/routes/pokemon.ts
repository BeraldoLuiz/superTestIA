import type { Response } from 'supertest';
import { api } from '@support/http-client';

export interface ListPokemonParams {
  limit?: number;
  offset?: number;
}

/**
 * GET /pokemon — paginated list of pokemon references.
 */
export async function listPokemon(
  params: ListPokemonParams = {},
): Promise<Response> {
  return api.get('/pokemon').query(params);
}

/**
 * GET /pokemon/{name|id} — pokemon detail.
 */
export async function getPokemonByName(
  nameOrId: string | number,
): Promise<Response> {
  return api.get(`/pokemon/${nameOrId}`);
}
