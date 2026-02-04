# SPEC.md: Asistente de Diabetes con IA (Visión y Análisis)

## 1. Visión y Alcance (Vision & Scope)
### 1.1 Propósito
Desarrollar una capa de inteligencia personalizada sobre Nightscout que transforme los datos crudos de la bomba Medtronic en aprendizajes prácticos. La meta es reducir la carga mental del conteo de carbohidratos mediante visión artificial y mejorar el tiempo en rango (TIR) mediante un ciclo de retroalimentación de datos.

### 1.2 Fases del Proyecto
* **Fase 1 (Infraestructura):** Configuración de Supabase, conexión con Nightscout API, importador de CSV Medtronic y catálogo de Educadies.
* **Fase 2 (IA & Captura):** Implementación de cámara con reconocimiento de alimentos y sugerencia de carbohidratos en tiempo real.
* **Fase 3 (Aprendizaje):** Motor de auditoría retrospectiva que compara fotos vs. respuesta glucémica real 2h post-prandial.
* **Fase 4 (Futuro):** Integración con Apple Health/Google Fit para correlacionar ejercicio con sensibilidad a la insulina.

## 2. Características Técnicas (Tech Stack Sugerido)
Para garantizar rapidez, seguridad y facilidad de mantenimiento, se sugiere:

* **Frontend:** React con Vite (o Next.js) + Tailwind CSS. Configurado como **PWA** para acceso rápido desde el móvil.
* **Backend & DB:** **Supabase** (PostgreSQL) para manejo de usuarios, almacenamiento de imágenes y base de datos de alimentos.
* **Inteligencia Artificial:** OpenAI API (**GPT-4o Vision**) para análisis de platos de comida.
* **Integración de Datos:** Nightscout API (con autenticación SHA1) como fuente de verdad de glucosa e insulina.
* **Procesamiento de Archivos:** Librería `PapaParse` (JS) para procesar el CSV multisección de Medtronic directamente en el cliente.

## 3. Modelo de Datos (Esquema Supabase)

### 3.1 Tabla: `master_food_list` (Diccionario Educadies)
* `id`: uuid (PK)
* `alimento`: string (Nombre del alimento para búsqueda semántica)
* `ch_por_racion`: float (Gramos de carbohidratos base)
* `medida`: string (e.g., "1 pieza", "100g", "1 taza")
* `categoria`: string (e.g., "Legumbres", "Frutas")

### 3.2 Tabla: `meal_history` (Registro Diario)
* `id`: uuid (PK)
* `user_id`: uuid (FK a auth.users)
* `image_url`: string (Bucket de Supabase Storage)
* `ai_analysis`: jsonb (Alimentos detectados y gramos estimados)
* `user_confirmed_carbs`: integer (Valor final usado por el usuario)
* `glucose_at_meal`: integer (SGV de Nightscout en el momento de la foto)
* `timestamp`: datetime (Local y UTC)

### 3.3 Tabla: `glucose_insights` (Motor de Feedback)
* `id`: uuid (PK)
* `meal_id`: uuid (FK a meal_history)
* `delta_2h`: float (Diferencia de glucosa 2h después)
* `recomendacion`: text (e.g., "Este alimento requiere un 15% más de insulina")
* `status`: enum (pendiente, revisado)

## 4. Flujos de Trabajo (Workflows)

### 4.1 Flujo Diario: Captura de Foto
1. El usuario abre la cámara en la PWA y toma foto del plato.
2. La IA analiza la imagen y busca coincidencias en `master_food_list`.
3. La App muestra una sugerencia: "Parece una manzana (15g) y un yogurt (10g). Total: 25g".
4. El usuario confirma el dato en la App y lo ingresa manualmente en su bomba.

### 4.2 Flujo Semanal: Sincronización y Auditoría
1. Carga de CSV de Medtronic en la sección "Sync".
2. Procesamiento de los dos bloques (Treatments y Entries) hacia Nightscout.
3. El sistema busca cada registro de `meal_history` de la semana.
4. Consulta en Nightscout la glucosa 2 horas después de cada foto.
5. Genera un reporte de "Lecciones Aprendidas" para alimentos específicos.

## 5. Requerimientos de UI/UX
* **Dashboard:** Valor SGV actual grande con flecha de tendencia y tiempo desde la última comida.
* **Modo Offline:** Capacidad de tomar la foto y guardarla localmente si no hay internet, sincronizando después.
* **Accesibilidad:** Botones grandes para uso rápido antes de comer.