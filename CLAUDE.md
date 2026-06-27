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

## Safety

- **Never commit secrets or `.env`.** Only `.env.example` is tracked.
- PokeAPI is **read-only**: do not add mutating tests (POST/PUT/DELETE) until an API that supports them is configured. Route helpers may stay verb-generic, but no mutation tests against read-only or production APIs.
- No hardcoded base URLs in tests — always go through `@config/env`.

## Scope

This is a learning project. Prefer clarity over cleverness; small, readable tests that teach the pattern over exhaustive coverage.
