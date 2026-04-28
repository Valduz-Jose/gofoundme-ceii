"use client";

import { useState } from "react";
import type { Currency, ExchangeRates } from "@/types";
import { convertAmount, formatCurrency, getCurrencyLabel } from "@/lib/utils";

const CURRENCIES: Currency[] = ["usd", "ves_bcv", "ves_parallel", "eur", "cop"];

interface Props {
  totalRaisedUsd: number;
  goalAmountUsd: number;
  rates: ExchangeRates;
}

export default function CurrencyDisplay({
  totalRaisedUsd,
  goalAmountUsd,
  rates,
}: Props) {
  const [currency, setCurrency] = useState<Currency>("usd");

  const raised = convertAmount(totalRaisedUsd, currency, rates);
  const goal = convertAmount(goalAmountUsd, currency, rates);

  const rateLabels: Record<Exclude<Currency, "usd">, string> = {
    ves_bcv: `1 USD = ${rates.ves_bcv.toFixed(2)} Bs. (BCV)`,
    ves_parallel: `1 USD = ${rates.ves_parallel.toFixed(2)} Bs. (Paralelo)`,
    eur: `1 USD = ${rates.eur.toFixed(4)} EUR`,
    cop: `1 USD = ${rates.cop.toFixed(0)} COP`,
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-3">
        {CURRENCIES.map((c) => (
          <button
            key={c}
            onClick={() => setCurrency(c)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              currency === c
                ? "bg-ceii-accent text-white"
                : "bg-white/10 text-white hover:bg-white/20"
            }`}
          >
            {getCurrencyLabel(c)}
          </button>
        ))}
      </div>

      <div className="flex items-end gap-3 flex-wrap">
        <span className="text-3xl md:text-4xl font-bold text-white">
          {formatCurrency(raised, currency)}
        </span>
        <span className="text-blue-200 text-base mb-0.5">
          de {formatCurrency(goal, currency)}
        </span>
      </div>

      {currency !== "usd" && (
        <p className="text-blue-300 text-xs mt-1">
          {rateLabels[currency as Exclude<Currency, "usd">]}
        </p>
      )}
    </div>
  );
}
