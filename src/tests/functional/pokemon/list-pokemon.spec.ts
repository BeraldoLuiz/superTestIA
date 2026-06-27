import { listPokemon } from '@api/routes/pokemon';
import { pokemonListSchema } from '@api/schemas/pokemon.schema';

describe('[FUNCTIONAL][POKEMON] GET /pokemon (pagination)', () => {
  it('respects the limit parameter', async () => {
    const res = await listPokemon({ limit: 10 });

    expect(res.status).toBe(200);
    const page = pokemonListSchema.parse(res.body);
    expect(page.results).toHaveLength(10);
    expect(page.count).toBeGreaterThan(10);
  });

  it('paginates with offset (no overlap between pages)', async () => {
    const firstRes = await listPokemon({ limit: 5, offset: 0 });
    const secondRes = await listPokemon({ limit: 5, offset: 5 });

    expect(firstRes.status).toBe(200);
    expect(secondRes.status).toBe(200);
    const first = pokemonListSchema.parse(firstRes.body);
    const second = pokemonListSchema.parse(secondRes.body);

    expect(first.results.map((p) => p.name)).not.toEqual(
      second.results.map((p) => p.name),
    );
    expect(first.previous).toBeNull();
    expect(second.previous).not.toBeNull();
  });
});
