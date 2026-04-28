import Link from "next/link";
import { createDonation } from "@/app/admin/actions";
import { Field, inputClass } from "@/components/features/admin/form-fields";

export default function NewDonationPage() {
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="max-w-lg">
      <div className="flex items-center gap-2 text-sm text-gray-400 mb-8">
        <Link href="/admin/donations" className="hover:text-gray-600">
          Donaciones
        </Link>
        <span>/</span>
        <span className="text-ceii-primary font-medium">Nueva donación</span>
      </div>

      <h1 className="text-2xl font-bold text-ceii-primary mb-6">Nueva donación</h1>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <form action={createDonation} className="space-y-5">
          <Field label="Nombre del donante">
            <input
              name="donor_name"
              type="text"
              required
              placeholder="Ej: María González"
              className={inputClass}
            />
          </Field>

          <Field label="Monto (USD)">
            <input
              name="amount_usd"
              type="number"
              step="0.01"
              min="0.01"
              required
              placeholder="0.00"
              className={inputClass}
            />
          </Field>

          <Field label="Mensaje (opcional)">
            <textarea
              name="message"
              rows={3}
              placeholder="Mensaje del donante..."
              className={inputClass}
            />
          </Field>

          <Field label="Fecha de la donación">
            <input
              name="donation_date"
              type="date"
              defaultValue={today}
              className={inputClass}
            />
          </Field>

          <label className="flex items-center gap-3 cursor-pointer select-none">
            <input
              name="is_anonymous"
              type="checkbox"
              className="w-4 h-4 rounded accent-ceii-accent"
            />
            <span className="text-sm text-gray-600">Donación anónima</span>
          </label>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 bg-ceii-accent text-white rounded-lg text-sm font-medium hover:opacity-90 transition"
            >
              Guardar donación
            </button>
            <Link
              href="/admin/donations"
              className="px-6 py-2.5 border border-gray-300 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
            >
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
