import { Locale } from "@/i18n.config";
import getTrans from "@/lib/translation";
import AdminTabs from "./_components/AdminTabs";

async function AdminLayout({
  params,
  children,
}: {
  params: Promise<{ locale: Locale }>;
  children: React.ReactNode;
}) {
  const locale = (await params).locale;
  const translations = await getTrans(locale);
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminTabs translations={translations} />
      <main className="relative">
        {children}
      </main>
    </div>
  );
}

export default AdminLayout;
