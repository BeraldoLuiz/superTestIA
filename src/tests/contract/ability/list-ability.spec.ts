import { assertContract } from '@api/assert-contract';
import { listAbilities } from '@api/routes/ability';
import { abilityListSchema } from '@api/schemas/ability.schema';

describe('[CONTRACT][ABILITY] GET /ability', () => {
  it('matches the paginated list contract', async () => {
    const res = await listAbilities({ limit: 5 });

    const body = assertContract(abilityListSchema, res);

    expect(body.results).toHaveLength(5);
  });
});
