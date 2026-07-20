# Product

## Register

product

## Users

Mickaell (desarrollador, unico usuario). Abre el dashboard en desktop, en sesiones
cortas, para responder tres preguntas: que proyectos estan indexados, cuanto ha
gastado el MCP Context Server en DeepSeek y si hubo actividad anomala (intentos
bloqueados por whitelist).

## Product Purpose

Panel de monitoreo read-only del MCP Context Server (proyectos indexados,
historial de queries y auditorias, tokens, costo, seguridad). Exito = ver el
estado del server de un vistazo en menos de 10 segundos, sin configurar nada.

## Brand Personality

Terminal-nativo, sobrio, denso. Se siente como una herramienta interna bien
cuidada (referencias: Vercel dashboard, Linear), no como un producto SaaS que
se vende a si mismo.

## Anti-references

- Landing SaaS con gradientes, glassmorphism o hero metrics decorativos.
- Dashboards genericos de plantilla (admin templates con cards infinitas).
- Cualquier cosa que anime por decoracion: los datos son el protagonista.

## Design Principles

- Datos primero: jerarquia por tipografia mono y numeros tabulares, no por color.
- Familiaridad ganada: affordances estandar (tablas, selects, paginacion), nada inventado.
- Acento unico (indigo) reservado para navegacion activa y links; los estados usan
  la paleta semantica existente (ok verde, audit ambar).
- Denso pero legible: contraste AA minimo sobre fondo #0a0a0a.

## Accessibility & Inclusion

WCAG AA en contraste. Focus visible en controles. Sin dependencia exclusiva del
color para significado (los tags llevan texto). Motion minimo (transiciones
100-150ms), sin secuencias orquestadas.
