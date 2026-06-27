import type { Response } from 'supertest';
import { api } from '@support/http-client';

export interface ListAbilitiesParams {
  limit?: number;
  offset?: number;
}

/**
 * GET /ability — paginated list of ability references.
 */
export async function listAbilities(
  params: ListAbilitiesParams = {},
): Promise<Response> {
  return api.get('/ability').query(params);
}

/**
 * GET /ability/{name|id} — ability detail.
 */
export async function getAbilityByName(
  nameOrId: string | number,
): Promise<Response> {
  return api.get(`/ability/${nameOrId}`);
}
