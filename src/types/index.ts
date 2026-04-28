export type Currency = "usd" | "ves_bcv" | "ves_parallel" | "eur" | "cop";

export type PaymentCategory =
  | "venezuela"
  | "international"
  | "colombia"
  | "crypto"
  | "contact";

export interface PaymentMethod {
  id: string;
  category: PaymentCategory;
  name: string;
  icon: string | null;
  fields: Record<string, string>;
  notes: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export type EquipmentStatus = "pendiente" | "comprado";

export interface Equipment {
  id: string;
  name: string;
  description: string | null;
  price_usd: number;
  status: EquipmentStatus;
  sort_order: number;
  created_at: string;
}

export interface Donation {
  id: string;
  donor_name: string;
  amount_usd: number;
  message: string | null;
  is_anonymous: boolean;
  created_at: string;
}

export interface ExchangeRate {
  currency: string;
  rate: number;
  updated_at: string;
}

export interface SiteConfig {
  key: string;
  value: string;
}

export interface ExchangeRates {
  ves_bcv: number;
  ves_parallel: number;
  eur: number;
  cop: number;
  updated_at: string;
}
