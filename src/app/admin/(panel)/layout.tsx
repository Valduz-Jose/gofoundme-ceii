import AdminSidebar from "@/components/features/admin/sidebar";

export default function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 bg-ceii-bg p-8 overflow-auto">{children}</main>
    </div>
  );
}
