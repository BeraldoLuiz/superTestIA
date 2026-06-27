import { assertContract } from '@api/assert-contract';
import { getPokemonByName } from '@api/routes/pokemon';
import { pokemonDetailSchema } from '@api/schemas/pokemon.schema';

describe('[CONTRACT][POKEMON] GET /pokemon/{name}', () => {
  it('matches the detail contract', async () => {
    const res = await getPokemonByName('ditto');

    const body = assertContract(pokemonDetailSchema, res);

    expect(body.name).toBe('ditto');
  });
});
