import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create admin
  const passwordHash = await bcrypt.hash('admin123', 10);
  await prisma.admin.upsert({
    where: { login: 'admin' },
    update: { passwordHash },
    create: { login: 'admin', passwordHash },
  });
  console.log('Admin created: admin / admin123');

  // Create categories
  const categories = [
    { name: 'Сеты', slug: 'sets', sortOrder: 0 },
    { name: 'Роллы', slug: 'rolls', sortOrder: 1 },
    { name: 'Соусы', slug: 'sauces', sortOrder: 2 },
    { name: 'Запечённые роллы', slug: 'baked-rolls', sortOrder: 3 },
    { name: 'Закуски', slug: 'snacks', sortOrder: 4 },
    { name: 'Напитки', slug: 'drinks', sortOrder: 5 },
  ];

  const categoryMap = new Map<string, number>();

  for (const cat of categories) {
    const created = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, sortOrder: cat.sortOrder },
      create: cat,
    });
    categoryMap.set(cat.name, created.id);
  }
  console.log('Categories created');

  // Create products
  const products = [
    {
      name: 'Сет "Любимка"',
      pieces: '40 роллов',
      description:
        'Рис, лосось, сыр, огурец, нори, авокадо, сливочный сыр, тобико',
      price: 1940,
      imageUrl: '/uploads/products/set1.png',
      categoryName: 'Сеты',
      isRecommended: false,
      sortOrder: 0,
    },
    {
      name: 'Сет "Для двоих"',
      pieces: '32 ролла',
      description: 'Филадельфия, Калифорния, Дракон, Спайси лосось',
      price: 1690,
      imageUrl: '/uploads/products/set2.png',
      categoryName: 'Сеты',
      isRecommended: true,
      sortOrder: 1,
    },
    {
      name: 'Сет "Хит"',
      pieces: '48 роллов',
      description:
        'Филадельфия, Калифорния, Аляска, Унаги маки, Спайси лосось, Тобико',
      price: 2490,
      imageUrl: '/uploads/products/set3.png',
      categoryName: 'Сеты',
      isRecommended: false,
      sortOrder: 2,
    },
    {
      name: 'Филадельфия',
      pieces: '8 шт',
      description: 'Рис, лосось, сливочный сыр',
      price: 990,
      imageUrl: '/uploads/products/roll1.png',
      categoryName: 'Роллы',
      isRecommended: true,
      sortOrder: 0,
    },
    {
      name: 'Калифорния',
      pieces: '8 шт',
      description: 'Рис, краб, авокадо, огурец, тобико',
      price: 890,
      imageUrl: '/uploads/products/roll2.png',
      categoryName: 'Роллы',
      isRecommended: true,
      sortOrder: 1,
    },
    {
      name: 'Ролли темпура',
      pieces: '8 шт',
      description: 'Рис, лосось, сливочный сыр, темпура',
      price: 800,
      imageUrl: '/uploads/products/roll3.png',
      categoryName: 'Роллы',
      isRecommended: false,
      sortOrder: 2,
    },
    {
      name: 'Дракон',
      pieces: '8 шт',
      description: 'Рис, угорь, авокадо, сливочный сыр, унаги соус',
      price: 1100,
      imageUrl: '/uploads/products/roll1.png',
      categoryName: 'Роллы',
      isRecommended: false,
      sortOrder: 3,
    },
    {
      name: 'Спайси лосось',
      pieces: '8 шт',
      description: 'Рис, лосось, спайси соус, огурец',
      price: 790,
      imageUrl: '/uploads/products/roll2.png',
      categoryName: 'Роллы',
      isRecommended: false,
      sortOrder: 4,
    },
    {
      name: 'Запечённая Калифорния',
      pieces: '8 шт',
      description: 'Рис, краб, авокадо, сырная шапка',
      price: 800,
      imageUrl: '/uploads/products/roll3.png',
      categoryName: 'Запечённые роллы',
      isRecommended: false,
      sortOrder: 0,
    },
    {
      name: 'Запечённая Филадельфия',
      pieces: '8 шт',
      description: 'Рис, лосось, сливочный сыр, сырная шапка',
      price: 950,
      imageUrl: '/uploads/products/roll1.png',
      categoryName: 'Запечённые роллы',
      isRecommended: false,
      sortOrder: 1,
    },
    {
      name: 'Спринг-ролл',
      pieces: '4 шт',
      description: 'Рисовая бумага, овощи, креветка',
      price: 450,
      imageUrl: '/uploads/products/recom1.png',
      categoryName: 'Закуски',
      isRecommended: false,
      sortOrder: 0,
    },
    {
      name: 'Coca-Cola',
      pieces: '0.5 л',
      description: '',
      price: 100,
      imageUrl: '/uploads/products/recom2.png',
      categoryName: 'Напитки',
      isRecommended: false,
      sortOrder: 0,
    },
    {
      name: 'Вода',
      pieces: '0.5 л',
      description: '',
      price: 50,
      imageUrl: '/uploads/products/recom2.png',
      categoryName: 'Напитки',
      isRecommended: false,
      sortOrder: 1,
    },
  ];

  // Delete existing products for idempotent seeding
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.product.deleteMany({});
  for (const product of products) {
    const categoryId = categoryMap.get(product.categoryName)!;
    await prisma.product.create({
      data: {
        name: product.name,
        pieces: product.pieces,
        description: product.description,
        price: product.price,
        imageUrl: product.imageUrl,
        categoryId,
        isRecommended: product.isRecommended,
        sortOrder: product.sortOrder,
      },
    });
  }
  console.log('Products created');

  // Create sauces
  await prisma.sauce.deleteMany({});
  const sauces = [
    { name: 'Унаги', price: 0, sortOrder: 0 },
    { name: 'Соевый', price: 0, sortOrder: 1 },
    { name: 'Сырный', price: 0, sortOrder: 2 },
    { name: 'Спайси', price: 0, sortOrder: 3 },
  ];
  for (const sauce of sauces) {
    await prisma.sauce.create({ data: sauce });
  }
  console.log('Sauces created');

  // Create promotions
  await prisma.promotion.deleteMany({});
  const promotions = [
    {
      title: 'Акция 1',
      imageUrl: '/uploads/promotions/sale-card1.png',
      sortOrder: 0,
    },
    {
      title: 'Акция 2',
      imageUrl: '/uploads/promotions/sale-card2.png',
      sortOrder: 1,
    },
    {
      title: 'Акция 3',
      imageUrl: '/uploads/promotions/sale-card3.png',
      sortOrder: 2,
    },
    {
      title: 'Акция 4',
      imageUrl: '/uploads/promotions/sale-card4.png',
      sortOrder: 3,
    },
  ];
  for (const promo of promotions) {
    await prisma.promotion.create({ data: promo });
  }
  console.log('Promotions created');

  // Create gift promotion
  await prisma.giftPromotion.deleteMany({});
  await prisma.giftPromotion.create({
    data: {
      thresholdAmount: 3500,
      giftDescription: 'Филадельфия 10шт',
      isActive: true,
    },
  });
  console.log('Gift promotion created');

  console.log('Seed completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
