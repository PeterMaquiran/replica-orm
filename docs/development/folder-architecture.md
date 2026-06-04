# Replica ORM — Folder Architecture

This document describes the target folder structure for Replica ORM: fields, models, schema generation, registration, local storage, and versioned migrations.

> **Documentation:** [architecture](./architecture.md)

---

## High-level map

```text
src/
├── fields/              ✅ exists — validation + column metadata
├── model/               model base classes (pg.Model, mongo.Model)
├── schema/              read models → build TableSchema / DatabaseSchema
├── runtime/             register(), registry, database handles
├── engine/              remote engine(Postgress, Mongodb), local engines (indexeddb, sqlite, etc)
└── state/               shared state
```

| Folder     | Question it answers              |
| ---------- | -------------------------------- |
| `fields/`  | What type is this value?         |
| `model/`   | What table/collection is this?   |
| `schema/`  | What is the database shape?      |
| `runtime/` | When/how are databases booted?   |
| `engine/`  | Where is data persisted locally? |
| `state/`   | shared state                     |

One-line summary:

```text
fields  = types
model   = tables
schema  = shape
runtime = register()
storage = where
migration = version changes
```

---

## Full proposed tree

```text
src/
│
├── fields/                          # DATABASE-NATIVE TYPES (done)
│   ├── core/
│   │   ├── field.ts
│   │   ├── params.ts
│   │   ├── errors.ts
│   │   └── validators.ts
│   ├── postgres/
│   │   ├── field.ts
│   │   ├── types.ts
│   │   ├── fields/
│   │   ├── relationships/
│   │   └── fields.test.ts
│   ├── mongodb/
│   │   ├── field.ts
│   │   ├── types.ts
│   │   ├── fields/
│   │   └── fields.test.ts
│   ├── mssqlserver/                 # future
│   └── index.ts
│
├── model/                           # MODEL BASE CLASSES
│   ├── core/
│   │   └── model.ts                 # shared Model behavior
│   ├── postgres/
│   │   ├── model.ts                 # pg.Model
│   │   └── index.ts
│   ├── mongodb/
│   │   ├── model.ts                 # mongo.Model
│   │   └── index.ts
│   └── index.ts
│
├── schema/                          # SCHEMA GENERATION (portable)
│   ├── core/
│   │   ├── types.ts                 # TableSchema, ColumnSchema, DatabaseSchema
│   │   ├── naming.ts                # createdAt → created_at (columns only)
│   │   └── model-reader.ts          # Model class → raw field map
│   ├── postgres/
│   │   ├── reader.ts                # PostgresField → ColumnSchema
│   │   ├── builder.ts               # resolve FKs, join tables, indexes
│   │   ├── emitter.ts               # TableSchema → CREATE TABLE SQL
│   │   └── builder.test.ts
│   ├── mongodb/
│   │   ├── reader.ts                # BSON fields → collection schema
│   │   ├── builder.ts
│   │   └── emitter.ts               # validator rules / JSON schema style
│   └── index.ts
│
├── runtime/                         # REGISTER + REGISTRY
│   ├── types.ts                     # RegisterOptions, RegisteredDatabase
│   ├── registry.ts                  # stores all registered databases
│   ├── register.ts                  # register({ database, models, local, remote, version })
│   ├── model-binding.ts             # wires Model classes to their database at register time
│   ├── meta.ts                      # DatabaseMeta (stored version, hash)
│   ├── context.ts                   # holds active db instances
│   └── register.test.ts
│
├── engine/
│   ├── core/              # shared interface
│   ├── local/
│   │   ├── indexeddb/
│   │   ├── sqlite/
│   │   └── memory/
│   ├── remote/
│   │   ├── postgres/
│   │   └── mongodb/
│
├── migration/                       # VERSIONED SCHEMA CHANGES
│   ├── core/
│   │   ├── types.ts                 # MigrationPlan, MigrationStep
│   │   ├── planner.ts               # diff old schema vs new schema
│   │   └── runner.ts                # orchestrates apply
│   ├── postgres/
│   │   └── steps.ts                 # AddColumn, CreateIndex, AddFK...
│   ├── storage/
│   │   ├── indexeddb-runner.ts
│   │   ├── sqlite-runner.ts
│   │   └── memory-runner.ts
│   ├── history/
│   └── index.ts
│
├── sync/                            # REMOTE REPLICATION (later)
│   ├── core/
│   ├── postgres/
│   └── index.ts
│
├── query/                           # CRUD + LIVE QUERIES (later)
│   ├── core/
│   ├── postgres/
│   └── index.ts
│
└── index.ts                         # public API
```

---

## How folders connect

```text
User code
  class User extends pg.Model { ... }

  register({
    database: "testing",
    models: [User],
    local: sqlite.engine(),
    remote: pg.engine(),
    version: 2,
  })
        │
        ▼
┌─────────────────────────────────────────┐
│ runtime/register.ts                     │
│  - validate options                     │
│  - call schema builder                  │
│  - open storage adapter                 │
│  - run migrations                       │
│  - save registry entry                  │
└─────────────────────────────────────────┘
        │
        ├──────────────► model/postgres/model.ts
        ├──────────────► schema/postgres/builder.ts
        ├──────────────► migration/core/planner.ts
        └──────────────► storage/sqlite/adapter.ts
```

---
