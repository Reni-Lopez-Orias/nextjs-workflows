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

## CI/CD

- `.github/workflows/ci.yml` — lint + test + build en cada push/PR a `main`.
- `.github/workflows/deploy.yml` — build y deploy a Vercel (produccion) en cada push a `main`.

## Pasos pendientes (a mano, fuera de este repo)

1. **Crear el repo en GitHub** y pushear esto:
   ```bash
   git remote add origin <URL_DEL_REPO>
   git branch -M main
   git push -u origin main
   ```

2. **Crear un proyecto en [vercel.com](https://vercel.com)** conectado a ese repo
   (opcion mas simple: solo con eso Vercel ya despliega solo por su cuenta en
   cada push/PR, sin tocar ningun workflow — es su integracion nativa de Git).

3. Si ademas queres que sea el workflow de `deploy.yml` el que dispare el
   deploy (para practicar el mecanismo con GitHub Actions, no solo confiar en
   la integracion automatica de Vercel), necesitas 3 secrets en
   `Settings -> Secrets and variables -> Actions` del repo de GitHub:
   - `VERCEL_TOKEN` — Vercel -> Account Settings -> Tokens -> Create.
   - `VERCEL_ORG_ID` y `VERCEL_PROJECT_ID` — corriendo `vercel link` en este
     proyecto localmente (con `npx vercel login` primero), quedan en
     `.vercel/project.json` (ese archivo esta gitignoreado, no se commitea).

Si haces los 3 pasos, vas a tener **dos** mecanismos de deploy activos a la vez
(la integracion nativa de Vercel + el workflow de GitHub Actions) — para este
proyecto de práctica no hay drama en que convivan, pero es bueno saber que
existen los dos y por que.
