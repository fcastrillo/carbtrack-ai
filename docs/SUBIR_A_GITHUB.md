# Subir CarbTrack a GitHub

Pasos para tener el proyecto en tu cuenta de GitHub desde cero.

## 1. Revisar qué se va a subir

Ya existe un `.gitignore` en la raíz que excluye `node_modules/`, `.env`, `dist/`, etc. Revisa que no quieras versionar algo sensible (claves, datos de salud).

```bash
git status
```

## 2. Añadir todos los archivos y hacer el primer commit

Desde la raíz del proyecto:

```bash
git add .
git status   # revisar que solo se añadan lo que quieres
git commit -m "chore: initial commit — PRD, spec, spec-kit setup, guía de implementación"
```

## 3. Crear el repositorio en GitHub

**Opción A — Navegador**

1. Entra en [github.com](https://github.com) e inicia sesión.
2. Clic en **"+"** (arriba derecha) → **"New repository"**.
3. **Repository name:** por ejemplo `carbtrack-ai`.
4. **Description:** opcional, ej. "Asistente de conteo de carbohidratos con IA".
5. Elige **Private** o **Public**.
6. **No** marques "Add a README", "Add .gitignore" ni "Choose a license" (ya tienes contenido local).
7. Clic en **"Create repository"**.

**Opción B — GitHub CLI** (si tienes `gh` instalado)

```bash
gh repo create carbtrack-ai --private --source=. --remote=origin --push
```

Si usas Opción B, el paso 4 y 5 se hacen con ese comando. Si usas Opción A, sigue con 4 y 5.

## 4. Conectar tu repo local con GitHub

En la página del repo nuevo, GitHub muestra comandos. Usa estos (sustituye `TU_USUARIO` por tu usuario de GitHub):

```bash
git remote add origin https://github.com/TU_USUARIO/carbtrack-ai.git
```

Para SSH (si usas llaves):

```bash
git remote add origin git@github.com:TU_USUARIO/carbtrack-ai.git
```

Comprobar:

```bash
git remote -v
```

## 5. Subir la rama `master` (o `main`)

Si tu rama se llama `master`:

```bash
git push -u origin master
```

Si prefieres que el repo use `main` (estándar actual de GitHub):

```bash
git branch -M main
git push -u origin main
```

A partir de aquí, los siguientes cambios serán:

```bash
git add .
git commit -m "descripción del cambio"
git push
```

---

**Nota:** Si más adelante usas spec-kit con ramas por feature (ej. `001-mvp-captura`), subirás esas ramas con `git push origin nombre-rama` o configurando el upstream según el flujo que uses.
