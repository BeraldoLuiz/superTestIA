import type { Response } from 'supertest';
import { api } from '@support/http-client';

export interface ListTypesParams {
  limit?: number;
  offset?: number;
}

/**
 * GET /type — paginated list of type references.
 */
export async function listTypes(
  params: ListTypesParams = {},
): Promise<Response> {
  return api.get('/type').query(params);
}

/**
 * GET /type/{name|id} — type detail.
 */
export async function getTypeByName(
  nameOrId: string | number,
): Promise<Response> {
  return api.get(`/type/${nameOrId}`);
}
