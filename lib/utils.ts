/** Join class names, skipping falsy values. */
export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

/** Format a whole-rupee amount, e.g. 18900 → "₹18,900". */
export function formatPrice(amount: number) {
  return inr.format(amount);
}
