import { getPokemonByName, listPokemon } from '@api/routes/pokemon';
import type { ListPokemonParams } from '@api/routes/pokemon';
import {
  pokemonDetailSchema,
  pokemonListSchema,
} from '@api/schemas/pokemon.schema';
import type { PokemonDetail, PokemonList } from '@api/schemas/pokemon.schema';

/**
 * Fetch a pokemon and return it as validated, typed data.
 * Throws on an unexpected status or a shape mismatch — fixtures hide
 * transport details so tests can focus on behaviour.
 */
export async function fetchPokemon(
  nameOrId: string | number,
): Promise<PokemonDetail> {
  const res = await getPokemonByName(nameOrId);
  if (res.status !== 200) {
    throw new Error(
      `Expected 200 fetching pokemon "${nameOrId}", got ${res.status}`,
    );
  }
  return pokemonDetailSchema.parse(res.body);
}

/**
 * Fetch a page of pokemon and return it as validated, typed data.
 */
export async function fetchPokemonList(
  params: ListPokemonParams = {},
): Promise<PokemonList> {
  const res = await listPokemon(params);
  if (res.status !== 200) {
    throw new Error(`Expected 200 listing pokemon, got ${res.status}`);
  }
  return pokemonListSchema.parse(res.body);
}
