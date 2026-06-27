import { fetchTypeList } from '@support/fixtures/type';

describe('[FUNCTIONAL][TYPE] GET /type (pagination)', () => {
  it('respects the limit parameter', async () => {
    const page = await fetchTypeList({ limit: 5 });

    expect(page.results).toHaveLength(5);
    expect(page.count).toBeGreaterThan(5);
  });

  it('paginates with all parameters (limit + offset)', async () => {
    // At least one happy-path test that passes ALL query parameters
    // from the curl with valid values.
    const first = await fetchTypeList({ limit: 5, offset: 0 });
    const second = await fetchTypeList({ limit: 5, offset: 5 });

    const firstNames = first.results.map((t) => t.name);
    const secondNames = second.results.map((t) => t.name);

    expect(first.results).toHaveLength(5);
    expect(second.results).toHaveLength(5);
    expect(firstNames).not.toEqual(secondNames);
    expect(first.previous).toBeNull();
    expect(second.previous).not.toBeNull();
  });
});
