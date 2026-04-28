import type { Equipment } from "@/types";

const ICONS: Record<string, string> = {
  starlink: "📡",
  plan: "🌐",
  router: "📶",
  mikrotik: "🔧",
  ups: "🔋",
  protector: "⚡",
  cableado: "🔌",
};

function getIcon(name: string): string {
  const lower = name.toLowerCase();
  for (const [key, icon] of Object.entries(ICONS)) {
    if (lower.includes(key)) return icon;
  }
  return "📦";
}

interface Props {
  equipment: Equipment[];
}

export default function EquipmentList({ equipment }: Props) {
  if (!equipment.length) {
    return <p className="text-gray-500">No hay equipos registrados.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {equipment.map((item) => (
        <div
          key={item.id}
          className={`rounded-xl border p-5 flex items-start gap-4 ${
            item.status === "comprado"
              ? "bg-green-50 border-green-200"
              : "bg-white border-gray-200"
          }`}
        >
          <span className="text-3xl leading-none mt-0.5">{getIcon(item.name)}</span>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold text-ceii-primary text-sm leading-tight">
                {item.name}
              </h3>
              <span
                className={`shrink-0 text-xs px-2 py-0.5 rounded-full font-medium ${
                  item.status === "comprado"
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {item.status === "comprado" ? "✓ Comprado" : "Pendiente"}
              </span>
            </div>
            {item.description && (
              <p className="text-gray-400 text-xs mt-1 leading-relaxed">
                {item.description}
              </p>
            )}
            <p className="text-ceii-accent font-bold text-lg mt-2">
              ${Number(item.price_usd).toFixed(2)} USD
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
