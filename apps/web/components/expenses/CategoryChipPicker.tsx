import type { Category } from "@costiq/shared";
import { categoryStyle } from "@/lib/category-style";

interface CategoryChipPickerProps {
  categories: Category[];
  value: string | undefined;
  onChange: (id: string) => void;
}

export function CategoryChipPicker({ categories, value, onChange }: CategoryChipPickerProps) {
  return (
    <div className="flex gap-2 flex-wrap">
      {categories.map((c) => {
        const style = categoryStyle(c.name);
        const selected = value === c.id;
        return (
          <button
            key={c.id}
            onClick={() => onChange(c.id)}
            className="text-[13px] rounded-full px-3.5 py-2 border cursor-pointer"
            style={
              selected
                ? { color: style.fg, background: style.bg, borderColor: style.fg }
                : { color: "#33505B", background: "#FAFDFE", borderColor: "var(--color-border)" }
            }
          >
            {c.name}
          </button>
        );
      })}
    </div>
  );
}
