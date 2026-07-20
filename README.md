<div align="center">

<img src="./docs/screenshots/dashboard.png" alt="Dashboard de mcp-dashboard con stats, queries recientes e intentos bloqueados" width="820"/>

<br/>

<img src="./docs/screenshots/title.svg" alt="mcp-dashboard" width="560"/>

### Monitoreo en tiempo real del MCP Context Server

**Proyectos indexados, queries, auditorias, tokens y costo, directo del Postgres de Railway**
<br/>
**Dark theme terminal-nativo · sin dependencias de UI**

<br/>

[![Stars](https://img.shields.io/github/stars/Mickaell22/mcp-context-dashboard?style=social)](https://github.com/Mickaell22/mcp-context-dashboard)

<br/>

[![Queries](https://img.shields.io/badge/Queries-historial_%2B_auditor%C3%ADas-6366F1?style=for-the-badge)](#paginas)
[![Seguridad](https://img.shields.io/badge/Seguridad-intentos_bloqueados-10B981?style=for-the-badge)](#paginas)
[![Proyectos](https://img.shields.io/badge/Proyectos-sesiones_%2B_actividad-F59E0B?style=for-the-badge)](#paginas)

<br/>

[![Website](https://img.shields.io/badge/Live-ia.novamicktools.com-6366F1?logo=googlechrome&logoColor=white)](https://ia.novamicktools.com)

<br/>

[![Next.js](https://img.shields.io/badge/Next.js-15-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Railway-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://railway.com)
[![Railway](https://img.shields.io/badge/Deploy-Railway-0B0D0E?style=for-the-badge&logo=railway&logoColor=white)](https://railway.com)

[**Paginas**](#paginas) • [**Stack**](#stack) • [**Correr en local**](#correr-en-local) • [**Variables de entorno**](#variables-de-entorno) • [**Deploy**](#deploy) • [**Estructura**](#estructura)

</div>

---

## Paginas

| Pagina | Descripcion |
|---|---|
| `/` Dashboard | 5 stat cards (proyectos, queries hoy, tokens totales, costo total, intentos bloqueados) + ultimas 8 queries + panel de intentos bloqueados por whitelist |
| `/projects` Projects | Tabla de proyectos con origen (local/github), archivos indexados, ultimo indexado, sesiones, queries, costo y ultima actividad. Ordenable por cualquier columna. |
| `/queries` Queries | Historial paginado (20/pag) con filtro por tipo (query/audit), filtro por proyecto y busqueda por texto. Click en fila para expandir la query completa con su respuesta y metadata. Las auditorias del server se marcan con tag `audit:<categoria>`. |

<div align="center">
<img src="./docs/screenshots/queries.png" alt="Historial de queries con tags de auditoria y filtros" width="820"/>
<br/><br/>
<img src="./docs/screenshots/projects.png" alt="Tabla de proyectos ordenable con sesiones y actividad" width="820"/>
</div>

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
git clone https://github.com/Mickaell22/mcp-context-dashboard
cd mcp-context-dashboard

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
│   ├── skeleton.tsx        # Filas skeleton para estados de carga
│   └── project-badge.tsx   # Badge de proyecto con color determinista
└── lib/
    ├── db.ts               # Pool de conexion PostgreSQL
    └── format.ts           # Helpers: timeAgo, fmtNumber, fmtCost, colores
```
