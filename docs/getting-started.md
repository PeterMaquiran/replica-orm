# Getting Started

Replica ORM is a **browser-native database runtime** with local-first storage and real-time sync capabilities.

It is designed to be developed and validated through **tests, not manual inspection**.

---

## 🧰 Requirements

* Node.js 22+
* pnpm 11+
* Browser (Chrome recommended)

---

## 📦 Installation

```bash id="g2"
pnpm install
```

---

## 🚀 Development Mode

Start the development environment:

```bash id="g3"
pnpm dev
```

This will:

* Start the Vite playground
* Open Cypress test runner
* Watch for file changes

---

## 🧪 Development Workflow (IMPORTANT)

This project is developed using a **test-driven loop**.

### The rule:

> A feature is ONLY considered working when tests pass.

---

### Typical workflow:

1. Start dev environment

```bash id="g4"
pnpm dev
```

2. Open Cypress test runner
3. Write or update tests
4. Modify implementation code
5. Refresh Cypress test
6. Repeat until tests pass

---

### Mental model

* UI is NOT the source of truth
* Logs are NOT the source of truth
* Only tests define correctness

---

## 🧪 Running Tests

### Unit tests

```bash id="g5"
pnpm test:unit
```

### E2E tests

```bash id="g6"
pnpm test:e2e
```

---

## 🏗 Build

```bash id="g7"
pnpm build
```

---

## ⚙️ Project Philosophy

Replica ORM is built with:

* Local-first architecture
* Deterministic behavior
* Test-driven validation
* Browser-native execution

---

## 🧠 Core Principle

> If a feature is not tested, it does not exist.

---

## 🔁 Recommended Development Loop

```
Write test → See it fail → Implement feature → See it pass → Refactor
```

---
