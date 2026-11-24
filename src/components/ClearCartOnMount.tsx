"use client";

import { useEffect } from "react";
import { useCart } from "./CartContext";

/** Empties the cart once payment succeeds, so a refresh of the success
 *  page doesn't leave a stale cart behind. */
export default function ClearCartOnMount() {
  const { clear } = useCart();
  useEffect(() => {
    clear();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}
