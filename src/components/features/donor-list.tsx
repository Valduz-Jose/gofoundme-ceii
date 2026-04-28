import type { Donation } from "@/types";

function getInitial(name: string): string {
  return name.charAt(0).toUpperCase();
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("es-VE", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

interface Props {
  donations: Donation[];
}

export default function DonorList({ donations }: Props) {
  if (!donations.length) {
    return (
      <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
        <p className="text-4xl mb-3">💚</p>
        <p className="text-gray-500 font-medium">Sé el primero en donar</p>
        <p className="text-gray-400 text-sm mt-1">
          Contacta al administrador para registrar tu donación.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {donations.map((donation) => (
        <div
          key={donation.id}
          className="bg-white rounded-xl border border-gray-200 p-4 flex items-start gap-4"
        >
          <div className="w-10 h-10 rounded-full bg-ceii-secondary flex items-center justify-center text-white font-bold text-sm shrink-0">
            {donation.is_anonymous ? "?" : getInitial(donation.donor_name)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <span className="font-semibold text-ceii-primary">
                {donation.is_anonymous ? "Anónimo" : donation.donor_name}
              </span>
              <span className="text-ceii-accent font-bold shrink-0">
                ${Number(donation.amount_usd).toFixed(2)}
              </span>
            </div>
            {donation.message && (
              <p className="text-gray-500 text-sm mt-1 line-clamp-2">
                {donation.message}
              </p>
            )}
            <p className="text-gray-400 text-xs mt-1">{formatDate(donation.created_at)}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
