import { createClient } from "@/lib/supabase/server";
import { updateSettings } from "@/app/admin/actions";
import { Field, inputClass } from "@/components/features/admin/form-fields";

export default async function SettingsPage() {
  const supabase = createClient();
  const { data } = await supabase.from("site_config").select("key, value");

  const config = Object.fromEntries((data ?? []).map((c) => [c.key, c.value]));

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-bold text-ceii-primary mb-8">Configuración</h1>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <form action={updateSettings} className="space-y-5">
          <Field label="Meta de recaudación (USD)">
            <input
              name="goal_amount_usd"
              type="number"
              step="0.01"
              min="1"
              required
              defaultValue={config["goal_amount_usd"] ?? "1329"}
              className={inputClass}
            />
          </Field>

          <Field label="Título del proyecto">
            <input
              name="project_name"
              type="text"
              required
              defaultValue={config["project_name"] ?? ""}
              className={inputClass}
            />
          </Field>

          <Field label="Descripción pública">
            <textarea
              name="project_description"
              rows={4}
              defaultValue={config["project_description"] ?? ""}
              className={inputClass}
            />
          </Field>

          <button
            type="submit"
            className="px-6 py-2.5 bg-ceii-accent text-white rounded-lg text-sm font-medium hover:opacity-90 transition"
          >
            Guardar configuración
          </button>
        </form>
      </div>
    </div>
  );
}
