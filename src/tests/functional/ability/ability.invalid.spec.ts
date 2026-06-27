import { assertContract } from '@api/assert-contract';
import { getAbilityByName, listAbilities } from '@api/routes/ability';
import { abilityListSchema } from '@api/schemas/ability.schema';

describe('[FUNCTIONAL][ABILITY] invalid data', () => {
  it('returns 404 for an unknown ability name (detail path identifier)', async () => {
    const res = await getAbilityByName('not-a-real-ability');

    expect(res.status).toBe(404);
    // PokeAPI errors are text/plain, so the body lands in `res.text`.
    expect(res.text).toBe('Not Found');
  });

  it('returns 404 for an out-of-range numeric id', async () => {
    const res = await getAbilityByName(99999);

    expect(res.status).toBe(404);
    expect(res.text).toBe('Not Found');
  });

  it('returns 404 for a non-positive id (0)', async () => {
    const res = await getAbilityByName(0);

    expect(res.status).toBe(404);
    expect(res.text).toBe('Not Found');
  });

  it('ignores a non-numeric limit and falls back to the default page (lenient API)', async () => {
    // LENIENCY: `limit=abc` is silently ignored — the API returns 200 with
    // the default page size (20) rather than a 4xx. Still a valid list body.
    const res = await listAbilities({ limit: 'abc' as unknown as number });

    const page = assertContract(abilityListSchema, res);
    expect(page.results).toHaveLength(20);
  });

  it('treats a negative limit as "all remaining" rather than rejecting it (lenient API)', async () => {
    // LENIENCY: unlike a strict API, `limit=-1` is NOT a 4xx. The API returns
    // 200 and serves every remaining record (count - 1), not the default page.
    const res = await listAbilities({ limit: -1 });

    const page = assertContract(abilityListSchema, res);
    expect(page.results).toHaveLength(page.count - 1);
  });

  it('returns 200 with an empty result set for an out-of-range offset (lenient API)', async () => {
    // LENIENCY: an offset past the end yields 200 with `results: []`, not a 4xx.
    const res = await listAbilities({ offset: 9999 });

    const page = assertContract(abilityListSchema, res);
    expect(page.results).toHaveLength(0);
  });
});
