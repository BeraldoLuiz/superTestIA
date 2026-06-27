import { getAbilityByName, listAbilities } from '@api/routes/ability';
import type { ListAbilitiesParams } from '@api/routes/ability';
import {
  abilityDetailSchema,
  abilityListSchema,
} from '@api/schemas/ability.schema';
import type {
  AbilityDetail,
  AbilityList,
} from '@api/schemas/ability.schema';

/**
 * Fetch an ability and return it as validated, typed data.
 * Throws on an unexpected status or a shape mismatch — fixtures hide
 * transport details so tests can focus on behaviour.
 */
export async function fetchAbility(
  nameOrId: string | number,
): Promise<AbilityDetail> {
  const res = await getAbilityByName(nameOrId);
  if (res.status !== 200) {
    throw new Error(
      `Expected 200 fetching ability "${nameOrId}", got ${res.status}`,
    );
  }
  return abilityDetailSchema.parse(res.body);
}

/**
 * Fetch a page of abilities and return it as validated, typed data.
 */
export async function fetchAbilityList(
  params: ListAbilitiesParams = {},
): Promise<AbilityList> {
  const res = await listAbilities(params);
  if (res.status !== 200) {
    throw new Error(`Expected 200 listing abilities, got ${res.status}`);
  }
  return abilityListSchema.parse(res.body);
}
