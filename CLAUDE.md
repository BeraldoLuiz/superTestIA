# superTestIA — Project Conventions & Guard Rails

A study project for learning API test automation with **SuperTest + Jest + TypeScript + Zod**, testing the public **[PokeAPI](https://pokeapi.co/)** (read-only, no auth).

These rules are mandatory. When in doubt, follow the layering and the golden rule below.

## Language

- **Everything is in English**: code, comments, identifiers, test names, commit messages, docs.

## Tooling

- **Package manager: pnpm only.** Never use `npm` or `yarn`. Always commit `pnpm-lock.yaml`.
- **TypeScript, strict mode.** No `any` unless justified with a comment. No `// @ts-ignore` without a reason.
- **Test runner: Jest** with `ts-jest`. Test files end in `.spec.ts`.
- **Validation: Zod.** Every response shape is described by a Zod schema; types are derived with `z.infer`.
- Run `pnpm typecheck && pnpm lint && pnpm test` before committing.

## Architecture

```
src/
  api/
    assert-contract.ts   # assertContract(schema, response, status?) — status + body via Zod
    routes/              # HTTP abstractions (SuperTest), 1 file per resource → return Response
    schemas/             # Zod schemas + derived types (z.infer)
  support/
    http-client.ts       # shared SuperTest agent (BASE_URL)
    fixtures/            # build/read helpers that call routes; return typed data
  config/env.ts          # loads .env (BASE_URL, …)
  setup/global-setup.ts  # pre-flight reachability check
  tests/
    functional/          # behaviour tests, organized by resource
    contract/            # shape/contract tests, organized by resource
```

Path aliases: `@api/*`, `@support/*`, `@config/*`.

## Golden rule — dependency direction

```
tests  ──▶  fixtures  ──▶  routes  ──▶  HTTP (SuperTest)
   │                          ▲
   └──────────▶  schemas ─────┘   (via assertContract)
```

- **routes** perform HTTP via the shared client and return the raw `Response`. They never know about fixtures or tests.
- **fixtures** call routes, build payloads (e.g. with faker), throw on unexpected failures, and return typed data.
- **tests** call routes (raw response) and/or fixtures (typed result), and validate via **schemas** + `assertContract`.
- **Never invert**: a route must not import a fixture; a schema must never perform HTTP.

## Naming & organization

- One resource per file in `routes/` and `schemas/` (e.g. `pokemon.ts`, `pokemon.schema.ts`).
- Tests organized by resource folder. Prefix `describe` blocks with tags: `[FUNCTIONAL][POKEMON]`, `[CONTRACT][POKEMON]`.
- Route functions are verbs: `getPokemonByName()`, `listPokemon()`.

## Test design (every resource)

Treat the GET inputs (path identifier + each query parameter) as the fields under test. Always assert the **real, observed** behaviour — probe with curl first; this API is lenient and may ignore invalid params instead of returning 4xx.

**Every test asserts the HTTP status code.** Beyond that, the verifications depend on the method:

- **GET → 2xx:** assert the status **and** validate the body schema. Use `assertContract(schema, res)` — it does both in one call (asserts the status, validates the body via Zod) and returns typed data. Every 2xx GET response, in any test category, goes through it.
- **GET → non-2xx (e.g. 404):** assert the status explicitly with `expect(res.status).toBe(...)`. Error bodies have no resource schema, so no schema check.
- **POST / PUT** (only when a mutable API is configured — never against PokeAPI, which is read-only): assert the status code, assert the **message returned in the response body**, and on the happy path issue a follow-up **GET to confirm the change was actually persisted**.

Fixtures provide preconditions/typed data (e.g. fetch an id for a follow-up call); the test still asserts the status of the call under test — never rely solely on a fixture's internal check.

- **Contract (shape):** validate the 2xx response against the Zod schema via `assertContract`. The schema enforces each response field's obligation — required fields declared, optional/nullable marked as such from observed data.
- **Happy path (2xx):** several valid variations, including at least one test that passes **all** parameters with valid values.
- **Invalid data:** at least one test sending invalid values (wrong type, out-of-range, malformed/unknown identifier), asserting the actual outcome.
- **Required-ness per field:** for each input, a variation that omits it and asserts whether it is required or optional — one explicit assertion per field.

## Safety

- **Never commit secrets or `.env`.** Only `.env.example` is tracked.
- PokeAPI is **read-only**: do not add mutating tests (POST/PUT/DELETE) until an API that supports them is configured. Route helpers may stay verb-generic, but no mutation tests against read-only or production APIs.
- No hardcoded base URLs in tests — always go through `@config/env`.

## Scope

This is a learning project. Prefer clarity over cleverness; small, readable tests that teach the pattern over exhaustive coverage.
