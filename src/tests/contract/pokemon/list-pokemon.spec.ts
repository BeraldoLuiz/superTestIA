import { assertContract } from '@api/assert-contract';
import { listPokemon } from '@api/routes/pokemon';
import { pokemonListSchema } from '@api/schemas/pokemon.schema';

describe('[CONTRACT][POKEMON] GET /pokemon', () => {
  it('matches the paginated list contract', async () => {
    const res = await listPokemon({ limit: 20, offset: 40 });

    const body = assertContract(pokemonListSchema, res);

    expect(body.results).toHaveLength(20);
  });
});
