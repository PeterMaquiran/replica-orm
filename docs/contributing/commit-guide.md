# Git Commit Guide

This project uses **Conventional Commits** to keep history clean and consistent.

---

## Format

```bash id="c1"
<type>: <message>
```

Example:

```bash id="c2"
chore: setup project tooling
feat: add model system
fix: resolve query bug
```

---

## Types

### chore

Project setup and maintenance (no feature changes)

```bash id="c3"
chore: setup eslint and husky
```

### feat

New feature

```bash id="c4"
feat: add indexeddb adapter
```

### fix

Bug fix

```bash id="c5"
fix: correct sync issue
```

### refactor

Code changes without behavior change

```bash id="c6"
refactor: simplify query logic
```

### test

Tests only

```bash id="c7"
test: add e2e coverage
```

### docs

Documentation only

```bash id="c8"
docs: update usage guide
```

---

## First Commit

```bash id="c9"
chore: bootstrap project tooling
```

---

## Rule

* Keep commits small
* One change per commit
* Use clear messages
