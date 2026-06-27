import { assertContract } from '@api/assert-contract';
import { getAbilityByName } from '@api/routes/ability';
import { abilityDetailSchema } from '@api/schemas/ability.schema';
import { fetchAbility } from '@support/fixtures/ability';

describe('[FUNCTIONAL][ABILITY] GET /ability/{name|id}', () => {
  it('returns speed-boost with its canonical id', async () => {
    const res = await getAbilityByName('speed-boost');

    // 2xx GET: assertContract checks the status AND validates the schema.
    const speedBoost = assertContract(abilityDetailSchema, res);
    expect(speedBoost.id).toBe(3);
    expect(speedBoost.name).toBe('speed-boost');
  });

  it('resolves the same ability by name and by id', async () => {
    const byName = await fetchAbility('speed-boost'); // precondition: get the id
    const res = await getAbilityByName(byName.id);

    const speedBoost = assertContract(abilityDetailSchema, res);
    expect(speedBoost.name).toBe('speed-boost');
  });

  it('exposes the English effect entry and tagged pokemon', async () => {
    const res = await getAbilityByName('speed-boost');

    const speedBoost = assertContract(abilityDetailSchema, res);
    const english = speedBoost.effect_entries.find(
      (e) => e.language.name === 'en',
    );
    expect(english?.short_effect).toBe('Raises Speed one stage after each turn.');
    expect(speedBoost.pokemon.map((p) => p.pokemon.name)).toContain('ninjask');
  });

  it('returns 200 for a valid ability id (path identifier)', async () => {
    const res = await getAbilityByName(3);

    const speedBoost = assertContract(abilityDetailSchema, res);
    expect(speedBoost.name).toBe('speed-boost');
    expect(speedBoost.is_main_series).toBe(true);
  });
});
