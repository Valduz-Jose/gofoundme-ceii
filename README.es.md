# GoFundMe CEII — Plataforma de Recaudación de Fondos

📖 Léelo en: [English](./README.md) | **Español**

> Una plataforma de recaudación de fondos full-stack con seguimiento de progreso en tiempo real, visualización multi-moneda y un panel de administración completo — construida para una campaña real.

[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js&logoColor=white)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com)
[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000?logo=vercel&logoColor=white)](https://vercel.com)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

<br>

![GoFundMe CEII preview](public/preview.png)

<div align="center">

[🌐 Demo en vivo](https://gofoundme-ceii.vercel.app) &nbsp;·&nbsp; [📋 Reportar un bug](https://github.com/Valduz-Jose/gofoundme-ceii/issues)

</div>

---

## Acerca del proyecto

**CEII** (Centro de Estudiantes de Ingeniería en Informática) es la organización estudiantil del programa de Ingeniería en Informática de la UNET (Universidad Nacional Experimental del Táchira, Venezuela). Con internet limitado o inexistente en su sede, los estudiantes no pueden acceder a recursos en línea, herramientas de desarrollo ni comunicarse con el exterior. Esta plataforma fue creada para recaudar **$1,329 USD** destinados a la compra e instalación de un kit Starlink y la infraestructura de red necesaria.

Técnicamente, este proyecto va más allá de una simple página de donaciones. Incluye un **motor de tasas cambiarias en tiempo real** que convierte la meta y el progreso de la recaudación a VES (tasas BCV y paralelo), EUR y COP — las monedas que los donantes realmente utilizan. Todos los datos de conversión se obtienen de la API venezolana de tasas de cambio (`ve.dolarapi.com`) y se almacenan en caché de forma inteligente con la revalidación de Next.js.

La plataforma incluye un **panel de administración completamente desacoplado** protegido por Supabase Auth. Los administradores pueden gestionar donaciones, equipos, configuración del sitio y métodos de pago — sin tocar una sola línea de código. El sistema de métodos de pago utiliza un esquema JSONB flexible que soporta cualquier flujo de pago (pagos móviles, Zelle, billeteras crypto) sin necesidad de migraciones en la base de datos.

**Estado:** Producción — en uso activo para la campaña real de recaudación de CEII.

---

## Funcionalidades

- 💱 **Visualización multi-moneda** — conversión en tiempo real a USD, VES BCV, VES Paralelo, EUR y COP
- 📊 **Barra de progreso en vivo** — refleja las donaciones reales almacenadas en Supabase con un efecto visual verde brillante
- 💚 **Modal de donación** — interfaz con pestañas (Venezuela, Internacional, Colombia, Crypto, Contacto) con copiado al portapapeles con un solo clic
- 🔐 **Panel de administración** — CRUD completo para donaciones, equipos, métodos de pago y configuración del sitio; protegido por Supabase Auth
- 🗂️ **Métodos de pago dinámicos** — el admin puede agregar/editar/eliminar métodos de pago con campos clave-valor personalizados (sin cambios de código)
- 🔄 **Respaldo de tasas cambiarias** — las últimas tasas conocidas se persisten en Supabase y se muestran si la API externa no está disponible
- 📱 **Totalmente responsivo** — diseño mobile-first; el hero adapta de dos columnas en escritorio a apilado en móvil
- 🛡️ **Row Level Security** — los usuarios públicos solo pueden leer registros activos; el acceso de escritura está restringido al admin autenticado a nivel de base de datos
- ⚡ **Optimizado para edge** — desplegado en Vercel con revalidación ISR (60s) para cargas de página casi instantáneas

---

## Tech Stack

| Capa | Tecnología |
|---|---|
| **Framework** | Next.js 14 (App Router, Server Components, Server Actions) |
| **Lenguaje** | TypeScript 5 (modo estricto) |
| **Estilos** | Tailwind CSS 3 (utility-first, paleta de colores personalizada CEII) |
| **Base de datos** | Supabase — PostgreSQL con Row Level Security |
| **Autenticación** | Supabase Auth (email/contraseña, solo admin) |
| **Despliegue** | Vercel (plan gratuito, deploys automáticos desde GitHub) |
| **Tasas cambiarias** | [ve.dolarapi.com](https://ve.dolarapi.com) (primaria) |

---

## Arquitectura

```
┌─────────────┐     HTTPS      ┌──────────────────────┐
│  Navegador  │ ─────────────► │  Next.js en Vercel   │
└─────────────┘                │  (App Router + ISR)  │
                               └──────────┬───────────┘
                                          │
                          ┌───────────────┼───────────────┐
                          │               │               │
                          ▼               ▼               ▼
                  ┌──────────────┐ ┌──────────┐  ┌─────────────────┐
                  │   Supabase   │ │  Server  │  │  ve.dolarapi.com│
                  │  PostgreSQL  │ │ Actions  │  │  (tasas cambio) │
                  │  + Auth/RLS  │ │ (mutate) │  └─────────────────┘
                  └──────────────┘ └──────────┘

Rutas públicas:  / (inicio con modal de donación)
Rutas admin:     /admin/** (protegidas por middleware + sesión Supabase)
Rutas API:       /api/rates (proxy de tasas cambiarias)
```

---

## Desarrollo local

### Requisitos previos

- Node.js 18+
- Un proyecto en [Supabase](https://supabase.com) (el plan gratuito funciona)
- Git

### Configuración

```bash
# 1. Clonar el repositorio
git clone https://github.com/Valduz-Jose/gofoundme-ceii.git
cd gofoundme-ceii

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env.local
# Edita .env.local con tus credenciales de Supabase
```

### Variables de entorno

```env
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here   # solo server-side
```

### Configuración de la base de datos

Ejecuta las migraciones SQL en orden en el Editor SQL de Supabase:

```
supabase/migrations/001_initial_schema.sql   # tablas principales
supabase/migrations/002_payment_methods.sql  # métodos de pago + RLS
```

### Ejecutar

```bash
npm run dev
# → http://localhost:3000
```

El panel de administración está en `/admin`. Crea tu primer usuario desde el dashboard de Supabase en **Authentication → Users**.

---

## Estructura del proyecto

```
src/
├── app/
│   ├── page.tsx                     # Página pública principal (Server Component)
│   ├── admin/
│   │   ├── actions.ts               # Todos los Server Actions (CRUD)
│   │   └── (panel)/
│   │       ├── dashboard/
│   │       ├── donations/           # Gestión de donaciones
│   │       ├── equipment/           # Lista de equipos
│   │       ├── payment-methods/     # CRUD de métodos de pago
│   │       └── settings/            # Configuración del sitio
│   └── api/rates/route.ts           # Proxy de tasas cambiarias
├── components/
│   ├── features/
│   │   ├── currency-display.tsx     # Selector multi-moneda + montos
│   │   ├── progress-bar.tsx         # Barra de progreso animada
│   │   ├── donate-modal.tsx         # Modal de métodos de pago (Client)
│   │   ├── donate-button.tsx        # Disparador del modal (Client)
│   │   ├── donor-list.tsx           # Lista pública de donantes
│   │   ├── equipment-list.tsx       # Tarjetas de equipos
│   │   └── admin/
│   │       ├── sidebar.tsx          # Navegación del admin
│   │       ├── form-fields.tsx      # Primitivos de formulario compartidos
│   │       └── payment-method-form.tsx  # Editor de campos dinámicos
│   └── ui/                          # Primitivos reutilizables
├── lib/
│   ├── supabase/
│   │   ├── client.ts                # Cliente Supabase para el navegador
│   │   ├── server.ts                # Clientes server + service role
│   │   └── payment-methods.ts       # Helpers de obtención de datos
│   └── exchange/rates.ts            # Lógica de tasas cambiarias + caché
└── types/index.ts                   # Interfaces TypeScript globales
```

---

## Aspectos técnicos destacados

**Esquema JSONB flexible para métodos de pago** — en lugar de codificar campos fijos por tipo de pago, cada método almacena sus datos de visualización como `jsonb`. Agregar un nuevo método de pago (por ejemplo, una nueva billetera crypto) requiere cero migraciones de base de datos y ningún cambio de código — solo un envío desde el formulario del admin.

**Row Level Security a nivel de base de datos** — los usuarios públicos (rol anon) solo pueden leer registros donde `is_active = true`. Las escrituras y lecturas de registros inactivos están disponibles exclusivamente para el rol de admin autenticado. La seguridad se aplica a nivel de PostgreSQL, no solo en el código de la aplicación.

**Server Components + Server Actions** — la página pública obtiene todos los datos en el servidor sin waterfalls del lado del cliente. Las mutaciones (CRUD del admin) usan Next.js Server Actions, manteniendo la superficie de API pequeña y con tipos seguros sin endpoints REST separados que mantener.

**Desarrollo asistido por IA** — este proyecto fue construido con un flujo de trabajo asistido por IA (Claude Code) para una iteración acelerada, manteniendo tipos TypeScript estrictos, buenas prácticas de seguridad y las convenciones arquitectónicas definidas en `CLAUDE.md`.

---

## Roadmap

- [ ] Notificaciones por email al registrar una donación
- [ ] Exportar lista de donantes a CSV
- [ ] Internacionalización EN/ES (i18n)
- [ ] Tests automatizados con Vitest + Testing Library
- [ ] Modo oscuro
- [ ] Widget embebible de progreso de la meta

---

## Autor

**José Valduz**
Estudiante de Ingeniería en Informática · Universidad Nacional Experimental del Táchira (UNET)

[![GitHub](https://img.shields.io/badge/GitHub-Valduz--Jose-181717?logo=github)](https://github.com/Valduz-Jose)
[![Email](https://img.shields.io/badge/Email-jose.valduz%40unet.edu.ve-EA4335?logo=gmail&logoColor=white)](mailto:jose.valduz@unet.edu.ve)

---

## Licencia

Distribuido bajo la Licencia MIT. Consulta [`LICENSE`](LICENSE) para más información.

---

<div align="center">
Hecho con 💚 para los estudiantes del CEII
</div>
