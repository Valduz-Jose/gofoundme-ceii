# GoFundMe CEII — Convenciones del Proyecto

## Descripción
Página de recaudación de fondos para el Centro de Informática (CEII) en Venezuela.
Objetivo: $1,329 USD para equipos Starlink + infraestructura de red.

## Stack
- **Framework**: Next.js 14 (App Router, no Pages Router)
- **Lenguaje**: TypeScript estricto (`strict: true`)
- **Estilos**: Tailwind CSS (utility-first, sin CSS modules salvo casos especiales)
- **Base de datos**: Supabase (PostgreSQL + Row Level Security)
- **Auth**: Supabase Auth (solo admin, email/password)
- **Deploy**: Vercel (plan gratuito)

## Estructura de carpetas
```
src/
  app/
    (public)/          # Layout público (donantes, barra de progreso)
    admin/             # Rutas protegidas por auth
    api/               # Route Handlers (server-side)
  components/
    ui/                # Primitivos reutilizables (botones, cards, badges)
    features/          # Componentes de dominio (ProgressBar, DonorList, etc.)
  lib/
    supabase/          # Cliente y tipos generados
    exchange/          # Lógica de tasas cambiarias
    utils.ts           # Helpers genéricos
  types/               # Tipos TypeScript globales
```

## Convenciones de código
- Componentes: PascalCase, un componente por archivo
- Funciones/variables: camelCase
- Archivos de componentes: kebab-case (`progress-bar.tsx`)
- Server Components por defecto; `"use client"` solo cuando se necesita interactividad
- No usar `any`; preferir tipos explícitos o `unknown`
- Imports absolutos con alias `@/` (configurado en tsconfig)

## Base de datos (Supabase)
- Todas las tablas tienen `created_at` timestamp con default `now()`
- Row Level Security (RLS) habilitado en todas las tablas
- Tipos generados con `supabase gen types typescript`
- Migraciones versionadas en `supabase/migrations/`

## Tasas cambiarias
- API primaria: `ve.dolarapi.com` (monitordolar alternativo)
- Monedas soportadas: USD (base), VES BCV, VES paralelo, EUR, COP
- Cache de tasas: revalidación cada 1 hora (Next.js `revalidate`)
- Si la API falla, mostrar última tasa conocida guardada en Supabase

## Variables de entorno
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=   # Solo server-side
```

## Reglas generales
- No comentarios obvios; solo cuando el "por qué" no es evidente
- No agregar manejo de errores para escenarios imposibles
- No features extra que no estén en el plan acordado
- Preferir editar archivos existentes sobre crear nuevos
