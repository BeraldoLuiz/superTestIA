import { z } from 'zod';

/**
 * A reference to another resource, as returned by the PokeAPI
 * (`{ name, url }`). Used across list endpoints.
 */
export const namedApiResource = z.object({
  name: z.string(),
  url: z.url(),
});
export type NamedApiResource = z.infer<typeof namedApiResource>;

/**
 * Wraps an item schema in the PokeAPI pagination envelope:
 * `{ count, next, previous, results: T[] }`.
 */
export function paginatedResponse<T extends z.ZodTypeAny>(item: T) {
  return z.object({
    count: z.number().int().nonnegative(),
    next: z.url().nullable(),
    previous: z.url().nullable(),
    results: z.array(item),
  });
}
