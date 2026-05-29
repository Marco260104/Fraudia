# 🗄️ Guía de Base de Datos PostgreSQL — Fraudia

Este documento detalla la estructura relacional de la base de datos de **Fraudia**, las instrucciones para levantarla de manera local con **Docker** e indicaciones para desplegarla en un servidor gratuito en la nube.

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

## 2. Ejecución Local con Docker

Para levantar la base de datos en tu computadora local de forma rápida y aislada, utiliza el archivo `docker-compose.yml` provisto en la raíz.

### Requisitos previos:
* Tener instalado **Docker Desktop** y que esté activo.

### Instrucciones de Inicio:

1. **Levantar el contenedor:**
   Abre una terminal en la raíz del proyecto y ejecuta:
   ```bash
   docker-compose up -d
   ```
   *Esto descargará la imagen oficial liviana de PostgreSQL (`postgres:15-alpine`) y levantará el servicio en segundo plano.*

2. **Verificar que esté corriendo:**
   ```bash
   docker ps
   ```
   *Deberías ver un contenedor activo con el nombre `fraudia_postgres_db` en el puerto `5432`.*

3. **Detener el contenedor:**
   ```bash
   docker-compose down
   ```

---

## 3. Ingesta Automática de Datos (Carga)

Hemos creado un script en Python que realiza las siguientes acciones automáticamente:
1. Crea la estructura completa de las tablas relacionales (`backend/database_schema.sql`).
2. Normaliza los datos (valores monetarios, booleanos, formatos de fechas).
3. Resuelve dependencias de llaves foráneas y carga todos los registros.
4. **Inteligencia de Origen:** Lee prioritariamente el archivo original de Excel si está presente en la carpeta de descargas del usuario; de lo contrario, utiliza los archivos CSV locales pre-cargados en `backend/DataEnt/` de forma transparente.

### Cómo ejecutar la carga:

1. Asegúrate de tener levantado el contenedor de Docker (`docker-compose up -d`).
2. Configura tu archivo `.env` en la raíz (puedes copiar el `.env.example`).
3. Instala las dependencias necesarias:
   ```bash
   pip install -r backend/requirements.txt
   ```
4. Ejecuta el script de ingesta:
   ```bash
   python -m backend.src.ingestion.load_data
   ```

---

## 4. Despliegue en un Servidor Gratis (Nube)

Cuando llegue el momento de desplegar el prototipo final para el hackathon y compartir la API en línea sin depender de tu computadora local, pueden utilizar cualquiera de los siguientes servicios gratuitos populares:

### Opción A: Supabase (Recomendado ⭐)
Supabase te regala un proyecto de PostgreSQL en la nube 100% gratuito.
1. Crea una cuenta en [supabase.com](https://supabase.com/).
2. Crea un nuevo proyecto.
3. Ve a **Settings -> Database** y copia el **Connection String** en formato `URI`.
4. Actualiza tu archivo `.env` en producción con los datos de Supabase.
5. Ejecuta tu script de ingesta `load_data.py` apuntando a esa URI para rellenar la base de datos en la nube al instante.

### Opción B: Neon (PostgreSQL Serverless)
Neon ofrece bases de datos PostgreSQL rápidas con un plan gratuito muy generoso.
1. Regístrate en [neon.tech](https://neon.tech/).
2. Crea un proyecto y copia tu cadena de conexión.
3. Configúralo en tu `.env` de producción.

### Opción C: Render
Render permite hospedar bases de datos PostgreSQL gratis por 90 días por proyecto.
1. Crea una cuenta en [render.com](https://render.com/).
2. Crea una **New PostgreSQL Database**.
3. Copia el **External Connection String** y configúralo en tu aplicación.
