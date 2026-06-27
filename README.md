# superTestIA

A study project for learning **API test automation** with SuperTest + Jest + TypeScript + Zod, testing the public **[PokeAPI](https://pokeapi.co/)** (read-only, no auth).

> Project conventions and guard rails live in [`CLAUDE.md`](./CLAUDE.md).

## Setup

```bash
pnpm install
cp .env.example .env   # BASE_URL defaults to https://pokeapi.co/api/v2
```

## Scripts

```bash
pnpm test              # run all tests
pnpm test:functional   # functional tests only
pnpm test:contract     # contract tests only
pnpm test:watch        # watch mode

pnpm typecheck         # tsc --noEmit
pnpm lint              # eslint
pnpm format            # prettier --write
```

## Architecture

```
src/
  api/
    assert-contract.ts   # validate status + body against a Zod schema
    routes/              # HTTP abstractions (SuperTest), 1 file per resource
    schemas/             # Zod schemas + derived types
  support/
    http-client.ts       # shared SuperTest agent
    fixtures/            # build/read helpers that call routes
  config/env.ts          # loads .env
  setup/global-setup.ts  # pre-flight reachability check
  tests/
    functional/          # behaviour tests by resource
    contract/            # shape/contract tests by resource
```

### Dependency direction (golden rule)

```
tests  ──▶  fixtures  ──▶  routes  ──▶  HTTP (SuperTest)
   │                          ▲
   └──────────▶  schemas ─────┘   (via assertContract)
```

Routes do HTTP and return the raw response; fixtures call routes and return typed data; tests validate via schemas. Never invert. See [`CLAUDE.md`](./CLAUDE.md) for the full rules.
