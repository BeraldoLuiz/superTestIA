import { getPokemonByName } from '@api/routes/pokemon';
import { fetchPokemon } from '@support/fixtures/pokemon';

describe('[FUNCTIONAL][POKEMON] GET /pokemon/{name|id}', () => {
  it('returns ditto with its canonical id and type', async () => {
    const ditto = await fetchPokemon('ditto');

    expect(ditto.id).toBe(132);
    expect(ditto.types.map((t) => t.type.name)).toContain('normal');
  });

  it('resolves the same pokemon by name and by id', async () => {
    const byName = await fetchPokemon('pikachu');
    const byId = await fetchPokemon(byName.id);

    expect(byId.name).toBe('pikachu');
  });

  it('returns 404 for an unknown pokemon', async () => {
    const res = await getPokemonByName('not-a-real-pokemon');

    expect(res.status).toBe(404);
  });
});
