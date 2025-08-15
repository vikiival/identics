# identics

[Squid](https://docs.subsquid.io) based data used to index, process, and query
on top of Polkadot Relay Chain and People chain for identities

## Hosted Squids

- Polkadot x People Processor (Statemint -> DOT): 🚧 Coming soon 🚧

## Project structure

- `src/generated` - model/server definitions created by `codegen`. Do not alter
  the contents of this directory manually.
- `src/server-extension` - module with custom `type-graphql` based resolvers.
- `src/types` - data type definitions for chain events and extrinsics created by
  `typegen`.
- `src/mappings` - mapping module.
- `lib` - compiled js files. The structure of this directory must reflect `src`.
- `.env` - environment variables defined here or supplied by a shell.

## Prerequisites

- Node 18.x
- Docker
- npm
- [just](https://github.com/casey/just)

## Quickly running the sample

```bash
# 1. Install dependencies
npm ci

# 2. Build project
just build

# 3. Start target Postgres database container
just upd

# 4. Update database with data objects
just migrate

# 5. Start the processor
just process

# 6. Open a separate terminal and launch the graphql server to query the processed data
just serve

# 7. Visit localhost:4350/graphql to see the result
```

## Dev flow

### 1. Define database schema

Start development by defining the schema of the target database via
`schema.graphql`. Schema definition consists of regular graphql type
declarations annotated with custom directives. A full description of
`schema.graphql` dialect is available
[here](https://docs.subsquid.io/schema-file).

### 2. Generate TypeORM classes

Mapping developers use [TypeORM](https://typeorm.io) entities to interact with
the target database during data processing. The squid framework generates All
necessary entity classes from `schema.graphql`. This is done by running
`just codegen` command.

### 3. Generate database migration

All database changes are applied through migration files located at
`db/migrations`. `squid-typeorm-migration` tool provides several commands to
drive the process. It is all [TypeORM](https://typeorm.io/#/migrations) under
the hood.

```bash
# Connect to the database, analyze its state, and generate a migration to match the target schema.
# Launch Docker instance of the database
just upd

# The target schema is derived from entity classes generated earlier.
# Remember to compile your entity classes beforehand!
just update-db

# Apply database migrations from `db/migrations`
just migrate

# Revert the last performed migration
just revert-db
```

Available `sqd` shortcuts:

```bash
# Build the project, remove any old migrations, then run `npx squid-typeorm-migration generate`
sqd migration:generate

# Run npx squid-typeorm-migration apply
sqd migration:apply
```

### API

There are two ways to use the API:

1. **REST API**: The API exposes a RESTful interface for interacting with the
   indexer. You can use standard HTTP methods (GET, POST, etc.) to query and
   manipulate data.

```bash
npm start
```

> [!NOTE] Server is running on http://localhost:3000


Identity APIs:

GET /identity/:account - Get complete identity by account address
GET /identities/judgement/:status - Get identities by judgement status
GET /identities/registrar/:registrarId - Get identities by registrar
GET /identities/field/:field - Get identities with specific field verified
GET /identities/verification/:status - Get identities by verification status
Sub-account APIs:

GET /subs/:account - Get sub-accounts for main identity
GET /subs/name/:pattern - Get sub-accounts by name pattern
GET /super/:subAccount - Get main identity for sub-account
Username APIs:

GET /username/:account - Get primary username for account
GET /account/username/:username - Get account by username
GET /usernames/authority/:authority - Get usernames by authority
GET /usernames/suffix/:suffix - Get usernames by suffix
GET /usernames/pending/:account - Get pending usernames for account
Registrar APIs:

GET /registrars - Get all registrars
GET /judgement-requests/registrar/:registrarId - Get pending requests by registrar
GET /registrars/statistics - Get registrar statistics
Analytics & History:

GET /events/:account - Get identity events by account
GET /history/:account - Get identity history by account


2. **GraphQL API**: The API also provides a GraphQL endpoint for more flexible
   and efficient data retrieval. You can use GraphQL queries to fetch exactly
   the data you need.

```bash
npx squid-graphql-server
```

After that you will see the GraphQL playground where you can start querying the
API. (http://localhost:4350/graphql)

### Testing

> Unit test early, unit test often

> [!NOTE] Any code imported from @kodadot
> [packages has unit test written in the separated repository](https://github.com/kodadot/packages)

This indexer contains unit tests for utility/parsing functions we wrote.

Tests are located in the `tests/` directory. To run the tests, use:

```bash
npm run test
```

> [!WARNING] Currently, it is impossible to unit test the whole indexer workflow
> as a dry run. If you encounter some problem, please head over to the telegram
> group **HydraDevs**

## Architecture

The architecture of this project is following:

- `src/processable.ts` - definition of Events and Extrinsic to be processed by
  Squid
- `src/processor.ts` - processor definition
- `src/mappings/index` - the main function that is called by the processor to
  process events and extrinsic
- `src/mappings/<pallet>` - mapping functions for each event and extrinsic
- `src/mappings/<pallet>/types.ts` - types for each event and extrinsic
- `src/mappings/<pallet>/getters/<chain>.ts` - transformation functions for each
  event and extrinsic
- `src/mappings/utils` - utility functions used by mappings

## Misc

1. fast generate event handlers

```bash
pbpaste | cut -d '=' -f 1 | tr -d ' '  | xargs -I_ echo "processor.addEventHandler(Event._, dummy);"
```

2. enable debug logs (in .env)

```bash
SQD_DEBUG=squid:log
```

3. generate metagetters from getters

```bash
pbpaste | grep 'export'  | xargs -I_ echo "_  return proc.  }"
```

4. Enable different chain (currently only Polkadot is supported)

> [!NOTE] By default the chain is set to `polkadot`

```bash
CHAIN=polkadot # or kusama
```

## Funding

Project was funded as a common good by

<div align="center">
  <img width="200" alt="version" src="https://user-images.githubusercontent.com/55763425/211145923-f7ee2a57-3e63-4b7d-9674-2da9db46b2ee.png" />
</div>
