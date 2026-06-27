import { assertContract } from '@api/assert-contract';
import { listPokemon } from '@api/routes/pokemon';
import { pokemonListSchema } from '@api/schemas/pokemon.schema';

/**
 * Functional matrix for GET /pokemon (paginated list).
 *
 * Inputs under test: `limit` and `offset` query parameters.
 *
 * Observed behaviour (probed with curl) — the PokeAPI is lenient:
 * - both parameters are OPTIONAL; omitting them falls back to the
 *   defaults (limit=20, offset=0) and still returns 200;
 * - invalid values are silently coerced/ignored rather than rejected,
 *   so every variation below still returns 200.
 */
describe('[FUNCTIONAL][POKEMON] GET /pokemon', () => {
  describe('happy path (2xx)', () => {
    it('returns the requested page with limit and offset', async () => {
      const res = await listPokemon({ limit: 20, offset: 40 });

      expect(res.status).toBe(200);
      const data = assertContract(pokemonListSchema, res);

      expect(data.results).toHaveLength(20);
      // offset=40 means the page starts at the 41st pokemon (zubat).
      expect(data.results[0].name).toBe('zubat');
      expect(data.count).toBeGreaterThan(40);
      expect(data.previous).not.toBeNull();
      expect(data.next).not.toBeNull();
    });

    it('honours a different valid limit/offset combination', async () => {
      const res = await listPokemon({ limit: 5, offset: 0 });

      expect(res.status).toBe(200);
      const data = assertContract(pokemonListSchema, res);

      expect(data.results).toHaveLength(5);
      expect(data.results[0].name).toBe('bulbasaur');
      expect(data.previous).toBeNull();
    });

    it('passes ALL parameters with valid values', async () => {
      const res = await listPokemon({ limit: 20, offset: 40 });

      expect(res.status).toBe(200);
      const data = assertContract(pokemonListSchema, res);

      expect(data.results).toHaveLength(20);
      for (const item of data.results) {
        expect(typeof item.name).toBe('string');
        expect(item.url).toMatch(/\/api\/v2\/pokemon\/\d+\/$/);
      }
    });
  });

  describe('invalid data', () => {
    it('ignores a non-numeric limit and falls back to the default page size (200, lenient)', async () => {
      // FINDING: `limit=abc` is silently ignored; the API does not 4xx,
      // it returns the default page (20 items) with a 200.
      const res = await listPokemon({
        limit: 'abc' as unknown as number,
      });

      expect(res.status).toBe(200);
      const data = assertContract(pokemonListSchema, res);

      expect(data.results).toHaveLength(20);
    });

    it('treats limit=-1 as "no limit" and returns all remaining items (200, lenient)', async () => {
      // FINDING: a negative limit is not rejected. `limit=-1` returns
      // every remaining pokemon (count - 1) in a single 200 response.
      const res = await listPokemon({ limit: -1 });

      expect(res.status).toBe(200);
      const data = assertContract(pokemonListSchema, res);

      expect(data.results.length).toBe(data.count - 1);
      expect(data.next).toBeNull();
    });

    it('ignores a non-numeric offset and starts from the beginning (200, lenient)', async () => {
      // FINDING: `offset=xyz` is silently ignored; offset falls back to 0.
      const res = await listPokemon({
        offset: 'xyz' as unknown as number,
      });

      expect(res.status).toBe(200);
      const data = assertContract(pokemonListSchema, res);

      expect(data.results[0].name).toBe('bulbasaur');
    });

    it('returns an empty page (not a 4xx) when offset is past the end (200, lenient)', async () => {
      // FINDING: an out-of-range offset yields an empty results array
      // with a 200, never a 404/400.
      const res = await listPokemon({ offset: 100000 });

      expect(res.status).toBe(200);
      const data = assertContract(pokemonListSchema, res);

      expect(data.results).toHaveLength(0);
    });
  });

  describe('required-ness per input field', () => {
    it('limit is OPTIONAL — omitting it returns 200 with the default page size', async () => {
      const res = await listPokemon({ offset: 40 });

      expect(res.status).toBe(200);
      const data = assertContract(pokemonListSchema, res);

      // Default page size is 20 when limit is omitted.
      expect(data.results).toHaveLength(20);
    });

    it('offset is OPTIONAL — omitting it returns 200 starting from the first item', async () => {
      const res = await listPokemon({ limit: 20 });

      expect(res.status).toBe(200);
      const data = assertContract(pokemonListSchema, res);

      expect(data.results).toHaveLength(20);
      expect(data.results[0].name).toBe('bulbasaur');
      expect(data.previous).toBeNull();
    });

    it('both parameters OPTIONAL — no params returns 200 with the default page', async () => {
      const res = await listPokemon();

      expect(res.status).toBe(200);
      const data = assertContract(pokemonListSchema, res);

      expect(data.results).toHaveLength(20);
    });
  });
});
