import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { updateEquipment } from "@/app/admin/actions";
import { Field, inputClass } from "@/components/features/admin/form-fields";

export default async function EditEquipmentPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createClient();
  const { data: item } = await supabase
    .from("equipment")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!item) notFound();

  const action = updateEquipment.bind(null, params.id);

  return (
    <div className="max-w-lg">
      <div className="flex items-center gap-2 text-sm text-gray-400 mb-8">
        <Link href="/admin/equipment" className="hover:text-gray-600">
          Equipos
        </Link>
        <span>/</span>
        <span className="text-ceii-primary font-medium">Editar equipo</span>
      </div>

      <h1 className="text-2xl font-bold text-ceii-primary mb-6">Editar equipo</h1>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <form action={action} className="space-y-5">
          <Field label="Nombre del equipo">
            <input
              name="name"
              type="text"
              required
              defaultValue={item.name}
              className={inputClass}
            />
          </Field>

          <Field label="Descripción (opcional)">
            <textarea
              name="description"
              rows={3}
              defaultValue={item.description ?? ""}
              className={inputClass}
            />
          </Field>

          <Field label="Precio (USD)">
            <input
              name="price_usd"
              type="number"
              step="0.01"
              min="0"
              required
              defaultValue={Number(item.price_usd)}
              className={inputClass}
            />
          </Field>

          <Field label="Estado">
            <select name="status" defaultValue={item.status} className={inputClass}>
              <option value="pendiente">Pendiente</option>
              <option value="comprado">Comprado</option>
            </select>
          </Field>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 bg-ceii-accent text-white rounded-lg text-sm font-medium hover:opacity-90 transition"
            >
              Guardar cambios
            </button>
            <Link
              href="/admin/equipment"
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
