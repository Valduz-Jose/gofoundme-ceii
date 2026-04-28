"use client";

import { useTransition } from "react";
import { deletePaymentMethod } from "@/app/admin/actions";

export default function DeletePaymentMethodButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (!confirm("¿Eliminar este método de pago? Esta acción no se puede deshacer."))
      return;
    startTransition(async () => {
      await deletePaymentMethod(id);
    });
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="text-red-400 hover:text-red-600 disabled:opacity-50 transition-colors"
    >
      {isPending ? "..." : "Eliminar"}
    </button>
  );
}
