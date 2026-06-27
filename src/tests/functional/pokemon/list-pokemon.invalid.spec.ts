import { assertContract } from '@api/assert-contract';
import { listPokemon } from '@api/routes/pokemon';
import { pokemonListSchema } from '@api/schemas/pokemon.schema';

describe('[FUNCTIONAL][POKEMON] GET /pokemon invalid data', () => {
  it('ignores a non-numeric limit and falls back to the default page (lenient API)', async () => {
    // LENIENCY: `limit=abc` is silently ignored — the API returns 200 with
    // the default page size (20) rather than a 4xx. Still a valid list body.
    const res = await listPokemon({ limit: 'abc' as unknown as number });

    const page = assertContract(pokemonListSchema, res);
    expect(page.results).toHaveLength(20);
  });

  it('treats a negative limit as "all remaining" rather than rejecting it (lenient API)', async () => {
    // LENIENCY: `limit=-1` is NOT a 4xx. The API returns 200 and serves every
    // remaining record (count - 1), not the default page of 20.
    const res = await listPokemon({ limit: -1 });

    const page = assertContract(pokemonListSchema, res);
    expect(page.results).toHaveLength(page.count - 1);
  });

  it('returns 200 with an empty result set for an out-of-range offset (lenient API)', async () => {
    // LENIENCY: an offset past the end yields 200 with `results: []` and a null
    // `next`, not a 4xx.
    const res = await listPokemon({ offset: 999999 });

    const page = assertContract(pokemonListSchema, res);
    expect(page.results).toHaveLength(0);
    expect(page.next).toBeNull();
  });
});
