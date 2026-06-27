import { getPokemonByName } from '@api/routes/pokemon';
import { pokemonDetailSchema } from '@api/schemas/pokemon.schema';
import { fetchPokemon } from '@support/fixtures/pokemon';

describe('[FUNCTIONAL][POKEMON] GET /pokemon/{name|id}', () => {
  it('returns ditto with its canonical id and type', async () => {
    const res = await getPokemonByName('ditto');

    expect(res.status).toBe(200);
    const ditto = pokemonDetailSchema.parse(res.body);
    expect(ditto.id).toBe(132);
    expect(ditto.types.map((t) => t.type.name)).toContain('normal');
  });

  it('resolves the same pokemon by name and by id', async () => {
    const byName = await fetchPokemon('pikachu'); // precondition: get the id
    const res = await getPokemonByName(byName.id);

    expect(res.status).toBe(200);
    expect(res.body.name).toBe('pikachu');
  });

  it('returns 404 for an unknown pokemon', async () => {
    const res = await getPokemonByName('not-a-real-pokemon');

    expect(res.status).toBe(404);
  });
});
