import { getTypeByName, listTypes } from '@api/routes/type';
import type { ListTypesParams } from '@api/routes/type';
import {
  typeDetailSchema,
  typeListSchema,
} from '@api/schemas/type.schema';
import type { TypeDetail, TypeList } from '@api/schemas/type.schema';

/**
 * Fetch a type and return it as validated, typed data.
 * Throws on an unexpected status or a shape mismatch — fixtures hide
 * transport details so tests can focus on behaviour.
 */
export async function fetchType(
  nameOrId: string | number,
): Promise<TypeDetail> {
  const res = await getTypeByName(nameOrId);
  if (res.status !== 200) {
    throw new Error(
      `Expected 200 fetching type "${nameOrId}", got ${res.status}`,
    );
  }
  return typeDetailSchema.parse(res.body);
}

/**
 * Fetch a page of types and return it as validated, typed data.
 */
export async function fetchTypeList(
  params: ListTypesParams = {},
): Promise<TypeList> {
  const res = await listTypes(params);
  if (res.status !== 200) {
    throw new Error(`Expected 200 listing types, got ${res.status}`);
  }
  return typeListSchema.parse(res.body);
}
