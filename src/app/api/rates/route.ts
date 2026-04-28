import { NextResponse } from "next/server";
import { getExchangeRates } from "@/lib/exchange/rates";

export const revalidate = 3600;

export async function GET() {
  try {
    const rates = await getExchangeRates();
    return NextResponse.json(rates);
  } catch {
    return NextResponse.json(
      { error: "Error al obtener tasas cambiarias" },
      { status: 500 }
    );
  }
}
