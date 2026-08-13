import type { CategoryName } from "@costiq/shared";

export const CATEGORY_STYLE: Record<
  CategoryName,
  { icon: string; bg: string; fg: string; bar: string }
> = {
  Food: { icon: "utensils", bg: "#FFE9D6", fg: "#FFB766", bar: "#FFB766" },
  Shopping: { icon: "shopping-cart", bg: "#C2EDDA", fg: "#23935C", bar: "#23935C" },
  Travel: { icon: "car", bg: "#FAFDFE", fg: "#2C6E8F", bar: "#2C6E8F" },
  Bills: { icon: "receipt", bg: "#FEEAE3", fg: "#F43A09", bar: "#F43A09" },
  Subscriptions: { icon: "tv", bg: "#FEEAE3", fg: "#F43A09", bar: "#F43A09" },
  Entertainment: { icon: "clapperboard", bg: "#EDE4FB", fg: "#7C5CC4", bar: "#7C5CC4" },
  Health: { icon: "heart-pulse", bg: "#DCF3EE", fg: "#1F9E85", bar: "#1F9E85" },
  Other: { icon: "circle-dashed", bg: "#E0F2F7", fg: "#5B7885", bar: "#5B7885" },
};

export function categoryStyle(name: string | null | undefined) {
  return CATEGORY_STYLE[(name as CategoryName) ?? "Other"] ?? CATEGORY_STYLE.Other;
}
