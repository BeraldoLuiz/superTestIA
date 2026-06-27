import { assertContract } from '@api/assert-contract';
import { listAbilities } from '@api/routes/ability';
import { abilityListSchema } from '@api/schemas/ability.schema';

describe('[FUNCTIONAL][ABILITY] GET /ability (pagination)', () => {
  it('respects the limit parameter', async () => {
    const res = await listAbilities({ limit: 5 });

    const page = assertContract(abilityListSchema, res);
    expect(page.results).toHaveLength(5);
    expect(page.count).toBeGreaterThan(5);
  });

  it('paginates with all parameters (limit + offset)', async () => {
    // At least one happy-path test that passes ALL query parameters
    // from the curl with valid values.
    const firstRes = await listAbilities({ limit: 5, offset: 0 });
    const secondRes = await listAbilities({ limit: 5, offset: 5 });

    const first = assertContract(abilityListSchema, firstRes);
    const second = assertContract(abilityListSchema, secondRes);

    expect(first.results).toHaveLength(5);
    expect(second.results).toHaveLength(5);
    expect(first.results.map((a) => a.name)).not.toEqual(
      second.results.map((a) => a.name),
    );
    expect(first.previous).toBeNull();
    expect(second.previous).not.toBeNull();
  });
});
