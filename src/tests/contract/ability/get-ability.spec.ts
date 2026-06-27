import { assertContract } from '@api/assert-contract';
import { getAbilityByName } from '@api/routes/ability';
import { abilityDetailSchema } from '@api/schemas/ability.schema';

describe('[CONTRACT][ABILITY] GET /ability/{name}', () => {
  it('matches the detail contract', async () => {
    const res = await getAbilityByName('speed-boost');

    const body = assertContract(abilityDetailSchema, res);

    expect(body.name).toBe('speed-boost');
  });

  it('matches the contract when effect_changes is empty', async () => {
    // `speed-boost` has an empty `effect_changes` array — exercises the
    // can-be-empty list so a wrongly `.min(1)` schema would fail here.
    const res = await getAbilityByName('speed-boost');

    const body = assertContract(abilityDetailSchema, res);

    expect(body.effect_changes).toHaveLength(0);
  });
});
