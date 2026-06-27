import { fetchPokemonList } from '@support/fixtures/pokemon';

describe('[FUNCTIONAL][POKEMON] GET /pokemon (pagination)', () => {
  it('respects the limit parameter', async () => {
    const page = await fetchPokemonList({ limit: 10 });

    expect(page.results).toHaveLength(10);
    expect(page.count).toBeGreaterThan(10);
  });

  it('paginates with offset (no overlap between pages)', async () => {
    const first = await fetchPokemonList({ limit: 5, offset: 0 });
    const second = await fetchPokemonList({ limit: 5, offset: 5 });

    const firstNames = first.results.map((p) => p.name);
    const secondNames = second.results.map((p) => p.name);

    expect(firstNames).not.toEqual(secondNames);
    expect(first.previous).toBeNull();
    expect(second.previous).not.toBeNull();
  });
});
