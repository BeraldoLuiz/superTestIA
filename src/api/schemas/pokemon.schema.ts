import { z } from 'zod';
import {
  namedApiResource,
  paginatedResponse,
} from './api-response.schema';

/**
 * GET /pokemon — paginated list of `{ name, url }` references.
 */
export const pokemonListSchema = paginatedResponse(namedApiResource);
export type PokemonList = z.infer<typeof pokemonListSchema>;

const pokemonTypeSlot = z.object({
  slot: z.number().int(),
  type: namedApiResource,
});

const pokemonAbilitySlot = z.object({
  ability: namedApiResource,
  is_hidden: z.boolean(),
  slot: z.number().int(),
});

const pokemonStat = z.object({
  base_stat: z.number().int(),
  effort: z.number().int(),
  stat: namedApiResource,
});

const pokemonSprites = z.object({
  front_default: z.url().nullable(),
});

/**
 * GET /pokemon/{name|id} — detail. Only the fields we assert on are
 * declared; unknown fields are stripped (Zod default), which is fine
 * for a contract test of the shape we care about.
 */
export const pokemonDetailSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1),
  height: z.number().int().nonnegative(),
  weight: z.number().int().nonnegative(),
  base_experience: z.number().int().nullable(),
  is_default: z.boolean(),
  order: z.number().int(),
  types: z.array(pokemonTypeSlot).min(1),
  abilities: z.array(pokemonAbilitySlot).min(1),
  stats: z.array(pokemonStat).min(1),
  species: namedApiResource,
  sprites: pokemonSprites,
});
export type PokemonDetail = z.infer<typeof pokemonDetailSchema>;
