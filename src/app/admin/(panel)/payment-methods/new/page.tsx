import Link from "next/link";
import { createPaymentMethod } from "@/app/admin/actions";
import PaymentMethodForm from "@/components/features/admin/payment-method-form";

export default function NewPaymentMethodPage() {
  return (
    <div className="max-w-lg">
      <div className="flex items-center gap-2 text-sm text-gray-400 mb-8">
        <Link href="/admin/payment-methods" className="hover:text-gray-600">
          Métodos de pago
        </Link>
        <span>/</span>
        <span className="text-ceii-primary font-medium">Nuevo método</span>
      </div>

      <h1 className="text-2xl font-bold text-ceii-primary mb-6">Nuevo método de pago</h1>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <PaymentMethodForm
          action={createPaymentMethod}
          backHref="/admin/payment-methods"
          submitLabel="Crear método"
        />
      </div>
    </div>
  );
}
