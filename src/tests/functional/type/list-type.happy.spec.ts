import { assertContract } from '@api/assert-contract';
import { listTypes } from '@api/routes/type';
import { typeListSchema } from '@api/schemas/type.schema';

describe('[FUNCTIONAL][TYPE] GET /type (pagination)', () => {
  it('respects the limit parameter', async () => {
    const res = await listTypes({ limit: 5 });

    const page = assertContract(typeListSchema, res);
    expect(page.results).toHaveLength(5);
    expect(page.count).toBeGreaterThan(5);
  });

  it('paginates with all parameters (limit + offset)', async () => {
    // At least one happy-path test that passes ALL query parameters
    // from the curl with valid values.
    const firstRes = await listTypes({ limit: 5, offset: 0 });
    const secondRes = await listTypes({ limit: 5, offset: 5 });

    const first = assertContract(typeListSchema, firstRes);
    const second = assertContract(typeListSchema, secondRes);

    expect(first.results).toHaveLength(5);
    expect(second.results).toHaveLength(5);
    expect(first.results.map((t) => t.name)).not.toEqual(
      second.results.map((t) => t.name),
    );
    expect(first.previous).toBeNull();
    expect(second.previous).not.toBeNull();
  });
});
