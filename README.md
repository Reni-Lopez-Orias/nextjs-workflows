# nextjs-workflows

Proyecto chico y deliberadamente simple: **solo frontend** (Next.js + React,
sin backend ni base de datos — las tareas se guardan en `localStorage`).
El objetivo no es la app en si, es practicar el pipeline de **CI/CD** con
GitHub Actions + Vercel sin la friccion de infraestructura propia (Docker,
VPS, registries) que tuvo el otro proyecto (`my-app-workflows`).

## Correr en local

```bash
npm install
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000).

## Scripts

```bash
npm run lint    # eslint
npm run test    # vitest (una sola corrida, para CI)
npm run test:watch
npm run build   # next build
```

## Ramas y ambientes

Solo 2 ramas: `dev` → `main`. Se promueve siempre por PR y hacia adelante.

Ni bien 3 (no 2) porque el plan gratis de Vercel solo da 2 ambientes reales
(Production y un único Preview genérico) — tener una tercera rama `qa` habría
apuntado al mismo Preview que `dev`, sin ninguna separación real. Esto es
distinto de `my-app-workflows`, que sí mantiene dev/qa/prod porque ahí cada
ambiente corre en su propia infraestructura (Docker), no depende de cuántos
"ambientes" ofrezca una plataforma externa.

## CI/CD

- `.github/workflows/ci.yml` — lint + test + build en cada push/PR a `dev` o `main`.
- `.github/workflows/deploy-reusable.yml` — la lógica real de deploy (`vercel pull` → `vercel build` → `vercel deploy --prebuilt`), reusable.
- `.github/workflows/deploy-dev.yml` — deploy de **preview** en Vercel (sin `--prod`) en cada push a `dev`.
- `.github/workflows/deploy-prod.yml` — deploy de **producción** en Vercel en cada push a `main`.

## Pasos pendientes (a mano, fuera de este repo)

1. **Crear un proyecto en [vercel.com](https://vercel.com)** conectado a este repo
   (opcion mas simple: solo con eso Vercel ya despliega solo por su cuenta en
   cada push/PR, sin tocar ningun workflow — es su integracion nativa de Git).

2. Si ademas queres que sean los workflows de `deploy-dev.yml`/`deploy-prod.yml` los que
   disparen el deploy (para practicar el mecanismo con GitHub Actions, no solo
   confiar en la integracion automatica de Vercel), necesitas 3 secrets en
   `Settings -> Secrets and variables -> Actions` del repo de GitHub:
   - `VERCEL_TOKEN` — Vercel -> Account Settings -> Tokens -> Create.
   - `VERCEL_ORG_ID` y `VERCEL_PROJECT_ID` — corriendo `vercel link` en este
     proyecto localmente (con `npx vercel login` primero), quedan en
     `.vercel/project.json` (ese archivo esta gitignoreado, no se commitea).

Si haces los 2 pasos, vas a tener **dos** mecanismos de deploy activos a la vez
(la integracion nativa de Vercel + los workflows de GitHub Actions) — para este
proyecto de práctica no hay drama en que convivan, pero es bueno saber que
existen los dos y por que.

3. Configurar branch protection (Rulesets) para `dev`/`main` — mismo
   criterio que en `my-app-workflows`: requerir el check de CI, **no** requerir
   aprobaciones (sos el único colaborador).
