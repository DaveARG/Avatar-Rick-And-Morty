# Rick and Morty Explorer

App para buscar y explorar personajes de Rick and Morty, con un backend propio que actúa como proxy/normalizador de la API pública.

## Requisitos

- Node.js v22+
- pnpm

## Arquitectura

- `frontend/` — React 19 + Vite + TypeScript + Tailwind v4 + react-router.
- `backend/` — Express + TypeScript (ESM), expone `/characters` y `/characters/:id`.

El frontend nunca llama a `rickandmortyapi.com` directamente — siempre pasa por el backend propio.

## Cómo arrancar (dos terminales, PowerShell)

### Backend

```powershell
cd backend
Copy-Item .env.example .env
pnpm install
pnpm dev
```

Levanta en `http://localhost:3001` (configurable con `PORT`).

### Frontend

En otra terminal:

```powershell
cd frontend
Copy-Item .env.example .env
pnpm install
pnpm dev
```

Levanta en `http://localhost:5173`.

## Variables de entorno

**backend/.env**
- `PORT` — puerto del servidor (default `3001`).
- `CORS_ORIGIN` — origin permitido para CORS (default `http://localhost:5173`).
- `UPSTREAM_BASE_URL` — base URL de la API de Rick and Morty (default `https://rickandmortyapi.com/api`).

**frontend/.env**
- `VITE_API_URL` — URL del backend propio (default `http://localhost:3001`).

## Endpoints del backend

- `GET /characters?name=&page=` — lista paginada, filtro opcional por nombre. Devuelve `{ info: { count, pages, next, prev }, results: Character[] }`. `name` sin match o `page` fuera de rango devuelven 200 con `results: []` (nunca 404). `page` inválido o `name` de más de 100 caracteres devuelven 400.
- `GET /characters/:id` — detalle de un personaje. `id` no numérico devuelve 400; `id` numérico inexistente devuelve 404.

Ver `NOTAS.md` para el detalle de decisiones de diseño.

## Rutas del frontend

- `/` — listado y búsqueda. Estado de búsqueda y página persiste en la URL (`?name=&page=`), es bookmarkeable y sobrevive a recargas.
- `/character/:id` — detalle de un personaje. La URL del detalle conserva `?name=&page=` de la búsqueda que originó la navegación. El botón "volver" reconstruye `/` con esos mismos params — funciona incluso si se recarga la página o se entra directo por URL al detalle.

## Scripts disponibles

**backend/**
```powershell
pnpm dev        # levanta el servidor con tsx watch
pnpm test       # corre la suite de Vitest + Supertest
pnpm typecheck  # tsc --noEmit
pnpm lint       # oxlint
```

**frontend/**
```powershell
pnpm dev     # levanta Vite en modo desarrollo
pnpm build   # tsc -b (gate de tipos) + vite build
pnpm test    # corre la suite de Vitest + Testing Library
pnpm lint    # oxlint
```

Nota: el frontend no tiene un script `typecheck` separado — el chequeo de tipos ocurre como parte de `pnpm build` (`tsc -b`).
