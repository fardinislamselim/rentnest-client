/** Shared number and date formatting for the admin dashboard. */

const currency = new Intl.NumberFormat("en-BD", {
  style: "currency",
  currency: "BDT",
  maximumFractionDigits: 0,
});

const compactCurrency = new Intl.NumberFormat("en-BD", {
  style: "currency",
  currency: "BDT",
  notation: "compact",
  maximumFractionDigits: 1,
});

const plain = new Intl.NumberFormat("en-US");

export const formatCurrency = (amount: number) => currency.format(amount);

/** Compact form for stat tiles, where the exact figure is shown on hover. */
export const formatCurrencyCompact = (amount: number) =>
  amount >= 100_000 ? compactCurrency.format(amount) : currency.format(amount);

export const formatNumber = (value: number) => plain.format(value);

export const formatDate = (value: string | null | undefined) => {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("en-BD", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

/** "JD" from "John Doe" — used for the avatar stand-ins in the tables. */
export const initialsOf = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .map((part) => part[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase() || "?";
