import { z } from 'zod';
import {
  namedApiResource,
  paginatedResponse,
} from './api-response.schema';

/**
 * GET /ability — paginated list of `{ name, url }` references.
 */
export const abilityListSchema = paginatedResponse(namedApiResource);
export type AbilityList = z.infer<typeof abilityListSchema>;

/**
 * Localized effect text for an ability. The live data always carries the
 * three fields below for every entry.
 */
const abilityEffect = z.object({
  effect: z.string(),
  short_effect: z.string(),
  language: namedApiResource,
});

/**
 * A localized flavor-text entry tied to a version group.
 */
const abilityFlavorText = z.object({
  flavor_text: z.string(),
  language: namedApiResource,
  version_group: namedApiResource,
});

const abilityName = z.object({
  language: namedApiResource,
  name: z.string(),
});

const abilityPokemon = z.object({
  is_hidden: z.boolean(),
  slot: z.number().int(),
  pokemon: namedApiResource,
});

/**
 * GET /ability/{name|id} — detail. Only the fields we assert on are
 * declared; unknown fields are stripped (Zod default), which is fine
 * for a contract test of the shape we care about.
 */
export const abilityDetailSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1),
  is_main_series: z.boolean(),
  generation: namedApiResource,
  // `effect_changes` can legitimately be empty (e.g. `speed-boost` has none),
  // so it is not `.min(1)`.
  effect_changes: z.array(z.unknown()),
  effect_entries: z.array(abilityEffect),
  flavor_text_entries: z.array(abilityFlavorText),
  names: z.array(abilityName),
  pokemon: z.array(abilityPokemon),
});
export type AbilityDetail = z.infer<typeof abilityDetailSchema>;
