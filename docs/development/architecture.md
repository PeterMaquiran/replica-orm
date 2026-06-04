# Architecture

## 🧠 Overview

Replica is built around a **dual-engine architecture** that separates:

- **Local persistence** (browser storage)
- **Remote dialect** (schema and sync target)

This design provides:

- Small bundle sizes via tree-shaking
- Clear separation of concerns
- Extensibility for future backends

At runtime, these components are composed using `register()`.

---

## 🧩 Core Idea: Engine Abstraction

Replica avoids string-based configuration and instead uses **engine instances**:

```ts
await register({
  database: 'main',
  models: [User],
  local: idb.engine(),
  remote: pg.engine(),
  version: 1,
  sync: { url: '...' },
})
```

Each engine is:

- Explicitly imported
- Independently bundled
- Responsible for a single role

---

## 🏗️ System Components

### 1. Runtime (`@replica/runtime`)

Responsible for:

- Database registration (`register`)
- Engine wiring
- Validation of compatibility
- Lifecycle and registry management

Does **not** include:

- Field definitions
- Storage implementations

---

### 2. Local Engines (Persistence Layer)

Local engines handle:

- Opening storage
- Applying schema
- Managing local data
- Recording changes for sync

#### Example: IndexedDB

```ts
idb.engine()
```

Pipeline:

```
Models → Schema → IndexedDB Schema → indexedDB.open()
```

Responsibilities:

- Create object stores
- Create indexes
- Handle version upgrades
- Log operations for sync

---

### 3. Remote Engines (Dialect Layer)

Remote engines define:

- Schema format
- DDL generation
- Data serialization (for sync)

#### Example: PostgreSQL

```ts
pg.engine()
```

Provides:

- `emitDDL(schema)`
- `emitDDLText(schema)`
- Dialect: `'postgres'`

Remote engines **do not perform network requests**. They describe how data should look remotely.

---

### 4. Sync Engine (Replication Layer)

The sync engine connects local and remote systems.

It is responsible for:

- Sending local changes (**push**)
- Fetching remote changes (**pull**)
- Applying updates to local storage

Architecture:

```
        ┌──────────────┐
        │   Runtime    │
        └──────┬───────┘
               │
     ┌─────────▼─────────┐
     │    Sync Engine    │
     └──────┬───────┬────┘
            │       │
     ┌──────▼───┐ ┌─▼─────────┐
     │  Local   │ │  Remote   │
     │ Engine   │ │ Engine    │
     └──────────┘ └───────────┘
```

---

## 🔄 Data Flow

### Write + Sync Flow

```
User action
    ↓
Local Engine (write + log operation)
    ↓
Sync Engine
    ├── push → server
    └── pull ← server
    ↓
Local Engine (apply remote changes)
```

---

## 🧱 Schema Pipeline

Replica uses a unified schema pipeline:

```
class User extends pg.Model { ... }   // field instances on the class
        ↓
readModelFields / readModel             // src/schema/core/model-reader.ts
        ↓
buildPostgresSchema                     // src/schema/postgres/builder.ts
        ↓
DatabaseSchema                          // src/schema/core/types.ts
        ├─► emitPostgresDDLText()       // remote: pg.engine()
        └─► emitIndexedDBSchema()       // local: idb.engine() → open()
```

This ensures:

- A single source of truth (models)
- Consistent schema across environments

---

## 📦 Bundle Architecture

Replica is designed for **maximum tree-shaking**.

Each package is independent:

| Package              | Responsibility             |
| -------------------- | -------------------------- |
| `@replica/runtime`   | Core runtime + register    |
| `@replica/postgres`  | Fields + Model + pg.engine |
| `@replica/indexeddb` | IndexedDB engine           |
| `@replica/sqlite`    | (planned)                  |

### Key Principle

> Only what you import gets bundled

```ts
import { pg } from '@replica/postgres'
import { idb } from '@replica/indexeddb'
import { register } from '@replica/runtime'
```

---

## ⚖️ Engine Pairing Rules

`register()` enforces strict compatibility:

| Rule                       | Behavior               |
| -------------------------- | ---------------------- |
| Models use Postgres fields | Must use `pg.engine()` |
| Local engine unsupported   | Throws error           |
| Dialect mismatch           | Throws error           |
| Duplicate database name    | Throws                 |
| Model reused across DBs    | Throws                 |

---

## 🧱 Project Structure

```
src/
├── engines/
│   ├── postgres/
│   ├── indexeddb/
│   └── sqlite/
├── model/
│   └── postgres/
├── runtime/
├── schema/
├── sync/
└── shared/
```

Build outputs:

```
dist/
├── runtime.js
├── postgres.js
├── indexeddb.js
├── sqlite.js
```

---

## ⚙️ Design Decisions

### Why separate local and remote engines?

- Avoid bundling unused backends
- Enable independent evolution
- Allow flexible combinations

---

### Why engine factories?

```ts
pg.engine()
idb.engine()
```

- Explicit boundaries
- Type-safe composition
- No string-based configuration

---

### Why Postgres as the base schema?

- Strong typing
- Mature ecosystem
- Easy mapping to other systems

---

## 🚧 Future Architecture

Planned engines:

- `sqlite.engine()` — local SQL
- `opfs.engine()` — filesystem storage
- `memory.engine()` — testing
- `mongo.engine()` — NoSQL dialect

Future improvements:

- Advanced sync engine
- Conflict resolution strategies
- Multi-device replication

---

## 🧪 Advanced Usage

Engines can be used independently:

```ts
const local = idb.engine()
const schema = local.buildSchema(...)
const db = await local.open(...)
```

Production apps should use `register()` for:

- Validation
- Lifecycle tracking
- Consistent setup

---

## 📚 Related Docs

- setup.md — environment setup
- testing.md — testing strategy
- usage-guide.md — API usage
- schema.md — schema pipeline
