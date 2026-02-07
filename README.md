# 📘 Manual de Despliegue Local - VibeMarket

Este documento detalla los pasos para configurar, instalar y ejecutar el
entorno de desarrollo de **VibeMarket**.

------------------------------------------------------------------------

## 🛠️ 1. Requisitos Previos

Antes de comenzar, asegúrate de tener instalado lo siguiente:

-   **Node.js** (Versión 18 o superior)
-   **Git**
-   **Base de Datos MySQL**, una de las siguientes opciones:
    -   Opción A: XAMPP / MAMP (activar servicio MySQL)
    -   Opción B: Docker (recomendado)
    -   Opción C: MySQL Workbench / Servidor local nativo
-   **VS Code** (editor recomendado)

------------------------------------------------------------------------

## 🚀 2. Instalación del Proyecto

### Clonar el repositorio

``` bash
git clone <URL_DEL_REPOSITORIO>
cd perezcortes-vibemarket
```

### Instalar dependencias

``` bash
npm install
```

### Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

``` env
# Conexión a Base de Datos
DATABASE_URL="mysql://root:@localhost:3306/vibemarket"

# Ejemplo con contraseña
# DATABASE_URL="mysql://root:123456@localhost:3306/vibemarket"

# NextAuth
NEXTAUTH_SECRET="PIDELA AL EQUIPO"
NEXTAUTH_URL="http://localhost:3000"
```

------------------------------------------------------------------------

## 🗄️ 3. Configuración de Base de Datos

### Crear las tablas (Migraciones)

``` bash
npx prisma migrate dev --name init
```

### Poblar datos de prueba (Seed)

``` bash
npx prisma db seed
```

Si ves el mensaje **🚀 Sembrado completo**, todo salió correctamente.

------------------------------------------------------------------------

## ▶️ 4. Ejecutar el Proyecto

``` bash
npm run dev
```

Abre tu navegador en: 👉 http://localhost:3000

------------------------------------------------------------------------

## 🔑 5. Credenciales de Acceso

El sistema incluye usuarios de prueba.

> Nota: Para iniciar sesión, verifica que el hash en `prisma/seed.ts`
> corresponda a una contraseña conocida o registra un usuario nuevo.

-   Registro: http://localhost:3000/register
-   Login: http://localhost:3000/login

Recomendación: registra un nuevo usuario y selecciona el rol
**Vendedor**.

------------------------------------------------------------------------

## 🧪 6. Ejecución de Pruebas

### A. Pruebas Unitarias

``` bash
npm test
```

### B. Pruebas End-to-End (Playwright)

``` bash
npx playwright test
```

Reporte visual:

``` bash
npx playwright show-report
```

------------------------------------------------------------------------

## ⚠️ Solución de Problemas Comunes

### Error: `connect ECONNREFUSED 127.0.0.1:3306`

-   **Causa:** MySQL apagado
-   **Solución:** Inicia el servicio en XAMPP o Docker

### Error: `Authentication failed` al hacer seed

-   **Causa:** Credenciales incorrectas en `.env`
-   **Solución:** Verifica `DATABASE_URL`

### Error de Params Promise en detalle de producto

-   **Causa:** Uso de Next.js 15
-   **Solución:** Usa `await params` en `page.tsx` (ya corregido)

------------------------------------------------------------------------

## 📂 Estructura del Proyecto

    perezcortes-vibemarket/
    ├── README.md
    ├── eslint.config.mjs
    ├── jest.config.js
    ├── jest.prisma.ts
    ├── jest.setup.js
    ├── next.config.ts
    ├── package.json
    ├── playwright.config.ts
    ├── postcss.config.mjs
    ├── tailwind.config.ts
    ├── tsconfig.json
    ├── __tests__/
    │   ├── example.test.tsx
    │   └── api/
    ├── e2e/
    ├── prisma/
    │   ├── schema.prisma
    │   ├── seed.ts
    │   └── migrations/
    ├── src/
    │   ├── middleware.ts
    │   ├── app/
    │   ├── components/
    │   ├── lib/
    │   └── types/
    └── test-utils/

------------------------------------------------------------------------

© 2026 **VibeMarket Dev Team**
