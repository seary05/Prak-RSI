import type { Stall } from "../types/stall";

const EMOJI_RULES: { keys: string[]; emoji: string }[] = [
  { keys: ["bakso", "mie", "mi ", "soto", "kuah", "ramen"], emoji: "🍜" },
  { keys: ["ayam", "geprek", "chicken"], emoji: "🍗" },
  { keys: ["sate"], emoji: "🍢" },
  { keys: ["minum", "jus", "kopi", "teh", "boba", "es "], emoji: "🥤" },
  { keys: ["snack", "camilan", "gorengan", "jajan"], emoji: "🍟" },
  { keys: ["roti", "kue", "dessert", "manis", "cake"], emoji: "🍰" },
  { keys: ["sehat", "salad", "sayur", "vegetarian"], emoji: "🥗" },
  { keys: ["nasi", "makan", "berat", "rice"], emoji: "🍛" },
];

const GRADIENTS = [
  "from-brand-200 to-amber-100",
  "from-rose-200 to-orange-100",
  "from-amber-200 to-lime-100",
  "from-orange-200 to-yellow-100",
  "from-red-200 to-orange-100",
  "from-emerald-100 to-amber-100",
];

/** Emoji dipilih dari kategori + nama; gradien dipilih stabil berdasarkan id. */
/** Emoji dipilih dari teks (kategori/nama), dipakai kartu warung dan chip kategori. */
export function emojiFor(text: string): string {
  const t = text.toLowerCase();
  return EMOJI_RULES.find((r) => r.keys.some((k) => t.includes(k)))?.emoji ?? "🍽️";
}

/** Emoji dipilih dari kategori + nama; gradien dipilih stabil berdasarkan id. */
export function stallVisual(stall: Pick<Stall, "id" | "name" | "category">) {
  return {
    emoji: emojiFor(`${stall.category ?? ""} ${stall.name}`),
    gradient: GRADIENTS[Math.abs(stall.id) % GRADIENTS.length],
  };
}