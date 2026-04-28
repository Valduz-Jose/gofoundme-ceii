import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { PaymentCategory, PaymentMethod } from "@/types";
import ToggleActiveButton from "./toggle-active-button";
import DeletePaymentMethodButton from "./delete-button";

const CATEGORY_LABELS: Record<PaymentCategory, string> = {
  venezuela:     "🇻🇪 Venezuela",
  international: "🌎 Internacional",
  colombia:      "🇨🇴 Colombia",
  crypto:        "₿ Cripto",
  contact:       "📱 Contacto",
};

const ALL_CATEGORIES: PaymentCategory[] = [
  "venezuela",
  "international",
  "colombia",
  "crypto",
  "contact",
];

export default async function PaymentMethodsPage({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  const supabase = createClient();
  const activeCategory = searchParams.category as PaymentCategory | undefined;

  let query = supabase
    .from("payment_methods")
    .select("*")
    .order("category")
    .order("sort_order");

  if (activeCategory && ALL_CATEGORIES.includes(activeCategory)) {
    query = query.eq("category", activeCategory);
  }

  const { data } = await query;
  const methods = (data ?? []) as PaymentMethod[];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-ceii-primary">Métodos de pago</h1>
        <Link
          href="/admin/payment-methods/new"
          className="px-4 py-2 bg-ceii-accent text-white rounded-lg text-sm font-medium hover:opacity-90 transition"
        >
          + Nuevo método
        </Link>
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        <Link
          href="/admin/payment-methods"
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            !activeCategory
              ? "bg-ceii-primary text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Todos
        </Link>
        {ALL_CATEGORIES.map((cat) => (
          <Link
            key={cat}
            href={`/admin/payment-methods?category=${cat}`}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeCategory === cat
                ? "bg-ceii-primary text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {CATEGORY_LABELS[cat]}
          </Link>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {methods.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-400 mb-3">No hay métodos de pago registrados.</p>
            <Link
              href="/admin/payment-methods/new"
              className="text-ceii-accent text-sm hover:underline"
            >
              Crear el primero →
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-6 py-3 text-gray-500 font-medium">Método</th>
                  <th className="text-left px-6 py-3 text-gray-500 font-medium">Categoría</th>
                  <th className="text-left px-6 py-3 text-gray-500 font-medium">Estado</th>
                  <th className="text-left px-6 py-3 text-gray-500 font-medium">Orden</th>
                  <th className="px-6 py-3" />
                </tr>
              </thead>
              <tbody>
                {methods.map((method) => (
                  <tr
                    key={method.id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {method.icon && (
                          <span className="text-lg">{method.icon}</span>
                        )}
                        <span className="font-medium text-ceii-primary">
                          {method.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {CATEGORY_LABELS[method.category]}
                    </td>
                    <td className="px-6 py-4">
                      <ToggleActiveButton
                        id={method.id}
                        isActive={method.is_active}
                      />
                    </td>
                    <td className="px-6 py-4 text-gray-400">{method.sort_order}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3 justify-end whitespace-nowrap">
                        <Link
                          href={`/admin/payment-methods/${method.id}/edit`}
                          className="text-ceii-secondary hover:underline"
                        >
                          Editar
                        </Link>
                        <DeletePaymentMethodButton id={method.id} />
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
