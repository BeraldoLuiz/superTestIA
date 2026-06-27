import { z } from 'zod';
import {
  namedApiResource,
  paginatedResponse,
} from './api-response.schema';

/**
 * GET /type — paginated list of `{ name, url }` references.
 */
export const typeListSchema = paginatedResponse(namedApiResource);
export type TypeList = z.infer<typeof typeListSchema>;

/**
 * Damage relations: each key is a list of `{ name, url }` type references.
 * The live data shows every list is always present (possibly empty).
 */
const typeDamageRelations = z.object({
  double_damage_from: z.array(namedApiResource),
  double_damage_to: z.array(namedApiResource),
  half_damage_from: z.array(namedApiResource),
  half_damage_to: z.array(namedApiResource),
  no_damage_from: z.array(namedApiResource),
  no_damage_to: z.array(namedApiResource),
});

const typeGameIndex = z.object({
  game_index: z.number().int(),
  generation: namedApiResource,
});

const typePokemonSlot = z.object({
  slot: z.number().int(),
  pokemon: namedApiResource,
});

const typeName = z.object({
  language: namedApiResource,
  name: z.string(),
});

/**
 * GET /type/{name|id} — detail. Only the fields we assert on are
 * declared; unknown fields are stripped (Zod default), which is fine
 * for a contract test of the shape we care about.
 */
export const typeDetailSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1),
  // `move_damage_class` is null for several types (e.g. fairy, shadow).
  move_damage_class: namedApiResource.nullable(),
  generation: namedApiResource,
  damage_relations: typeDamageRelations,
  // These arrays can legitimately be empty (e.g. the `shadow` type has no
  // pokemon and no game_indices), so they are not `.min(1)`.
  game_indices: z.array(typeGameIndex),
  pokemon: z.array(typePokemonSlot),
  moves: z.array(namedApiResource),
  names: z.array(typeName),
});
export type TypeDetail = z.infer<typeof typeDetailSchema>;
