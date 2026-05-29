# 🗄️ Guía de Ecosistema Dockerizado — Fraudia

Este documento detalla la estructura relacional de la base de datos de **Fraudia** y las instrucciones para levantar **todo el ecosistema completo (Base de Datos, API FastAPI y Frontend React)** mediante **Docker Compose**.

---

## 1. Estructura Relacional (Modelo Entidad-Relación)

La base de datos relacional vincula las 5 entidades principales del dataset:

* **Asegurados:** Contiene la información histórica y perfiles de riesgo de los clientes.
* **Pólizas:** Detalles contractuales de cada póliza asociada a un asegurado.
* **Proveedores:** Clínicas, talleres o peritos que prestan servicios asociados al reclamo.
* **Siniestros:** La tabla central con montos reclamados, descripciones del incidente y scores de riesgo de fraude.
* **Documentos:** PDFs cargados (como denuncias policiales, facturas, etc.) adjuntos a cada siniestro.

### Relaciones entre Tablas:
```
  [Asegurados] 1 --------- * [Pólizas]
       1                          1
       |                          |
       *                          *
  [.......... Siniestros ..........]
       *                          *
       |                          |
       1                          1
  [Proveedores]              [Documentos]
```

---

## 2. Ejecución Completa Multicontenedor (Ecosistema Total)

Hemos integrado Dockerfiles dedicados para el backend y el frontend, unificados mediante un puente de red en `docker-compose.yml`. Esto te permite levantar **todo el sistema** con un solo comando.

### Requisitos previos:
* Tener instalado **Docker Desktop** y que esté activo.

---

### 🚀 Guía de Inicio Rápido (Un Solo Paso)

1. **Compilar y levantar todos los servicios:**
   Abre una terminal en la raíz del proyecto y ejecuta:
   ```bash
   docker compose up --build -d
   ```
   *Este comando descargará PostgreSQL, compilará la imagen de la API FastAPI y la aplicación React Vite, e iniciará todos los contenedores en segundo plano.*

2. **Verificar que todos estén activos:**
   ```bash
   docker compose ps
   ```
   Deberías ver tres contenedores corriendo alegremente:
   - `fraudia_postgres_db` (Base de Datos) en el puerto `5432`
   - `fraudia_backend_api` (API FastAPI) en el puerto `8000`
   - `fraudia_frontend_web` (Frontend React) en el puerto `5173`

3. **Poblar la Base de Datos desde el Contenedor:**
   Como la base de datos corre dentro de Docker, ejecuta el script de ingesta de datos directamente en el contenedor del backend con este comando:
   ```bash
   docker compose exec backend python -m src.ingestion.load_data
   ```
   *Esto conectará el script con PostgreSQL de forma interna, estructurará las tablas y cargará todos los siniestros y pólizas al instante.*

4. **Acceder a la aplicación:**
   - **Frontend (Interfaz Web):** Abre en tu navegador [http://localhost:5173](http://localhost:5173) (completamente enlazada y con hot-reload activo para desarrollo).
   - **Backend (Documentación Swagger):** Abre [http://localhost:8000/docs](http://localhost:8000/docs) para probar los endpoints interactivos de la API.

5. **Detener y apagar todo:**
   ```bash
   docker compose down
   ```

---

## ⚡ Recarga en Vivo y Desarrollo Seguro

Los contenedores utilizan **volúmenes compartidos (`volumes`)**. Esto significa que:
* Cualquier cambio que hagas en tu código local en la carpeta `backend/` o `frontend/` se reflejará **inmediatamente** dentro de los contenedores en tiempo real. No tienes que detener ni volver a construir las imágenes cada vez que edites código.
* No interfiere con el flujo clásico. Si tu compañero del frontend prefiere usar `npm run dev` de forma local independiente, seguirá funcionando de forma exacta sin romper nada.

---

## ☁️ Despliegue en un Servidor Gratis (Nube)

Para subir el ecosistema final a internet sin costo:
* **Base de Datos:** Despliéguenla en **Supabase** o **Neon.tech** (PostgreSQL gratuito) y actualicen el archivo `.env`.
* **Backend API:** Súbanla a **Render** o **Railway** con soporte de Docker Desktop (Render lee el Dockerfile de la carpeta backend automáticamente).
* **Frontend Web:** Súbanlo a **Vercel** o **Netlify** apuntando a la URL pública del backend de Render.
