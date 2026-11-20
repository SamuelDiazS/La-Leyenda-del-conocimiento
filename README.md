# ⚔️ LA LEYENDA DEL CONOCIMIENTO
### MMORPG Educativo 2D &bull; Pruebas Saber 11 (ICFES) Colombia

Bienvenido a **La Leyenda del Conocimiento**, un videojuego MMORPG 2D de fantasía medieval para navegador inspirado en los grandes clásicos como *World of Warcraft (WoW)*. En este universo, la restauración del mundo de **Aethoria** frente al avance del **Vacío** se encuentra entrelazada orgánicamente con el desarrollo y evaluación de competencias de las pruebas **Saber 11 (ICFES)** en Colombia.

---

## 🌟 Características Principales

1. **El Conocimiento es Poder (No cuestionarios disfrazados)**:
   - 📖 **Lectura Crítica**: Desarticulación de testimonios contradictorios de NPCs, interpretación de documentos antiguos y reconstrucción histórica en ruinas milenarias.
   - 📐 **Matemáticas**: Calibración de compuertas rúnicas con razones y proporciones, optimización espacial y coordenadas.
   - ⚡ **Física**: Balística y trayectorias parabólicas, palancas y sistemas de polea móvil con ventaja mecánica y conservación de energía.
2. **Motor de Juego 2D con Phaser 3**:
   - Escenario continuo de 1600x1200 en el *Valle de los Despertares*.
   - Movimiento fluido con teclado (WASD / Flechas) y mouse.
   - Cámara dinámica con seguimiento cinemático.
   - Sistema de colisiones con pilares rúnicos y límites del mundo.
   - Ciclo visual de iluminación día y noche.
   - NPCs interactivos con diálogos narrativos y misiones (*Maestro Vaelen*, *Herrero Brom*, *Arcanista Lyra*).
   - Combate en tiempo real contra enemigos (*Sombras del Vacío*, *Desmemoriados Errantes*), aggro, daño flotante, animaciones de ataque y botín.
3. **Sistema RPG Completo**:
   - **5 Razas**: Humanos de Aethoria, Elfos de Lunaria, Enanos de Forjaterra, Dracónidos y Sylvanos (con habilidades raciales activas y pasivas).
   - **6 Clases**: Guardián (Tanque), Arcanista (Magia), Explorador (Distancia), Invocador (Apoyo), Ingeniero Rúnico (Utilidad) y Erudito (Soporte).
   - Creador y personalizador visual de personajes con vista previa 2D en tiempo real (tono de piel, color y estilo de cabello, vestimenta, capa, armas).
   - Atributos distribuibles: Fuerza, Inteligencia, Agilidad, Resistencia, Percepción y Sabiduría.
   - Barra de habilidades (Hotbar 1-6) con tiempos de reutilización y costes de maná/furia.
   - Mochila de 40 casillas con gestión de ítems, rarezas (Común, Poco común, Raro, Épico, Legendario) y equipamiento en muñeco de papel.
   - Registro de misiones del Capítulo I con avance en tiempo real.
   - Chat en el juego (General, Mundo, Sistema).
4. **Panel de Administración Dedicado (`/admin`)**:
   - Dashboard de usuarios registrados y personajes en tiempo real.
   - Gráficos y análisis de desempeño por área ICFES (Lectura Crítica, Matemáticas, Física).
   - Tasa de acierto, tiempo promedio de resolución y evolución histórica.
   - Inspección detallada de héroes, inventarios y estadísticas.
   - Registro de auditoría de seguridad del servidor.
   - **Cuenta de Administración Inicial**: `Fredy` / `Admin_JL2026` con cambio obligatorio de contraseña en el primer inicio.
5. **Arquitectura y Persistencia**:
   - Next.js con App Router y TypeScript.
   - Validación robusta de formularios y transacciones en servidor con Zod.
   - Autenticación segura mediante cookies `HttpOnly` y hash de contraseñas con Bcrypt / Argon2.
   - Compatible nativamente con **Neon PostgreSQL** y **Vercel**.
   - Arquitectura dual: Si `DATABASE_URL` no está configurada inicialmente, el sistema ejecuta un repositorio reactivo en memoria con persistencia de sesión completa para jugar inmediatamente sin bloqueos.

---

## 🚀 Requisitos Previos

- **Node.js**: v18.0.0 o superior (recomendado v20+ o v24).
- **npm** o **pnpm**.

---

## 🛠️ Instalación y Ejecución Local

1. **Clonar o entrar al repositorio**:
   ```bash
   cd "La Leyenda del conocimiento"
   ```

2. **Instalar dependencias**:
   ```bash
   npm install
   ```

3. **Configurar Variables de Entorno**:
   Copia el archivo `.env.example` a `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
   *(En Windows PowerShell: `Copy-Item .env.example .env.local`)*

4. **Iniciar el servidor de desarrollo**:
   ```bash
   npm run dev
   ```
   Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

---

## 🗄️ Configuración de la Base de Datos (Neon PostgreSQL)

1. Crea una cuenta y un nuevo proyecto en [Neon.tech](https://neon.tech).
2. Copia la cadena de conexión de tu base de datos (Connection string de PostgreSQL).
3. Añade la URL en tu archivo `.env.local`:
   ```env
   DATABASE_URL=postgresql://usuario:password@ep-sample.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```
4. Ejecuta el esquema estructural obligatorio `schema.sql` en la consola SQL de Neon (o mediante tu cliente SQL preferido).
5. Opcional: Ejecuta `seed.sql` para cargar todas las razas, clases, habilidades, misiones, objetos y actividades educativas del Capítulo I.

---

## 🌐 Despliegue en Vercel

1. Sube el repositorio a GitHub.
2. Ingresa a [Vercel](https://vercel.com) e importa el proyecto.
3. En la sección **Environment Variables**, configura:
   - `DATABASE_URL`: Tu conexión de Neon PostgreSQL.
   - `SESSION_SECRET`: Una cadena segura de al menos 32 caracteres.
   - `INITIAL_ADMIN_USERNAME`: `Fredy`
   - `INITIAL_ADMIN_PASSWORD`: `Admin_JL2026`
   - `NEXT_PUBLIC_APP_URL`: La URL pública de tu aplicación en Vercel.
   - `ABLY_API_KEY`: Tu clave de Ably Realtime (opcional, para sincronización multi-instancia).
4. Haz clic en **Deploy**. El archivo `vercel.json` y el build de Next.js optimizarán automáticamente el proyecto para producción serverless.

---

## 🔐 Credenciales Iniciales

- **Panel de Administración (`/admin` o `/login`)**:
  - **Usuario**: `Fredy`
  - **Contraseña inicial**: `Admin_JL2026`
  - *(El sistema exigirá el cambio obligatorio de la contraseña en el primer inicio por seguridad).*

- **Cuenta de Jugador de Prueba**:
  - **Usuario**: `ViajeroValiente`
  - **Contraseña**: `Aethoria2026!`
  - *(O puedes registrar cualquier nuevo usuario desde `/register`).*

---

## 🎮 Controles del Juego

- **WASD / Flechas**: Mover personaje en el mundo 2D.
- **Teclas 1 - 6**: Ejecutar habilidades activas de la barra de acción.
- **E**: Interactuar con NPCs cercanos (*Maestro Vaelen*, *Herrero Brom*, *Arcanista Lyra*).
- **I**: Abrir / Cerrar Inventario y bolsa de objetos.
- **C**: Abrir / Cerrar Ficha del Héroe y distribución de atributos.
- **J**: Abrir / Cerrar Registro de Misiones (Quest Log).
- **M**: Abrir / Cerrar Mapa Continental de Aethoria.
- **Click Izquierdo**: Seleccionar objetivos / enemigos o interactuar con la interfaz.
- **ESC**: Cerrar ventanas y modales activos.

---

## 📁 Estructura del Proyecto

```
├── schema.sql                 # Estructura canónica completa de la base de datos Neon
├── seed.sql                   # Catálogo inicial de razas, clases, misiones y Saber 11
├── vercel.json                # Configuración de despliegue en Vercel
├── .env.example               # Plantilla de variables de entorno
├── src/
│   ├── app/
│   │   ├── api/               # API Routes seguras con validación Zod y transacciones
│   │   │   ├── auth/          # Registro, login, logout, sesión
│   │   │   ├── character/     # Creación, consulta y atributos del héroe
│   │   │   ├── game/          # Autoguardado, combate seguro, envío Saber 11
│   │   │   └── admin/         # Estadísticas globales, métricas ICFES, auditoría
│   │   ├── admin/             # Portal del administrador
│   │   ├── character-create/  # Customizer 2D con preview reactivo
│   │   ├── character-select/  # Selector de héroes de la cuenta
│   │   ├── game/              # Pantalla principal del MMORPG
│   │   ├── login/             # Portal de acceso
│   │   ├── register/          # Registro de nuevos viajeros
│   │   └── page.tsx           # Landing page cinemática
│   ├── components/
│   │   ├── game/              # Canvas Phaser 3, HUD MMO, Inventario, Ficha, Quests, Desafío Saber 11
│   │   └── admin/             # Dashboard, tablas de jugadores, gráficas pedagógicas
│   ├── lib/
│   │   ├── auth/              # Bcrypt, JWT y cookies de sesión HttpOnly
│   │   ├── db/                # Neon PostgreSQL client y repositorio unificado
│   │   ├── game/              # Tipos, constantes, catalogo pedagógico y sintetizador de audio
│   │   ├── phaser/            # Escenas 2D Phaser (BootScene, WorldScene, GameEngine)
│   │   └── realtime/          # Integración Ably Realtime
│   └── store/
│       └── useGameStore.ts    # Estado global reactivo Zustand
```

---

## 📜 Licencia

Proyecto educativo desarrollado con los estándares de Google Antigravity para el fomento de competencias académicas a través de la gamificación inmersiva.
