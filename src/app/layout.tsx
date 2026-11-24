import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/CartContext";
import CartDrawer from "@/components/CartDrawer";

// Both are variable fonts: leaving `weight` unset loads one file per style
// that covers every weight, instead of a separate @font-face per weight.
const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Aurora Cafe — Rise With The Sun",
  description:
    "Aurora Cafe is a neighborhood coffeehouse built around single-origin espresso, slow pour-overs, and warm mornings. Explore our menu, or stop by and order in person.",
  keywords: [
    "Aurora Cafe",
    "coffee shop",
    "specialty coffee",
    "espresso bar",
    "pour over coffee",
    "coffee shop near me",
  ],
  openGraph: {
    title: "Aurora Cafe — Rise With The Sun",
    description:
      "A neighborhood coffeehouse built around single-origin espresso, slow pour-overs, and warm mornings.",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-paper text-ink">
        <CartProvider>
          {children}
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
