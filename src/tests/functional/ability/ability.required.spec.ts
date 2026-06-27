import { assertContract } from '@api/assert-contract';
import { listAbilities } from '@api/routes/ability';
import { abilityListSchema } from '@api/schemas/ability.schema';

/**
 * Required-ness of each GET input. One explicit assertion per field,
 * documenting whether the request still succeeds when the field is omitted.
 *
 * Inputs under test:
 * - detail path identifier `{name|id}` — REQUIRED (omitting it hits the
 *   list endpoint, not an ability detail; there is no detail without it).
 * - list query `limit`  — OPTIONAL (omitting it falls back to default 20).
 * - list query `offset` — OPTIONAL (omitting it defaults to 0).
 */
describe('[FUNCTIONAL][ABILITY] required-ness per field', () => {
  it('detail path identifier is REQUIRED: omitting it lists abilities instead of returning a single detail', async () => {
    // Omitting `{name|id}` resolves to GET /ability — a paginated list
    // (validated by the list schema), not a detail object (no `effect_entries`).
    const res = await listAbilities();

    const page = assertContract(abilityListSchema, res);
    expect(page.results.length).toBeGreaterThan(0);
    expect(res.body).not.toHaveProperty('effect_entries');
  });

  it('list `limit` is OPTIONAL: omitting it returns the default page', async () => {
    const res = await listAbilities({ offset: 0 });

    const page = assertContract(abilityListSchema, res);
    expect(page.results).toHaveLength(20);
  });

  it('list `offset` is OPTIONAL: omitting it defaults to the first page', async () => {
    const res = await listAbilities({ limit: 5 });

    const page = assertContract(abilityListSchema, res);
    expect(page.results[0].name).toBe('stench');
  });
});
