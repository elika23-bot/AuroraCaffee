import Stripe from "stripe";

/** `null` until STRIPE_SECRET_KEY is set in the environment — routes check
 *  this and return a clear error instead of crashing. */
export const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;
