import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = createClient();

  const [configResult, donationsResult] = await Promise.all([
    supabase.from("site_config").select("key, value"),
    supabase
      .from("donations")
      .select("id, amount_usd, donor_name, is_anonymous, created_at")
      .order("created_at", { ascending: false }),
  ]);

  const config = Object.fromEntries(
    (configResult.data ?? []).map((c) => [c.key, c.value])
  );

  const donations = donationsResult.data ?? [];
  const goalAmountUsd = Number(config["goal_amount_usd"] ?? 1329);
  const totalRaisedUsd = donations.reduce((sum, d) => sum + Number(d.amount_usd), 0);
  const progressPercent = goalAmountUsd > 0 ? (totalRaisedUsd / goalAmountUsd) * 100 : 0;
  const recentDonations = donations.slice(0, 5);

  return (
    <div>
      <h1 className="text-2xl font-bold text-ceii-primary mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          label="Total recaudado"
          value={`$${totalRaisedUsd.toFixed(2)}`}
          sub="USD"
          accent="green"
        />
        <StatCard
          label="Progreso"
          value={`${Math.min(progressPercent, 100).toFixed(1)}%`}
          sub={`de $${goalAmountUsd.toFixed(2)} USD`}
          accent="blue"
        />
        <StatCard
          label="Donantes"
          value={String(donations.length)}
          sub={donations.length === 1 ? "donación registrada" : "donaciones registradas"}
          accent="emerald"
        />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex justify-between text-sm text-gray-500 mb-2">
          <span>Progreso hacia la meta</span>
          <span>{Math.min(progressPercent, 100).toFixed(1)}%</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-3">
          <div
            className="h-3 bg-ceii-accent rounded-full transition-all"
            style={{ width: `${Math.min(progressPercent, 100)}%` }}
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-semibold text-ceii-primary mb-4">Últimas donaciones</h2>
        {recentDonations.length === 0 ? (
          <p className="text-gray-400 text-sm">No hay donaciones registradas.</p>
        ) : (
          <div className="space-y-0">
            {recentDonations.map((d) => (
              <div
                key={d.id}
                className="flex justify-between items-center py-3 border-b border-gray-100 last:border-0 text-sm"
              >
                <span className="text-gray-600">
                  {d.is_anonymous ? "Anónimo" : d.donor_name}
                </span>
                <div className="flex items-center gap-4">
                  <span className="text-gray-400">
                    {new Date(d.created_at).toLocaleDateString("es-VE")}
                  </span>
                  <span className="font-bold text-ceii-accent">
                    ${Number(d.amount_usd).toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: string;
  sub: string;
  accent: "green" | "blue" | "emerald";
}) {
  const colors = {
    green: "bg-green-50 border-green-200",
    blue: "bg-blue-50 border-blue-200",
    emerald: "bg-emerald-50 border-emerald-200",
  };

  return (
    <div className={`rounded-xl border p-6 ${colors[accent]}`}>
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className="text-3xl font-bold text-ceii-primary">{value}</p>
      <p className="text-xs text-gray-400 mt-1">{sub}</p>
    </div>
  );
}
