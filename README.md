# MCP Dashboard

Dashboard de monitoreo para el MCP Context Server. Muestra proyectos indexados, historial de queries, tokens consumidos y costo acumulado en tiempo real desde la base de datos de Railway.

**Produccion:** [ia.novamicktools.com](https://ia.novamicktools.com)

---

[![Next.js](https://img.shields.io/badge/Next.js-15-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Railway-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://railway.com)
[![Railway](https://img.shields.io/badge/Deploy-Railway-0B0D0E?style=for-the-badge&logo=railway&logoColor=white)](https://railway.com)

---

## Paginas

| Pagina | Descripcion |
|---|---|
| `/` Dashboard | 4 stat cards (proyectos, queries hoy, tokens totales, costo total) + tabla de ultimas 8 queries |
| `/projects` Projects | Tabla de proyectos con archivos indexados, ultimo indexado, queries y costo. Ordenable por cualquier columna. |
| `/queries` Queries | Historial paginado (20/pag) con filtro por proyecto y busqueda por texto. Click en fila para expandir query completo con metadata. |

---

## Stack

- **Next.js 15** con App Router
- **TypeScript** estricto
- **`pg`** — conexion directa a PostgreSQL via API routes (server-side)
- **CSS custom** — dark theme con variables CSS, sin Tailwind
- **Geist + JetBrains Mono** — fuentes via Google Fonts

---

## Correr en local

```bash
git clone https://github.com/mickaell/mcp-dashboard
cd mcp-dashboard

npm install

cp .env.local.example .env.local
# editar .env.local con el DATABASE_URL de Railway
```

```bash
npm run dev
# → http://localhost:3000
```

---

## Variables de entorno

| Variable | Descripcion |
|---|---|
| `DATABASE_URL` | PostgreSQL de Railway. Usar la URL publica fuera de Railway, la interna dentro. |

---

## Deploy

El dashboard esta desplegado en Railway en el mismo proyecto que el Postgres del MCP server (`mcp-context`). El `DATABASE_URL` apunta al Postgres interno via red privada de Railway.

Cada push a `master` en GitHub dispara un redespliegue automatico en Railway.

---

## Estructura

```
mcp-dashboard/
├── app/
│   ├── layout.tsx          # Layout raiz con sidebar
│   ├── page.tsx            # Dashboard
│   ├── error.tsx           # Error boundary con stack trace
│   ├── projects/page.tsx   # Tabla de proyectos
│   ├── queries/page.tsx    # Historial de queries
│   └── api/
│       ├── stats/route.ts
│       ├── projects/route.ts
│       └── queries/route.ts
├── components/
│   ├── sidebar.tsx         # Nav lateral
│   ├── icons.tsx           # SVG icons inline
│   └── project-badge.tsx   # Badge de proyecto con color determinista
└── lib/
    ├── db.ts               # Pool de conexion PostgreSQL
    └── format.ts           # Helpers: timeAgo, fmtNumber, fmtCost, colores
```
