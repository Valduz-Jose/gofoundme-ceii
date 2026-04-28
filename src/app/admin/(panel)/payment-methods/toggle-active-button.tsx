"use client";

import { useTransition } from "react";
import { togglePaymentMethodActive } from "@/app/admin/actions";

export default function ToggleActiveButton({
  id,
  isActive,
}: {
  id: string;
  isActive: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  function handleToggle() {
    startTransition(async () => {
      await togglePaymentMethodActive(id, !isActive);
    });
  }

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      className={`text-xs px-2.5 py-1 rounded-full font-medium transition-all disabled:opacity-50 ${
        isActive
          ? "bg-green-100 text-green-700 hover:bg-red-100 hover:text-red-600"
          : "bg-gray-100 text-gray-500 hover:bg-green-100 hover:text-green-700"
      }`}
    >
      {isPending ? "..." : isActive ? "✓ Activo" : "Inactivo"}
    </button>
  );
}
