import { useMemo } from "react";
import { categoryStyle } from "@/lib/category-style";
import { getIcon, pascalCase } from "@/lib/icon";

export function CategoryIcon({ categoryName, size = 18 }: { categoryName: string | null | undefined; size?: number }) {
  const style = categoryStyle(categoryName);
  // getIcon returns a stable reference from a static map — safe despite the lint heuristic.
  const Icon = useMemo(() => getIcon(pascalCase(style.icon)), [style.icon]);
  const boxSize = size + 20;

  return (
    <span
      className="rounded-[9px] flex items-center justify-center shrink-0"
      style={{ background: style.bg, width: boxSize, height: boxSize }}
    >
      {/* eslint-disable-next-line react-hooks/static-components -- see comment above */}
      <Icon size={size} style={{ color: style.fg }} />
    </span>
  );
}
