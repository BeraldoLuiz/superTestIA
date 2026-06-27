import { assertContract } from '@api/assert-contract';
import { getPokemonByName } from '@api/routes/pokemon';
import { pokemonDetailSchema } from '@api/schemas/pokemon.schema';
import { fetchPokemon } from '@support/fixtures/pokemon';

describe('[FUNCTIONAL][POKEMON] GET /pokemon/{name|id}', () => {
  it('returns ditto with its canonical id and type', async () => {
    const res = await getPokemonByName('ditto');

    // 2xx GET: assertContract checks the status AND validates the schema.
    const ditto = assertContract(pokemonDetailSchema, res);
    expect(ditto.id).toBe(132);
    expect(ditto.types.map((t) => t.type.name)).toContain('normal');
  });

  it('resolves the same pokemon by name and by id', async () => {
    const byName = await fetchPokemon('pikachu'); // precondition: get the id
    const res = await getPokemonByName(byName.id);

    const pikachu = assertContract(pokemonDetailSchema, res);
    expect(pikachu.name).toBe('pikachu');
  });

  it('returns 404 for an unknown pokemon', async () => {
    const res = await getPokemonByName('not-a-real-pokemon');

    expect(res.status).toBe(404);
    // PokeAPI errors are text/plain, so the body lands in `res.text`.
    expect(res.text).toBe('Not Found');
  });
});
