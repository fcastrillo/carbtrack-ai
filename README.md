# CarbTrack AI 🍽️📊

**Asistente de conteo de carbohidratos con IA para manejo de diabetes**

CarbTrack AI es una PWA (Progressive Web App) que utiliza visión artificial para analizar fotos de comidas y estimar carbohidratos, integrándose con el ecosistema Nightscout/CareLink para ofrecer un ciclo de aprendizaje continuo basado en la respuesta glucémica real.

---

## 🎯 Visión del Proyecto

Transformar los datos de la bomba Medtronic en aprendizajes prácticos mediante una capa de inteligencia personalizada. La meta: **reducir la carga mental del conteo de carbohidratos** y **mejorar el tiempo en rango (TIR)** mediante retroalimentación basada en datos.

---

## ✨ Características Principales

### Fase 1 (MVP) — En Desarrollo
- 📸 **Análisis de Imágenes con IA**: Toma fotos de tus comidas y obtén estimaciones automáticas de carbohidratos
- 📚 **Catálogo Educadies**: Base de datos de alimentos con información nutricional precisa
- 📊 **Importador CSV CareLink**: Sincroniza datos de tu bomba Medtronic con Nightscout
- 📱 **PWA Offline-First**: Acceso rápido desde el móvil sin necesidad de instalación

### Fases Futuras
- 🔄 **Learning Loop** (Fase 2): Auditoría retrospectiva que compara estimaciones vs. delta glucémico real 2h post-comida
- 🏃 **Ecosistema Integrado** (Fase 3): Correlaciones con Apple Health/Google Fit para ajustes por actividad física

---

## 🛠️ Stack Tecnológico

### Frontend
- **React 19** + **Vite** + **TypeScript**
- **Tailwind CSS 4** para estilos
- **React Router** para navegación
- **lucide-react** para iconografía
- **PWA** configurado con Service Workers

### Backend
- **Supabase** (PostgreSQL + Edge Functions + Storage)
- **Deno** para Edge Functions
- **GPT-4o Vision** (próximamente) para análisis de imágenes

### Integraciones
- **Nightscout API** (fuente de verdad para datos de glucosa)
- **Medtronic CareLink** (importador CSV)

---

## 🚀 Inicio Rápido

### Prerrequisitos
- Node.js 18+ y npm
- Supabase CLI (para desarrollo local)
- Cuenta en Supabase

### Instalación

```bash
# Clonar el repositorio
git clone <repository-url>
cd carbtrack-ai

# Instalar dependencias del frontend
cd frontend
npm install

# Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus credenciales de Supabase
```

### Desarrollo Local

#### Frontend
```bash
cd frontend
npm run dev          # Servidor de desarrollo en http://localhost:5173
npm run build        # Build de producción
npm run lint         # Linting con ESLint
npm test             # Tests con Vitest (single run)
npm run test:watch   # Tests en modo watch
```

#### Supabase Local
```bash
# Iniciar servicios locales de Supabase
supabase start
# API: http://localhost:54321
# DB: postgresql://postgres:postgres@localhost:54322/postgres
# Studio: http://localhost:54323

# Edge Functions en desarrollo
supabase functions serve
```

---

## 📁 Estructura del Proyecto

```
carbtrack-ai/
├── frontend/              # React PWA
│   ├── src/
│   │   ├── pages/        # HoyPage, BitacoraPage, LaboratorioPage, etc.
│   │   ├── services/     # Capa de datos (Supabase)
│   │   ├── components/   # Componentes reutilizables
│   │   └── lib/          # Utilidades y configuración
│   └── public/           # Assets estáticos
├── supabase/
│   ├── migrations/       # Esquema de BD (PostgreSQL)
│   └── functions/        # Edge Functions (Deno)
│       ├── analyze-meal/
│       └── import-carelink-csv/
├── specs/                # Especificaciones técnicas y contratos
├── docs/                 # Documentación adicional
└── governance/           # Políticas y lineamientos
```

---

## 🗄️ Modelo de Datos

### Tablas Principales

#### `master_food_list`
Catálogo Educadies de alimentos con información nutricional
- `alimento` - Nombre del alimento
- `ch_por_racion` - Gramos de carbohidratos por ración
- `medida` - Unidad de medida (e.g., "1 pieza", "100g")
- `categoria` - Categoría del alimento

#### `meal_history`
Registro histórico de comidas y análisis
- `image_url` - URL de la foto almacenada en Storage
- `ai_analysis` - Resultado del análisis de IA (jsonb)
- `user_confirmed_carbs` - Carbohidratos confirmados por el usuario
- `timestamp` - Fecha y hora del registro

#### `pump_profile`
Configuración de la bomba de insulina
- ISF (Factor de Sensibilidad a la Insulina)
- Ratios Insulina:Carbohidratos (I:C)

---

## 🔌 Edge Functions

### `analyze-meal`
Analiza fotos de comidas y devuelve estimación de carbohidratos.

**Request:**
```json
{
  "image_url": "https://...",
  "image_base64": "data:image/jpeg;base64,..."
}
```

**Response:**
```json
{
  "items": [
    {
      "name": "Manzana",
      "carbs_grams": 15,
      "measure": "1 pieza",
      "source": "educadies"
    }
  ],
  "total_carbs": 15
}
```

### `import-carelink-csv`
Procesa archivos CSV de CareLink y extrae datos de glucosa y tratamientos.

---

## 🎨 Convenciones de Desarrollo

### Diseño y Estilos
- **Tema Oscuro**: Background `#0a0a0a`, tarjetas `#18181b`
- **Tailwind CSS**: Solo clases de utilidad, sin CSS personalizado
- **Iconos**: Exclusivamente de `lucide-react`

### Estado y Datos
- **State Management**: React local state (`useState`/`useEffect`)
- **No global store** en MVP
- **Persistencia directa** a Supabase (sin caché offline en MVP)

### Testing
- **Mock Supabase**: Todos los tests usan mocks (ver `test-utils/mockSupabase.ts`)
- **Datos sintéticos**: Nunca usar datos reales de pacientes
- **Vitest + jsdom**: Entorno de testing configurado

### Imágenes
- **Límite**: 5MB por imagen
- **Formatos**: JPEG, PNG, WebP
- **Storage**: Bucket `meal-images` con nombres UUID

---

## 📝 Documentación de Referencia

- **[CLAUDE.md](./CLAUDE.md)** - Guía para desarrollo asistido por IA
- **[PRD.md](./PRD.md)** - Product Requirements Document
- **[spec.md](./spec.md)** - Especificación técnica general
- **[specs/001-mvp-asistente-ch/](./specs/001-mvp-asistente-ch/)** - Specs detalladas del MVP
  - `spec.md` - Escenarios de aceptación
  - `data-model.md` - Esquema de base de datos
  - `contracts/edge-functions.md` - Contratos de API
  - `ACCEPTED_DEBT.md` - Deuda técnica aceptada para MVP

---

## 🔐 Variables de Entorno

### Frontend (`.env.local`)
```bash
VITE_SUPABASE_URL=https://<your-project>.supabase.co
VITE_SUPABASE_ANON_KEY=<your-anon-key>
```

### Backend (Supabase Dashboard - Secrets)
```bash
OPENAI_API_KEY=<openai-key>
NIGHTSCOUT_URL=<nightscout-instance-url>
NIGHTSCOUT_API_SECRET=<api-secret>
```

> ⚠️ **Seguridad**: Nunca expongas secrets del backend en el código del cliente

---

## 🧪 Testing

### Ejecutar Todos los Tests
```bash
cd frontend
npm test
```

### Tests en Modo Watch
```bash
npm run test:watch
```

### Test Individual
```bash
npx vitest run src/services/__tests__/profileService.test.ts
```

---

## 🗺️ Roadmap

- [x] Configuración inicial del proyecto
- [x] Esquema de base de datos
- [x] Edge Functions base
- [ ] **MVP (Fase 1)**
  - [ ] Captura y análisis de fotos
  - [ ] Integración GPT-4o Vision
  - [ ] Importador CSV funcional
  - [ ] UI completa (5 tabs)
- [ ] **Learning Loop (Fase 2)**
  - [ ] Motor de auditoría retrospectiva
  - [ ] Correlación glucemia-carbohidratos
- [ ] **Ecosistema (Fase 3)**
  - [ ] Integración Apple Health
  - [ ] Integración Google Fit
  - [ ] Ajustes por actividad física

---

## 📄 Licencia

Este proyecto está en desarrollo privado. Para información sobre uso y licencia, contacta al propietario del repositorio.

---

## 🤝 Contribuciones

Actualmente, este es un proyecto personal. Si tienes sugerencias o encuentras bugs, por favor abre un issue en el repositorio.

---

## 📧 Contacto

Para preguntas o colaboraciones, contacta a través del repositorio de GitHub.

---

**Hecho con ❤️ para mejorar la calidad de vida de personas con diabetes**
