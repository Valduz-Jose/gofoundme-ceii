import type { Currency, ExchangeRates } from "@/types";

const CURRENCY_LABELS: Record<Currency, string> = {
  usd: "USD",
  ves_bcv: "VES (BCV)",
  ves_parallel: "VES (Paralelo)",
  eur: "EUR",
  cop: "COP",
};

const CURRENCY_SYMBOLS: Record<Currency, string> = {
  usd: "$",
  ves_bcv: "Bs.",
  ves_parallel: "Bs.",
  eur: "€",
  cop: "$",
};

export function convertAmount(
  amountUsd: number,
  currency: Currency,
  rates: ExchangeRates
): number {
  switch (currency) {
    case "usd": return amountUsd;
    case "ves_bcv": return amountUsd * rates.ves_bcv;
    case "ves_parallel": return amountUsd * rates.ves_parallel;
    case "eur": return amountUsd * rates.eur;
    case "cop": return amountUsd * rates.cop;
  }
}

export function formatCurrency(amount: number, currency: Currency): string {
  const symbol = CURRENCY_SYMBOLS[currency];
  if (currency === "ves_bcv" || currency === "ves_parallel" || currency === "cop") {
    return `${symbol} ${amount.toLocaleString("es-VE", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }
  return `${symbol}${amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function getCurrencyLabel(currency: Currency): string {
  return CURRENCY_LABELS[currency];
}
