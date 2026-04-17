import Header from "@/components/Header";
import { getSuppliersWithIds } from "@/lib/actions";
import SupplierList from "./SupplierList";
import ThemeToggle from "./ThemeToggle";

export default async function SettingsPage() {
  const suppliers = await getSuppliersWithIds();

  return (
    <div className="flex flex-col min-h-full">
      <Header title="Einstellungen" back="/" />

      <main className="flex-1 px-4 py-6">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Dark Mode */}
          <section>
            <h2 className="text-lg font-bold text-gray-800 mb-1">Darstellung</h2>
            <p className="text-sm text-gray-500 mb-4">Zwischen hellem und dunklem Modus wechseln.</p>
            <ThemeToggle />
          </section>

          {/* Suppliers */}
          <section>
            <h2 className="text-lg font-bold text-gray-800 mb-1">Lieferanten verwalten</h2>
            <p className="text-sm text-gray-500 mb-5">
              Lieferanten hinzufügen oder entfernen. E-Mail-Adressen werden für Reklamationen verwendet.
            </p>
            <SupplierList suppliers={suppliers} />
          </section>
        </div>
      </main>
    </div>
  );
}
