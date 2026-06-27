import { assertContract } from '@api/assert-contract';
import { listPokemon } from '@api/routes/pokemon';
import { pokemonListSchema } from '@api/schemas/pokemon.schema';

/**
 * Required-ness of each GET input for the list endpoint. One explicit
 * assertion per field, documenting whether the request still succeeds when
 * the field is omitted.
 *
 * Inputs under test (from the curl `?limit=20&offset=40`):
 * - list query `limit`  — OPTIONAL (omitting it falls back to default 20).
 * - list query `offset` — OPTIONAL (omitting it defaults to 0).
 */
describe('[FUNCTIONAL][POKEMON] GET /pokemon required-ness per field', () => {
  it('list `limit` is OPTIONAL: omitting it returns the default page of 20', async () => {
    const res = await listPokemon({ offset: 0 });

    const page = assertContract(pokemonListSchema, res);
    expect(page.results).toHaveLength(20);
  });

  it('list `offset` is OPTIONAL: omitting it defaults to the first page', async () => {
    const res = await listPokemon({ limit: 5 });

    const page = assertContract(pokemonListSchema, res);
    // First page starts at the canonical first pokemon and has no previous link.
    expect(page.results[0].name).toBe('bulbasaur');
    expect(page.previous).toBeNull();
  });

  it('both `limit` and `offset` are OPTIONAL: omitting both still returns a valid list', async () => {
    const res = await listPokemon();

    const page = assertContract(pokemonListSchema, res);
    expect(page.results).toHaveLength(20);
    expect(page.count).toBeGreaterThan(0);
  });
});
