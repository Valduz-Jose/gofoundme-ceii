import { createServiceClient } from "@/lib/supabase/server";
import type { ExchangeRates } from "@/types";

interface DolarApiRate {
  nombre: string;
  compra: number | null;
  venta: number | null;
  promedio: number | null;
  fechaActualizacion: string;
}

async function fetchVesRates(): Promise<{ bcv: number; parallel: number } | null> {
  try {
    const res = await fetch("https://ve.dolarapi.com/v1/dolares", {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as DolarApiRate[];
    const bcv = data.find((r) => r.nombre.toLowerCase().includes("oficial"));
    const parallel = data.find((r) => r.nombre.toLowerCase().includes("paralelo"));
    if (!bcv?.promedio || !parallel?.promedio) return null;
    return { bcv: bcv.promedio, parallel: parallel.promedio };
  } catch {
    return null;
  }
}

async function fetchFxRates(): Promise<{ eur: number; cop: number } | null> {
  try {
    const res = await fetch("https://open.er-api.com/v6/latest/USD", {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { rates: Record<string, number> };
    if (!data.rates?.EUR || !data.rates?.COP) return null;
    return { eur: data.rates.EUR, cop: data.rates.COP };
  } catch {
    return null;
  }
}

async function getCachedRates(): Promise<ExchangeRates> {
  const supabase = createServiceClient();
  const { data } = await supabase
    .from("exchange_rates_cache")
    .select("currency, rate, updated_at");

  const fallback = { ves_bcv: 50, ves_parallel: 55, eur: 0.92, cop: 4200 };
  if (!data?.length) return { ...fallback, updated_at: new Date().toISOString() };

  const map = Object.fromEntries(data.map((r) => [r.currency, Number(r.rate)]));
  return {
    ves_bcv: map["ves_bcv"] ?? fallback.ves_bcv,
    ves_parallel: map["ves_parallel"] ?? fallback.ves_parallel,
    eur: map["eur"] ?? fallback.eur,
    cop: map["cop"] ?? fallback.cop,
    updated_at: data[0].updated_at,
  };
}

async function updateRatesCache(rates: ExchangeRates): Promise<void> {
  const supabase = createServiceClient();
  const now = new Date().toISOString();
  await supabase.from("exchange_rates_cache").upsert([
    { currency: "ves_bcv", rate: rates.ves_bcv, updated_at: now },
    { currency: "ves_parallel", rate: rates.ves_parallel, updated_at: now },
    { currency: "eur", rate: rates.eur, updated_at: now },
    { currency: "cop", rate: rates.cop, updated_at: now },
  ]);
}

export async function getExchangeRates(): Promise<ExchangeRates> {
  const [vesRates, fxRates] = await Promise.all([fetchVesRates(), fetchFxRates()]);

  if (vesRates && fxRates) {
    const rates: ExchangeRates = {
      ves_bcv: vesRates.bcv,
      ves_parallel: vesRates.parallel,
      eur: fxRates.eur,
      cop: fxRates.cop,
      updated_at: new Date().toISOString(),
    };
    void updateRatesCache(rates).catch(() => {});
    return rates;
  }

  return getCachedRates();
}
