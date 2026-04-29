export type ShopProduct = {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  badge?: string;
};

export type Bundle = {
  id: string;
  name: string;
  desc: string;
  price: number;
  originalPrice: number;
  items: string[];
  badge: string;
};

export const shopProducts: ShopProduct[] = [
  { id: '1', name: 'Суроватъчен протеин – 2кг', category: 'Протеин', price: 89.99, originalPrice: 109.99, rating: 4.8, reviews: 342, badge: 'Топ продукт' },
  { id: '2', name: 'Креатин монохидрат – 500г', category: 'Креатин', price: 34.99, rating: 4.7, reviews: 218 },
  { id: '3', name: 'BCAA 2:1:1 – 300г', category: 'Аминокиселини', price: 29.99, originalPrice: 39.99, rating: 4.5, reviews: 156 },
  { id: '4', name: 'Омега-3 – 90 капсули', category: 'Витамини', price: 22.99, rating: 4.6, reviews: 89 },
  { id: '5', name: 'Мултивитамини – 60 таблетки', category: 'Витамини', price: 18.99, rating: 4.4, reviews: 124 },
  { id: '6', name: 'Предтренировъчен комплекс', category: 'Бустери', price: 44.99, originalPrice: 54.99, rating: 4.3, reviews: 76, badge: 'Ново' },
];

export const bundles: Bundle[] = [
  {
    id: 'b1',
    name: 'Стартов пакет',
    desc: 'Всичко необходимо за начинаещи',
    price: 119.99,
    originalPrice: 159.97,
    items: ['Суроватъчен протеин 1кг', 'Креатин 250г', 'Мултивитамини'],
    badge: '-25%',
  },
  {
    id: 'b2',
    name: 'Напреднал пакет',
    desc: 'За максимален напредък',
    price: 189.99,
    originalPrice: 249.96,
    items: ['Протеин 2кг', 'Креатин 500г', 'BCAA', 'Омега-3'],
    badge: '-24%',
  },
];
