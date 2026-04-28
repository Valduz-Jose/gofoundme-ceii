CREATE TABLE payment_methods (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  category    text        NOT NULL CHECK (category IN ('venezuela', 'international', 'colombia', 'crypto', 'contact')),
  name        text        NOT NULL,
  icon        text,
  fields      jsonb       NOT NULL DEFAULT '{}'::jsonb,
  notes       text,
  is_active   boolean     DEFAULT true,
  sort_order  integer     DEFAULT 0,
  created_at  timestamptz DEFAULT now(),
  updated_at  timestamptz DEFAULT now()
);

ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anon_read_active"
  ON payment_methods FOR SELECT TO anon
  USING (is_active = true);

CREATE POLICY "admin_all"
  ON payment_methods FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

CREATE TRIGGER payment_methods_updated_at
  BEFORE UPDATE ON payment_methods
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

INSERT INTO payment_methods (category, name, icon, fields, notes, sort_order) VALUES
('venezuela',    'Pago Móvil',  '📱', '{"Banco":"Banesco (0134)","Cédula":"V-XXXXXXXX","Teléfono":"0414-XXXXXXX","A nombre de":"NOMBRE TITULAR"}'::jsonb, 'Disponible 24/7.', 1),
('international','Zelle',       '💵', '{"Email":"correo@ejemplo.com","A nombre de":"NOMBRE TITULAR"}'::jsonb, 'Solo desde bancos de EE.UU.', 1),
('colombia',     'Nequi',       '🟣', '{"Número":"300-XXXXXXX","A nombre de":"NOMBRE TITULAR"}'::jsonb, 'Desde cualquier banco colombiano.', 1),
('crypto',       'USDT (TRC20)','₮',  '{"Dirección":"TXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX","Red":"TRC20 (Tron)"}'::jsonb, 'Verificar la red antes de enviar. Mínimo: $5.', 1);
