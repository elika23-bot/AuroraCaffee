import { getMenu } from "@/lib/menu";
import { groupByCategory } from "@/lib/menuTypes";
import MenuItemForm from "./MenuItemForm";
import MenuItemRow from "./MenuItemRow";

// Reads/writes live menu data — must never be served from a build-time
// static cache, or price changes wouldn't show up without a redeploy.
export const dynamic = "force-dynamic";

export default async function AdminMenuPage() {
  const items = await getMenu();
  const categories = groupByCategory(items);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl text-ink">Menu</h1>
        <p className="mt-1 text-[14px] text-ink/62">
          Add, edit, or remove items and prices — changes show up on the site immediately.
        </p>
      </div>

      <section className="rounded-2xl bg-paper border border-ink/10 p-6">
        <h2 className="font-display text-xl text-ink mb-5">Add a new item</h2>
        <MenuItemForm />
      </section>

      {categories.map((category) => (
        <section key={category.id}>
          <h2 className="font-display text-lg text-ink mb-3">{category.label}</h2>
          {category.items.length === 0 ? (
            <p className="text-[13.5px] text-ink/62">No items in this category yet.</p>
          ) : (
            <div className="space-y-2">
              {category.items.map((item) => (
                <MenuItemRow key={item.id} item={item} />
              ))}
            </div>
          )}
        </section>
      ))}
    </div>
  );
}
