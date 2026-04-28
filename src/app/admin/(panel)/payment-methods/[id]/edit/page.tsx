import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { updatePaymentMethod } from "@/app/admin/actions";
import PaymentMethodForm from "@/components/features/admin/payment-method-form";
import type { PaymentMethod } from "@/types";

export default async function EditPaymentMethodPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createClient();
  const { data } = await supabase
    .from("payment_methods")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!data) notFound();

  const method = data as PaymentMethod;
  const action = updatePaymentMethod.bind(null, params.id);

  return (
    <div className="max-w-lg">
      <div className="flex items-center gap-2 text-sm text-gray-400 mb-8">
        <Link href="/admin/payment-methods" className="hover:text-gray-600">
          Métodos de pago
        </Link>
        <span>/</span>
        <span className="text-ceii-primary font-medium">Editar método</span>
      </div>

      <h1 className="text-2xl font-bold text-ceii-primary mb-6">Editar método de pago</h1>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <PaymentMethodForm
          action={action}
          defaultValues={method}
          backHref="/admin/payment-methods"
          submitLabel="Guardar cambios"
        />
      </div>
    </div>
  );
}
