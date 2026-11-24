export type MenuItem = {
  id: string;
  name: string;
  note: string;
  /** Price in whole cents — avoids floating point errors and matches Stripe's unit_amount. */
  priceCents: number;
};

export type MenuCategory = {
  id: string;
  label: string;
  items: MenuItem[];
};

export const MENU: MenuCategory[] = [
  {
    id: "espresso",
    label: "Espresso",
    items: [
      { id: "espresso-aurora", name: "Aurora Espresso", note: "Double shot, house blend", priceCents: 350 },
      { id: "espresso-cortado", name: "Cortado", note: "Equal parts espresso & steamed milk", priceCents: 400 },
      { id: "espresso-cappuccino", name: "Cappuccino", note: "Espresso, steamed milk, deep foam", priceCents: 450 },
      { id: "espresso-flat-white", name: "Flat White", note: "Ristretto shots, microfoam", priceCents: 475 },
      { id: "espresso-honey-oat-latte", name: "Honey Oat Latte", note: "House honey, steamed oat milk", priceCents: 525 },
    ],
  },
  {
    id: "pour-over",
    label: "Pour Over",
    items: [
      { id: "pour-over-ethiopia-guji", name: "Ethiopia Guji", note: "Jasmine, peach, black tea", priceCents: 600 },
      { id: "pour-over-colombia-huila", name: "Colombia Huila", note: "Brown sugar, red apple, cocoa", priceCents: 550 },
      { id: "pour-over-kenya-nyeri", name: "Kenya Nyeri", note: "Blackcurrant, grapefruit, cane", priceCents: 650 },
      { id: "pour-over-sumatra-lintong", name: "Sumatra Lintong", note: "Cedar, dark chocolate, herbs", priceCents: 575 },
    ],
  },
  {
    id: "spring",
    label: "Spring Specials",
    items: [
      { id: "spring-aurora-mocha", name: "Aurora Mocha", note: "Raspberry syrup, white chocolate sauce, espresso, milk of choice", priceCents: 650 },
      { id: "spring-banana-latte", name: "Banana Latte", note: "Caramelized banana syrup, espresso, banana cold foam", priceCents: 650 },
      { id: "spring-carrot-cake-matcha", name: "Carrot Cake Matcha", note: "Carrot cake syrup, matcha, cream cheese cold foam", priceCents: 650 },
      { id: "spring-sunrise-lemonade", name: "Sunrise Lemonade", note: "Honey syrup, lemonade, espresso, ice", priceCents: 500 },
      { id: "spring-dubai-chocolate-latte", name: "Dubai Chocolate Latte", note: "Dark chocolate sauce, pistachio sauce, espresso", priceCents: 650 },
      { id: "spring-freddo-cappuccino", name: "Freddo Cappuccino", note: "Espresso, ice, choice of milk", priceCents: 550 },
      { id: "spring-blueberry-latte", name: "Blueberry Latte", note: "Blueberry syrup, espresso, milk of choice", priceCents: 650 },
      { id: "spring-pear-iced-tea", name: "Pear Iced Tea", note: "Pear syrup, black tea, ice", priceCents: 500 },
    ],
  },
  {
    id: "summer",
    label: "Summer Specials",
    items: [
      { id: "summer-blackberry-ginger-matcha-lemonade", name: "Blackberry Ginger Matcha Lemonade", note: "Blackberry syrup, ginger syrup, ceremonial matcha, lemonade", priceCents: 750 },
      { id: "summer-blueberry-banana-pancake-latte", name: "Blueberry Banana Pancake Latte", note: "Blueberry puree, banana syrup, espresso, maple cold foam", priceCents: 700 },
      { id: "summer-blueberry-passionfruit-latte", name: "Blueberry Passionfruit Latte", note: "Blueberry puree, passionfruit puree, espresso, milk", priceCents: 700 },
      { id: "summer-freddo-cappuccino", name: "Freddo Cappuccino", note: "Shaken espresso, frothed milk, cinnamon", priceCents: 650 },
      { id: "summer-maple-ginger-latte", name: "Maple Ginger Latte", note: "Ginger syrup, maple syrup, espresso, milk", priceCents: 700 },
    ],
  },
  {
    id: "pastries",
    label: "Pastries",
    items: [
      { id: "pastries-banana-bread", name: "Banana Bread", note: "Sliced daily, baked in-house", priceCents: 450 },
      { id: "pastries-almond-danish", name: "Sliced Almond Danish", note: "Almond cream, sliced almonds, powdered sugar", priceCents: 475 },
      { id: "pastries-matcha-strawberry-cake", name: "Matcha Strawberry Cake", note: "Matcha buttercream, fresh strawberry", priceCents: 525 },
    ],
  },
];

export function findMenuItem(id: string): MenuItem | undefined {
  for (const category of MENU) {
    const item = category.items.find((i) => i.id === id);
    if (item) return item;
  }
  return undefined;
}

export function formatPrice(cents: number): string {
  return (cents / 100).toFixed(2);
}
