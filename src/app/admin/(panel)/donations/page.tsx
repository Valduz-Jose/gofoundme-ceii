import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Donation } from "@/types";
import DeleteDonationButton from "./delete-button";

export default async function DonationsPage() {
  const supabase = createClient();
  const { data } = await supabase
    .from("donations")
    .select("*")
    .order("created_at", { ascending: false });

  const donations = (data ?? []) as Donation[];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-ceii-primary">Donaciones</h1>
        <Link
          href="/admin/donations/new"
          className="px-4 py-2 bg-ceii-accent text-white rounded-lg text-sm font-medium hover:opacity-90 transition"
        >
          + Nueva donación
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {donations.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-400 mb-3">No hay donaciones registradas.</p>
            <Link
              href="/admin/donations/new"
              className="text-ceii-accent text-sm hover:underline"
            >
              Registrar la primera donación →
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-6 py-3 text-gray-500 font-medium">
                    Donante
                  </th>
                  <th className="text-left px-6 py-3 text-gray-500 font-medium">
                    Monto
                  </th>
                  <th className="text-left px-6 py-3 text-gray-500 font-medium">
                    Mensaje
                  </th>
                  <th className="text-left px-6 py-3 text-gray-500 font-medium">
                    Fecha
                  </th>
                  <th className="px-6 py-3" />
                </tr>
              </thead>
              <tbody>
                {donations.map((d) => (
                  <tr
                    key={d.id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="px-6 py-4">
                      <span className="font-medium text-ceii-primary">
                        {d.is_anonymous ? "Anónimo" : d.donor_name}
                      </span>
                      {d.is_anonymous && (
                        <span className="ml-2 text-xs bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded">
                          anónimo
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 font-bold text-ceii-accent">
                      ${Number(d.amount_usd).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-gray-400 max-w-xs">
                      <span className="block truncate">{d.message ?? "—"}</span>
                    </td>
                    <td className="px-6 py-4 text-gray-400 whitespace-nowrap">
                      {new Date(d.created_at).toLocaleDateString("es-VE")}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3 justify-end whitespace-nowrap">
                        <Link
                          href={`/admin/donations/${d.id}/edit`}
                          className="text-ceii-secondary hover:underline"
                        >
                          Editar
                        </Link>
                        <DeleteDonationButton id={d.id} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
