import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { updateDonation } from "@/app/admin/actions";
import { Field, inputClass } from "@/components/features/admin/form-fields";

export default async function EditDonationPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createClient();
  const { data: donation } = await supabase
    .from("donations")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!donation) notFound();

  const action = updateDonation.bind(null, params.id);
  const donationDate = new Date(donation.created_at).toISOString().split("T")[0];

  return (
    <div className="max-w-lg">
      <div className="flex items-center gap-2 text-sm text-gray-400 mb-8">
        <Link href="/admin/donations" className="hover:text-gray-600">
          Donaciones
        </Link>
        <span>/</span>
        <span className="text-ceii-primary font-medium">Editar donación</span>
      </div>

      <h1 className="text-2xl font-bold text-ceii-primary mb-6">Editar donación</h1>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <form action={action} className="space-y-5">
          <Field label="Nombre del donante">
            <input
              name="donor_name"
              type="text"
              required
              defaultValue={donation.donor_name}
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
              defaultValue={Number(donation.amount_usd)}
              className={inputClass}
            />
          </Field>

          <Field label="Mensaje (opcional)">
            <textarea
              name="message"
              rows={3}
              defaultValue={donation.message ?? ""}
              className={inputClass}
            />
          </Field>

          <Field label="Fecha de la donación">
            <input
              name="donation_date"
              type="date"
              defaultValue={donationDate}
              className={inputClass}
            />
          </Field>

          <label className="flex items-center gap-3 cursor-pointer select-none">
            <input
              name="is_anonymous"
              type="checkbox"
              defaultChecked={donation.is_anonymous}
              className="w-4 h-4 rounded accent-ceii-accent"
            />
            <span className="text-sm text-gray-600">Donación anónima</span>
          </label>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 bg-ceii-accent text-white rounded-lg text-sm font-medium hover:opacity-90 transition"
            >
              Guardar cambios
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
