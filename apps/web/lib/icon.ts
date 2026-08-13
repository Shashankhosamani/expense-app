import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";

type IconName = keyof typeof Icons;

function isIconName(name: string): name is IconName {
  return name in Icons;
}

export function getIcon(name: string): LucideIcon {
  if (!isIconName(name)) return Icons.Circle;
  const icon = Icons[name];
  return typeof icon === "function" ? (icon as LucideIcon) : Icons.Circle;
}

export function pascalCase(kebab: string): string {
  return kebab
    .split("-")
    .map((p) => p[0].toUpperCase() + p.slice(1))
    .join("");
}
