export type Product = {
  id: string;
  name: string;
  brand: string;
  category: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  serving: string;
  favorite: boolean;
};

export const products: Product[] = [
  { id: '1', name: 'Протеинов шейк – Ванилия', brand: 'Optimum Nutrition', category: 'Добавки', calories: 120, protein: 24, carbs: 3, fat: 1.5, serving: '30г', favorite: true },
  { id: '2', name: 'Овесени ядки', brand: 'Натурал', category: 'Зърнени', calories: 389, protein: 17, carbs: 66, fat: 7, serving: '100г', favorite: true },
  { id: '3', name: 'Пилешки гърди', brand: 'Прясно месо', category: 'Месо', calories: 165, protein: 31, carbs: 0, fat: 3.6, serving: '100г', favorite: false },
  { id: '4', name: 'Гръцко кисело мляко 0%', brand: 'Данон', category: 'Млечни', calories: 59, protein: 10, carbs: 3.6, fat: 0.4, serving: '100г', favorite: true },
  { id: '5', name: 'Кафяв ориз', brand: "Uncle Ben's", category: 'Зърнени', calories: 360, protein: 8, carbs: 76, fat: 2.5, serving: '100г', favorite: false },
  { id: '6', name: 'Бадеми', brand: 'Натурал', category: 'Ядки', calories: 579, protein: 21, carbs: 22, fat: 50, serving: '100г', favorite: false },
  { id: '7', name: 'Сьомга', brand: 'Прясна риба', category: 'Риба', calories: 208, protein: 20, carbs: 0, fat: 13, serving: '100г', favorite: true },
  { id: '8', name: 'Яйца', brand: 'Натурал', category: 'Яйца', calories: 155, protein: 13, carbs: 1.1, fat: 11, serving: '100г', favorite: false },
  { id: '9', name: 'Авокадо', brand: 'Натурал', category: 'Плодове', calories: 160, protein: 2, carbs: 9, fat: 15, serving: '100г', favorite: false },
  { id: '10', name: 'Извара 0%', brand: 'Милко', category: 'Млечни', calories: 72, protein: 12, carbs: 3, fat: 0.5, serving: '100г', favorite: true },
];

export const categories = ['Всички', 'Добавки', 'Месо', 'Млечни', 'Зърнени', 'Риба', 'Ядки', 'Яйца', 'Плодове'];
