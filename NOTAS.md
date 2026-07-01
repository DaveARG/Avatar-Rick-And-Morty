# Notas de diseño

## Decisiones deliberadas (mínimo código, sin recortar seguridad)

- **Proxy backend en capas mínimas**: router/handler + cliente upstream + mapeo de errores centralizado, sin repository/domain/usecase separados — no se justifica para este alcance.
- **`name` sin match, `page` fuera de rango o vacío → siempre 200 con `results: []`**, nunca 404. El backend nunca propaga los distintos significados de "vacío" del upstream como error.
- **Validación de `page`/`id`/`name` ocurre antes de llamar al upstream**, nunca después. Validadores extraídos a `backend/src/validators/characters.validators.ts` (carpeta dedicada, sin contaminar routes). Evita propagar 500 crudos por inputs inválidos (ej. `id=abc`) y rechaza payloads arbitrarios (`name` > 100 caracteres con 400 propio).
- **Cache en memoria (TtlCache zero-dep)**: `backend/src/services/cache.ts` con TTL configurable 5 min (300s), máximo 500 entradas. Cachea solo respuestas 200 por `(method, path)`. Sin LRU real ni invalidación selectiva — limitación deliberada, suficiente para proxy stateless. Migrar a `lru-cache` si escala a multi-instancia con sesiones.
- **Rate-limiting con express-rate-limit**: 100 req/min por defecto (configurable por env: `RATE_LIMIT_MAX`, `RATE_LIMIT_WINDOW_MS`). Responde 429 con JSON `{error}`, nunca HTML.
- **HttpError con status para diferenciar errores**: El servicio lanza `HttpError` (custom) con `status` explícito; CharacterDetailPage detecta 404 y muestra "no encontrado", resto muestra error genérico. Mantiene UX consistente sin propagación ciega de códigos.
- **react-router con `useSearchParams` como estado de búsqueda**: `name`/`page` viven en la URL (`/?name=&page=`), no en `useState` de la app. Resuelve "bookmarkeable" y "sobrevive a recarga" sin código extra.
- **Botón "volver" propaga el contexto de búsqueda vía URL, no vía historial**: Custom hook `useBackToList` reconstruye la navegación a `/` con `location.search` vigente. Funciona igual en navegación normal, recarga y deep-link directo — a diferencia de `navigate(-1)`, que en esos dos últimos casos sacaría al usuario fuera de la SPA (D-27 intacto).
- **Custom hooks para pages delgadas**: `useCharacter`, `useCharacterSearch`, `useBackToList` + `useDebounce`, `useCharacterSearchParams` preexistentes. Pages reducidas a lógica de render, sin side effects duplicados.
- **Tailwind v4 CSS-first**: sin `tailwind.config.js`, solo `@import "tailwindcss"` en `index.css`.
- **Tests e2e con Playwright**: `e2e/tests/smoke.spec.ts` (2 flujos: lista→detalle→volver con contexto [D-27], estado sin-resultados). No UI regression ni paginación profunda — smoke tests solo.
- **Script raíz con concurrently**: `pnpm dev` levanta backend+frontend a la vez; `pnpm install:all`, `pnpm test`, `pnpm build` orquestan las dos capas desde raíz. Nada de orquestador manual.

## Supuestos

- `page` fuera de rango (ej. `page=9999`) se trata igual que "sin resultados": 200 + `results: []`, nunca error.
- `name` vacío o ausente significa "sin filtro" — se pide el listado completo paginado normal, no un error ni un caso especial.
- `id="01"` (con cero a la izquierda) se acepta como id numérico válido — la validación exige entero positivo, no un formato de string específico.

## Tests omitidos conscientemente

- `CharacterCard` no tiene test de componente aislado — se cubre indirectamente vía `CharacterList.test.tsx` y el smoke manual de navegación.

## Qué mejoraría con más tiempo

- **Cache LRU real o compartida multi-instancia**: El TtlCache actual es single-instance con techo de 500 entradas (O(n) lookup). Si escala a múltiples procesos/replicas, migrar a Redis o `lru-cache` con LRU eviction.
- **E2E más exhaustivos**: Hoy solo smoke tests básicos (lista→detalle→volver, estado vacío). Faltan: paginación profunda (page=3+), deep-link directo a detalle, error states en real, rate-limit exceeded, navegación dentro de resultados.
- **Tests de componente para CharacterCard**: Hoy se cubre indirectamente vía `CharacterList.test.tsx`. Componente aislado testearía comportamiento del `Link` con contexto de búsqueda en más escenarios.
- **Observabilidad/métricas**: Logs estructurados (Winston), tracing de cache hits/misses, métricas de rate-limit (requests/ventana, rejects). Ninguno es crítico para MVP.
