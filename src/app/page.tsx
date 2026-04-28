import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { getExchangeRates } from "@/lib/exchange/rates";
import ProgressBar from "@/components/features/progress-bar";
import CurrencyDisplay from "@/components/features/currency-display";
import EquipmentList from "@/components/features/equipment-list";
import DonorList from "@/components/features/donor-list";
import type { Donation, Equipment } from "@/types";

export const revalidate = 60;

async function getPageData() {
  const supabase = createClient();

  const [configResult, equipmentResult, donationsResult, rates] = await Promise.all([
    supabase.from("site_config").select("key, value"),
    supabase.from("equipment").select("*").order("sort_order"),
    supabase.from("donations").select("*").order("created_at", { ascending: false }),
    getExchangeRates(),
  ]);

  const config = Object.fromEntries(
    (configResult.data ?? []).map((c) => [c.key, c.value])
  );

  const donations = (donationsResult.data ?? []) as Donation[];
  const totalRaisedUsd = donations.reduce((sum, d) => sum + Number(d.amount_usd), 0);

  return {
    goalAmountUsd: Number(config["goal_amount_usd"] ?? 1329),
    projectName: config["project_name"] ?? "Internet Starlink para nuestra sede",
    projectDescription:
      config["project_description"] ??
      "Ayúdanos a conectar nuestra sede con Starlink. Tu aporte lleva internet confiable a los estudiantes del CEII.",
    equipment: (equipmentResult.data ?? []) as Equipment[],
    donations,
    totalRaisedUsd,
    rates,
  };
}

export default async function Home() {
  const {
    goalAmountUsd,
    projectName,
    projectDescription,
    equipment,
    donations,
    totalRaisedUsd,
    rates,
  } = await getPageData();

  const progressPercent = goalAmountUsd > 0 ? (totalRaisedUsd / goalAmountUsd) * 100 : 0;
  const donorCount = donations.length;

  return (
    <div className="min-h-screen bg-ceii-bg">
      {/* Header */}
      {/* Hero — arranca desde el top, sin header separado */}
      <section
        className="px-6"
        style={{
          background: "linear-gradient(135deg, #0F2C42 0%, #1B4968 100%)",
          paddingTop: "32px",
          paddingBottom: "32px",
        }}
      >
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row md:items-center md:gap-10 gap-6">
          {/* Columna izquierda — contenido textual e interactivo */}
          <div className="flex-1 min-w-0">
            <p className="text-ceii-accent text-xs font-bold tracking-widest uppercase mb-1.5">
              ⚡ CAMPAÑA DE RECAUDACIÓN
            </p>

            <h1 className="text-2xl md:text-3xl font-bold text-white mb-1.5">
              {projectName}
            </h1>
            <p className="text-blue-200 text-sm mb-4 leading-snug">
              {projectDescription}
            </p>

            <CurrencyDisplay
              totalRaisedUsd={totalRaisedUsd}
              goalAmountUsd={goalAmountUsd}
              rates={rates}
            />

            <div className="mt-3">
              <ProgressBar percent={progressPercent} />
              <div className="flex justify-between text-xs text-blue-300 mt-1.5">
                <span>
                  {donorCount} {donorCount === 1 ? "donante" : "donantes"}
                </span>
                <span>{Math.min(progressPercent, 100).toFixed(1)}% de la meta</span>
              </div>
            </div>
          </div>

          {/* Columna derecha — logo CEII */}
          <div className="flex md:flex-none md:w-[38%] justify-center md:justify-center items-center order-first md:order-last">
            <Image
              src="/logo-gceii-negativo-transparente.png"
              alt="Logo CEII"
              width={220}
              height={76}
              priority
              className="w-[140px] md:w-[200px] h-auto"
            />
          </div>
        </div>
      </section>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-10 space-y-12">
        <section>
          <h2 className="text-2xl font-bold text-ceii-primary mb-6">
            Equipos a adquirir
          </h2>
          <EquipmentList equipment={equipment} />
        </section>

        <section>
          <h2 className="text-2xl font-bold text-ceii-primary mb-6">
            Donantes ({donorCount})
          </h2>
          <DonorList donations={donations} />
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-ceii-primary text-blue-300 text-center py-6 mt-10 text-sm">
        <p>
          © {new Date().getFullYear()} Centro de Informática CEII ·{" "}
          <span className="text-ceii-accent">Tasas: ve.dolarapi.com</span>
        </p>
      </footer>
    </div>
  );
}
