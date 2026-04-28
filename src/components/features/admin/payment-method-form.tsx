"use client";

import Link from "next/link";
import { useState } from "react";
import { Field, inputClass } from "@/components/features/admin/form-fields";
import type { PaymentCategory, PaymentMethod } from "@/types";

const CATEGORIES: { value: PaymentCategory; label: string }[] = [
  { value: "venezuela",     label: "🇻🇪 Venezuela" },
  { value: "international", label: "🌎 Internacional" },
  { value: "colombia",      label: "🇨🇴 Colombia" },
  { value: "crypto",        label: "₿ Cripto" },
  { value: "contact",       label: "📱 Contacto" },
];

interface FieldPair {
  key: string;
  value: string;
}

interface Props {
  action: (formData: FormData) => Promise<void>;
  defaultValues?: Partial<PaymentMethod>;
  backHref: string;
  submitLabel: string;
}

export default function PaymentMethodForm({
  action,
  defaultValues,
  backHref,
  submitLabel,
}: Props) {
  const initialFields: FieldPair[] = defaultValues?.fields
    ? Object.entries(defaultValues.fields).map(([key, value]) => ({ key, value }))
    : [{ key: "", value: "" }];

  const [fields, setFields] = useState<FieldPair[]>(initialFields);

  function addField() {
    setFields((prev) => [...prev, { key: "", value: "" }]);
  }

  function removeField(index: number) {
    setFields((prev) => prev.filter((_, i) => i !== index));
  }

  function updateField(index: number, prop: "key" | "value", val: string) {
    setFields((prev) =>
      prev.map((f, i) => (i === index ? { ...f, [prop]: val } : f))
    );
  }

  function buildFieldsJson(): string {
    const obj: Record<string, string> = {};
    fields.forEach(({ key, value }) => {
      if (key.trim()) obj[key.trim()] = value;
    });
    return JSON.stringify(obj);
  }

  return (
    <form action={action} className="space-y-5">
      {/* Hidden field — serialized fields object */}
      <input type="hidden" name="fields_json" value={buildFieldsJson()} />

      <Field label="Categoría">
        <select
          name="category"
          defaultValue={defaultValues?.category ?? "venezuela"}
          className={inputClass}
        >
          {CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Nombre">
        <input
          name="name"
          type="text"
          required
          defaultValue={defaultValues?.name ?? ""}
          placeholder="Ej: Pago Móvil"
          className={inputClass}
        />
      </Field>

      <Field label="Icono (emoji)">
        <input
          name="icon"
          type="text"
          defaultValue={defaultValues?.icon ?? ""}
          placeholder="Ej: 📱"
          className={inputClass}
        />
      </Field>

      {/* Dynamic fields editor */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="block text-sm font-medium text-gray-600">Campos</label>
          <button
            type="button"
            onClick={addField}
            className="text-xs text-ceii-accent hover:underline font-medium"
          >
            + Agregar campo
          </button>
        </div>
        <div className="space-y-2">
          {fields.map((f, i) => (
            <div key={i} className="flex gap-2 items-center">
              <input
                type="text"
                placeholder="Clave (ej: Banco)"
                value={f.key}
                onChange={(e) => updateField(i, "key", e.target.value)}
                className={`${inputClass} flex-1`}
              />
              <input
                type="text"
                placeholder="Valor"
                value={f.value}
                onChange={(e) => updateField(i, "value", e.target.value)}
                className={`${inputClass} flex-1`}
              />
              {fields.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeField(i)}
                  className="text-red-400 hover:text-red-600 transition-colors text-sm px-1 shrink-0"
                  aria-label="Eliminar campo"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <Field label="Notas (opcional)">
        <textarea
          name="notes"
          rows={2}
          defaultValue={defaultValues?.notes ?? ""}
          placeholder="Información adicional visible al donante..."
          className={inputClass}
        />
      </Field>

      <Field label="Orden de aparición">
        <input
          name="sort_order"
          type="number"
          min="0"
          defaultValue={defaultValues?.sort_order ?? 0}
          className={inputClass}
        />
      </Field>

      <label className="flex items-center gap-3 cursor-pointer select-none">
        <input
          name="is_active"
          type="checkbox"
          defaultChecked={defaultValues?.is_active ?? true}
          className="w-4 h-4 rounded accent-ceii-accent"
        />
        <span className="text-sm text-gray-600">
          Método activo (visible en la página pública)
        </span>
      </label>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          className="px-6 py-2.5 bg-ceii-accent text-white rounded-lg text-sm font-medium hover:opacity-90 transition"
        >
          {submitLabel}
        </button>
        <Link
          href={backHref}
          className="px-6 py-2.5 border border-gray-300 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
        >
          Cancelar
        </Link>
      </div>
    </form>
  );
}
