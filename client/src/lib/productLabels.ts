import type { ProductCategory } from "../services/productsApi";

export const PRODUCT_CATEGORY_OPTIONS: { value: ProductCategory | ""; label: string }[] = [
  { value: "", label: "Всички категории" },
  { value: "meat", label: "Месо" },
  { value: "fish", label: "Риба" },
  { value: "eggs", label: "Яйца" },
  { value: "dairy", label: "Млечни" },
  { value: "grains", label: "Зърнени" },
  { value: "bread", label: "Хляб" },
  { value: "pasta", label: "Паста" },
  { value: "rice", label: "Ориз" },
  { value: "legumes", label: "Бобови" },
  { value: "vegetables", label: "Зеленчуци" },
  { value: "fruits", label: "Плодове" },
  { value: "nuts", label: "Ядки" },
  { value: "seeds", label: "Семена" },
  { value: "oils", label: "Мазнини" },
  { value: "sweets", label: "Сладки" },
  { value: "snacks", label: "Снакове" },
  { value: "drinks", label: "Напитки" },
  { value: "sauces", label: "Сосове" },
  { value: "ready meals", label: "Готови храни" },
  { value: "supplements", label: "Добавки" },
];

export function productCategoryLabel(value: ProductCategory): string {
  return PRODUCT_CATEGORY_OPTIONS.find((option) => option.value === value)?.label ?? value;
}
