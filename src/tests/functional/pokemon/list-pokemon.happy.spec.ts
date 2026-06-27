import { assertContract } from '@api/assert-contract';
import { listPokemon } from '@api/routes/pokemon';
import { pokemonListSchema } from '@api/schemas/pokemon.schema';

describe('[FUNCTIONAL][POKEMON] GET /pokemon (pagination, happy path)', () => {
  it('respects the limit parameter', async () => {
    const res = await listPokemon({ limit: 5 });

    const page = assertContract(pokemonListSchema, res);
    expect(page.results).toHaveLength(5);
    expect(page.count).toBeGreaterThan(5);
  });

  it('paginates with ALL parameters from the curl (limit=20, offset=40)', async () => {
    // At least one happy-path test that passes ALL query parameters
    // from the curl with valid values.
    const res = await listPokemon({ limit: 20, offset: 40 });

    const page = assertContract(pokemonListSchema, res);
    expect(page.results).toHaveLength(20);
    // Stable window: offset 40 starts at "zubat" and ends at "poliwag".
    expect(page.results[0].name).toBe('zubat');
    expect(page.results[page.results.length - 1].name).toBe('poliwag');
    // Within the collection, so both navigation links are present.
    expect(page.next).not.toBeNull();
    expect(page.previous).not.toBeNull();
  });

  it('offset shifts the window without overlap', async () => {
    const firstRes = await listPokemon({ limit: 5, offset: 0 });
    const secondRes = await listPokemon({ limit: 5, offset: 5 });

    const first = assertContract(pokemonListSchema, firstRes);
    const second = assertContract(pokemonListSchema, secondRes);

    expect(first.results.map((p) => p.name)).not.toEqual(
      second.results.map((p) => p.name),
    );
    expect(first.previous).toBeNull();
    expect(second.previous).not.toBeNull();
  });
});
