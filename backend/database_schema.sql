-- Esquema SQL de inicialización de la base de datos Fraudia

-- Eliminar tablas si existen (por orden de dependencia para evitar errores de FK)
DROP TABLE IF EXISTS documentos CASCADE;
DROP TABLE IF EXISTS siniestros CASCADE;
DROP TABLE IF EXISTS proveedores CASCADE;
DROP TABLE IF EXISTS polizas CASCADE;
DROP TABLE IF EXISTS asegurados CASCADE;

-- 1. Tabla: Asegurados
CREATE TABLE asegurados (
    id_asegurado VARCHAR(50) PRIMARY KEY,
    nombres_asegurado VARCHAR(255),
    segmento VARCHAR(50),
    ciudad VARCHAR(100),
    antiguedad_asegurado INT,
    n_polizas_activas INT,
    reclamos_ult_12m INT,
    reclamos_historico_total INT,
    reclamos_rc_sin_tercero INT,
    perfil_riesgo_historico VARCHAR(50)
);

-- 2. Tabla: Pólizas
CREATE TABLE polizas (
    id_poliza VARCHAR(50) PRIMARY KEY,
    id_asegurado VARCHAR(50) REFERENCES asegurados(id_asegurado) ON DELETE CASCADE,
    ramo_poliza VARCHAR(100),
    fecha_inicio DATE,
    fecha_fin DATE,
    suma_asegurada NUMERIC(15, 2),
    prima_anual NUMERIC(15, 2),
    canal_venta VARCHAR(100),
    estado_poliza VARCHAR(50)
);

-- 3. Tabla: Proveedores
CREATE TABLE proveedores (
    id_proveedor VARCHAR(50) PRIMARY KEY,
    nombre_proveedor VARCHAR(255),
    tipo_proveedor VARCHAR(100),
    ciudad_proveedor VARCHAR(100),
    siniestros_asociados INT,
    lista_restrictiva VARCHAR(10),
    motivo_restriccion VARCHAR(255),
    promedio_monto NUMERIC(15, 2)
);

-- 4. Tabla: Siniestros
CREATE TABLE siniestros (
    id_siniestro VARCHAR(50) PRIMARY KEY,
    id_poliza VARCHAR(50) REFERENCES polizas(id_poliza) ON DELETE CASCADE,
    id_asegurado VARCHAR(50) REFERENCES asegurados(id_asegurado) ON DELETE CASCADE,
    ramo VARCHAR(100),
    placa_vehiculo_asegurado VARCHAR(50),
    cobertura VARCHAR(100),
    fecha_ocurrencia DATE,
    fecha_reporte DATE,
    dias_ocurrencia_reporte INT,
    monto_reclamado NUMERIC(15, 2),
    monto_estimado NUMERIC(15, 2),
    monto_pagado NUMERIC(15, 2),
    estado VARCHAR(50),
    sucursal VARCHAR(100),
    id_proveedor VARCHAR(50) REFERENCES proveedores(id_proveedor) ON DELETE SET NULL,
    descripcion_evento TEXT,
    docs_completos VARCHAR(10),
    prov_lista_restrictiva VARCHAR(10),
    dias_desde_inicio_poliza INT,
    dias_hasta_fin_poliza INT,
    reclamos_previos_asegurado INT,
    suma_asegurada NUMERIC(15, 2),
    similitud_narrativa_max NUMERIC(5, 4),
    numero_parte_policial VARCHAR(50)
);

-- 5. Tabla: Documentos
CREATE TABLE documentos (
    id_documento VARCHAR(50) PRIMARY KEY,
    id_siniestro VARCHAR(50) REFERENCES siniestros(id_siniestro) ON DELETE CASCADE,
    tipo_documento VARCHAR(255),
    nombre_archivo_pdf VARCHAR(255)
);

-- Índices recomendados para optimizar búsquedas frecuentes
CREATE INDEX idx_siniestros_poliza ON siniestros(id_poliza);
CREATE INDEX idx_siniestros_asegurado ON siniestros(id_asegurado);
CREATE INDEX idx_siniestros_proveedor ON siniestros(id_proveedor);
CREATE INDEX idx_documentos_siniestro ON documentos(id_siniestro);
