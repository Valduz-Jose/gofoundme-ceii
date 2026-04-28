"use client";

import { useCallback, useEffect, useState } from "react";
import type { PaymentCategory, PaymentMethod } from "@/types";

const CATEGORY_META: Record<PaymentCategory, { label: string; icon: string }> = {
  venezuela:     { label: "Venezuela",    icon: "🇻🇪" },
  international: { label: "Internacional", icon: "🌎" },
  colombia:      { label: "Colombia",     icon: "🇨🇴" },
  crypto:        { label: "Cripto",       icon: "₿" },
  contact:       { label: "Contacto",     icon: "📱" },
};

const CATEGORY_ORDER: PaymentCategory[] = [
  "venezuela",
  "international",
  "colombia",
  "crypto",
  "contact",
];

interface Props {
  methods: PaymentMethod[];
  isOpen: boolean;
  onClose: () => void;
}

export default function DonateModal({ methods, isOpen, onClose }: Props) {
  const availableCategories = CATEGORY_ORDER.filter((cat) =>
    methods.some((m) => m.category === cat)
  );

  const [activeTab, setActiveTab] = useState<PaymentCategory>(
    availableCategories[0] ?? "venezuela"
  );
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const first = CATEGORY_ORDER.find((c) => methods.some((m) => m.category === c));
    if (first) setActiveTab(first);
  }, [isOpen, methods]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); },
    [onClose]
  );

  useEffect(() => {
    if (!isOpen) return;
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleKeyDown]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  async function handleCopy(value: string, copyId: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedKey(copyId);
      setTimeout(() => setCopiedKey(null), 2000);
    } catch {
      // clipboard unavailable
    }
  }

  const tabMethods = methods.filter((m) => m.category === activeTab);

  return (
    <div
      role="dialog"
      aria-modal="true"
      className={`fixed inset-0 z-50 flex items-center justify-center p-0 md:p-6 transition-opacity duration-200 ${
        isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
      style={{ backgroundColor: "rgba(15, 44, 66, 0.85)" }}
      onClick={onClose}
    >
      <div
        className={`relative w-full h-full md:h-auto md:max-w-lg bg-white md:rounded-2xl overflow-hidden flex flex-col transition-all duration-200 ${
          isOpen ? "opacity-100 md:scale-100" : "opacity-0 md:scale-95"
        }`}
        style={{ maxHeight: "calc(100dvh - 48px)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="shrink-0 flex items-center justify-between px-5 py-4"
          style={{ background: "linear-gradient(135deg, #0F2C42 0%, #1B4968 100%)" }}
        >
          <div>
            <p className="text-xs font-bold tracking-widest text-ceii-accent uppercase mb-0.5">
              Métodos de donación
            </p>
            <h2 className="text-white font-bold text-lg leading-tight">
              ¿Cómo quieres donar?
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Cerrar"
            className="text-blue-300 hover:text-white transition-colors text-2xl leading-none p-1 ml-4"
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="shrink-0 flex overflow-x-auto border-b border-gray-100 bg-gray-50">
          {availableCategories.map((cat) => {
            const meta = CATEGORY_META[cat];
            const isActive = activeTab === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={`flex-none flex items-center gap-1.5 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  isActive
                    ? "border-ceii-accent text-ceii-primary"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                <span>{meta.icon}</span>
                <span>{meta.label}</span>
              </button>
            );
          })}
        </div>

        {/* Methods */}
        <div className="overflow-y-auto flex-1 p-5 space-y-4">
          {tabMethods.length === 0 ? (
            <p className="text-center text-gray-400 py-8 text-sm">
              No hay métodos disponibles en esta categoría.
            </p>
          ) : (
            tabMethods.map((method) => (
              <div
                key={method.id}
                className="border border-gray-200 rounded-xl overflow-hidden"
              >
                {/* Card header */}
                <div className="px-4 py-3 bg-gray-50 flex items-center gap-2 border-b border-gray-200">
                  {method.icon && <span className="text-xl">{method.icon}</span>}
                  <span className="font-semibold text-ceii-primary">{method.name}</span>
                </div>

                {/* Fields */}
                <div className="px-4 py-3 space-y-3">
                  {Object.entries(method.fields).map(([key, value]) => {
                    const copyId = `${method.id}-${key}`;
                    const copied = copiedKey === copyId;
                    return (
                      <div key={key} className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-xs text-gray-400 font-medium mb-0.5">{key}</p>
                          <p className="text-sm text-ceii-primary font-mono break-all leading-snug">
                            {value}
                          </p>
                        </div>
                        <button
                          onClick={() => handleCopy(value, copyId)}
                          className={`shrink-0 text-xs px-2.5 py-1.5 rounded-lg font-medium transition-all ${
                            copied
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-500 hover:bg-ceii-accent hover:text-white"
                          }`}
                        >
                          {copied ? "✓ Copiado" : "Copiar"}
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* Notes */}
                {method.notes && (
                  <div className="px-4 py-2.5 bg-amber-50 border-t border-amber-100">
                    <p className="text-xs text-amber-700 leading-snug">{method.notes}</p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
