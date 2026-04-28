export const inputClass =
  "w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:border-ceii-secondary text-sm text-gray-800";

export function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-600 mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );
}
