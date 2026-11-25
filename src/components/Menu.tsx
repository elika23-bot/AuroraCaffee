import { getMenu } from "@/lib/menu";
import { groupByCategory } from "@/lib/menuTypes";
import MenuTabs from "./MenuTabs";

export default async function Menu() {
  const items = await getMenu();
  const categories = groupByCategory(items).filter((c) => c.items.length > 0);

  return (
    <section id="menu" className="relative bg-ink-950 text-cream halftone-dark py-24 md:py-32">
      <div className="mx-auto max-w-4xl px-6">
        <div className="text-center">
          <p className="page-mark text-maroon-light mb-5">The Menu — Fig. 02</p>
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl text-balance">
            <span className="grain-text [--grain-color:var(--cream)]">Made to order,</span>
            <br />
            <span className="grain-text [--grain-color:var(--rust)] italic font-normal">
              every cup.
            </span>
          </h2>
        </div>

        <MenuTabs categories={categories} />
      </div>
    </section>
  );
}
