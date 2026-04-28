-- ============================================================
-- GoFundMe CEII — Schema inicial
-- ============================================================

-- Tabla de configuración del sitio (meta, nombre, descripción)
CREATE TABLE site_config (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de equipos
CREATE TABLE equipment (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price_usd NUMERIC(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pendiente' CHECK (status IN ('pendiente', 'comprado')),
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de donaciones
CREATE TABLE donations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  donor_name TEXT NOT NULL,
  amount_usd NUMERIC(10,2) NOT NULL CHECK (amount_usd > 0),
  message TEXT,
  is_anonymous BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de caché de tasas cambiarias
CREATE TABLE exchange_rates_cache (
  currency TEXT PRIMARY KEY,
  rate NUMERIC(15,4) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- Row Level Security
-- ============================================================

ALTER TABLE site_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE exchange_rates_cache ENABLE ROW LEVEL SECURITY;

-- Lectura pública para visitantes anónimos
CREATE POLICY "public_read" ON site_config
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "public_read" ON equipment
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "public_read" ON donations
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "public_read" ON exchange_rates_cache
  FOR SELECT TO anon, authenticated USING (true);

-- Nota: service_role bypasses RLS — las escrituras del panel admin usan ese rol.

-- ============================================================
-- Datos iniciales
-- ============================================================

INSERT INTO site_config (key, value) VALUES
  ('goal_amount_usd', '1329'),
  ('project_name', 'CEII - Centro de Informática'),
  ('project_description', 'Recaudación de fondos para equipar el laboratorio con internet Starlink e infraestructura de red para los estudiantes.');

INSERT INTO equipment (name, description, price_usd, status, sort_order) VALUES
  ('Antena Starlink Standard Kit', 'Kit de antena satelital para acceso a internet de alta velocidad', 599.00, 'pendiente', 1),
  ('Plan mensual Starlink 100-250 Mbps', 'Suscripción mensual al servicio de internet satelital Starlink', 120.00, 'pendiente', 2),
  ('Router potente (Ubiquiti o similar)', 'Router de alto rendimiento para distribución de red en el laboratorio', 150.00, 'pendiente', 3),
  ('MikroTik (hAP ac3 o RB4011)', 'Equipo para administración y gestión avanzada de la red', 120.00, 'pendiente', 4),
  ('UPS / Respaldo energético', 'Sistema de alimentación ininterrumpida para proteger los equipos ante cortes', 200.00, 'pendiente', 5),
  ('Protector de voltaje + supresor', 'Protección contra variaciones de voltaje e interferencias eléctricas', 60.00, 'pendiente', 6),
  ('Cableado y materiales de instalación', 'Cables, conectores y accesorios necesarios para la instalación completa', 80.00, 'pendiente', 7);

-- Tasas iniciales de referencia (se actualizan automáticamente via API)
INSERT INTO exchange_rates_cache (currency, rate, updated_at) VALUES
  ('ves_bcv', 50.00, NOW()),
  ('ves_parallel', 55.00, NOW()),
  ('eur', 0.92, NOW()),
  ('cop', 4200.00, NOW());
