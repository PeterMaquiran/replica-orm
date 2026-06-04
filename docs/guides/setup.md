# Setup Guide

This guide explains how to set up Replica ORM for development.

---

## 📦 Install dependencies

```bash id="s2"
pnpm install
```

---

## 🚀 Start development environment

```bash id="s3"
pnpm dev
```

This starts:

- Vite playground
- Cypress test runner

---

## ⚙️ Environment

Create a `.env.local` file if needed to override `.env` :

```bash id="s4"
PLAYGROUNDPORT=5173
```

---

## 🧠 Notes

- Always use `pnpm`
- Node 22+ required
- Cypress is used for E2E validation

---

