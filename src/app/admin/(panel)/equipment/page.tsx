import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Equipment } from "@/types";

export default async function EquipmentPage() {
  const supabase = createClient();
  const { data } = await supabase
    .from("equipment")
    .select("*")
    .order("sort_order");

  const equipment = (data ?? []) as Equipment[];
  const totalUsd = equipment.reduce((sum, e) => sum + Number(e.price_usd), 0);
  const boughtUsd = equipment
    .filter((e) => e.status === "comprado")
    .reduce((sum, e) => sum + Number(e.price_usd), 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-ceii-primary">Equipos</h1>
        <p className="text-sm text-gray-500">
          <span className="text-ceii-accent font-bold">${boughtUsd.toFixed(2)}</span>
          {" comprado de "}
          <span className="font-bold text-ceii-primary">${totalUsd.toFixed(2)}</span>
          {" total"}
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left px-6 py-3 text-gray-500 font-medium">Equipo</th>
              <th className="text-left px-6 py-3 text-gray-500 font-medium">
                Precio USD
              </th>
              <th className="text-left px-6 py-3 text-gray-500 font-medium">Estado</th>
              <th className="px-6 py-3" />
            </tr>
          </thead>
          <tbody>
            {equipment.map((item) => (
              <tr
                key={item.id}
                className="border-b border-gray-100 hover:bg-gray-50"
              >
                <td className="px-6 py-4">
                  <p className="font-medium text-ceii-primary">{item.name}</p>
                  {item.description && (
                    <p className="text-gray-400 text-xs mt-0.5 max-w-sm truncate">
                      {item.description}
                    </p>
                  )}
                </td>
                <td className="px-6 py-4 font-bold text-ceii-accent">
                  ${Number(item.price_usd).toFixed(2)}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                      item.status === "comprado"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {item.status === "comprado" ? "✓ Comprado" : "Pendiente"}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <Link
                    href={`/admin/equipment/${item.id}/edit`}
                    className="text-ceii-secondary hover:underline"
                  >
                    Editar
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
