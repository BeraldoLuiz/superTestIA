import type { Response } from 'supertest';
import type { z } from 'zod';

/**
 * Validates an HTTP response against a Zod schema and an expected status.
 *
 * - Asserts the status code first (clear failure when the request is wrong).
 * - Parses the body with the schema and returns the typed, validated data.
 * - Throws with a formatted error when the body does not match the contract.
 */
export function assertContract<T extends z.ZodTypeAny>(
  schema: T,
  response: Response,
  expectedStatus = 200,
): z.infer<T> {
  expect(response.status).toBe(expectedStatus);

  const result = schema.safeParse(response.body);
  if (!result.success) {
    throw new Error(
      `Contract validation failed (status ${response.status}):\n` +
        JSON.stringify(result.error.format(), null, 2),
    );
  }

  return result.data;
}
