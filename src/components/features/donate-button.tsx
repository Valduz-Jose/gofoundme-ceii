"use client";

import { useCallback, useState } from "react";
import type { PaymentMethod } from "@/types";
import DonateModal from "./donate-modal";

export default function DonateButton({ methods }: { methods: PaymentMethod[] }) {
  const [open, setOpen] = useState(false);
  const handleClose = useCallback(() => setOpen(false), []);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="mt-4 w-full py-3.5 rounded-xl font-bold text-white text-base tracking-wide transition-all hover:brightness-110 active:scale-[0.98]"
        style={{ backgroundColor: "#16B981" }}
      >
        💚 DONAR AHORA
      </button>
      <DonateModal methods={methods} isOpen={open} onClose={handleClose} />
    </>
  );
}
