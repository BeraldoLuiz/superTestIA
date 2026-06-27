import { assertContract } from '@api/assert-contract';
import { getTypeByName, listTypes } from '@api/routes/type';
import { typeListSchema } from '@api/schemas/type.schema';

describe('[FUNCTIONAL][TYPE] invalid data', () => {
  it('returns 404 for an unknown type name (detail path identifier)', async () => {
    const res = await getTypeByName('not-a-real-type');

    expect(res.status).toBe(404);
    // PokeAPI errors are text/plain, so the body lands in `res.text`.
    expect(res.text).toBe('Not Found');
  });

  it('returns 404 for an out-of-range numeric id', async () => {
    const res = await getTypeByName(99999);

    expect(res.status).toBe(404);
    expect(res.text).toBe('Not Found');
  });

  it('returns 404 for a non-positive id (0)', async () => {
    const res = await getTypeByName(0);

    expect(res.status).toBe(404);
    expect(res.text).toBe('Not Found');
  });

  it('ignores a non-numeric limit and falls back to the default page (lenient API)', async () => {
    // LENIENCY: `limit=abc` is silently ignored — the API returns 200 with
    // the default page size (20) rather than a 4xx. Still a valid list body.
    const res = await listTypes({ limit: 'abc' as unknown as number });

    const page = assertContract(typeListSchema, res);
    expect(page.results).toHaveLength(20);
  });

  it('ignores a negative limit and falls back to the default page (lenient API)', async () => {
    // LENIENCY: `limit=-1` is silently ignored — the API returns 200 with
    // the default page size (20) rather than a 4xx. Still a valid list body.
    const res = await listTypes({ limit: -1 });

    const page = assertContract(typeListSchema, res);
    expect(page.results).toHaveLength(20);
  });

  it('returns 200 with an empty result set for an out-of-range offset (lenient API)', async () => {
    // LENIENCY: an offset past the end yields 200 with `results: []`, not a 4xx.
    const res = await listTypes({ offset: 9999 });

    const page = assertContract(typeListSchema, res);
    expect(page.results).toHaveLength(0);
  });
});
