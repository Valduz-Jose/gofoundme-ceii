"use client";

import { useTransition } from "react";
import { deleteDonation } from "@/app/admin/actions";

export default function DeleteDonationButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (!confirm("¿Eliminar esta donación? Esta acción no se puede deshacer."))
      return;
    startTransition(async () => {
      await deleteDonation(id);
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
