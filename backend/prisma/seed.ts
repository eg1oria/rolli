import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'sets' },
      update: {},
      create: { name: 'Сеты', slug: 'sets', sortOrder: 1 },
    }),
    prisma.category.upsert({
      where: { slug: 'rolls' },
      update: {},
      create: { name: 'Роллы', slug: 'rolls', sortOrder: 2 },
    }),
    prisma.category.upsert({
      where: { slug: 'baked-rolls' },
      update: {},
      create: { name: 'Запечённые роллы', slug: 'baked-rolls', sortOrder: 3 },
    }),
    prisma.category.upsert({
      where: { slug: 'snacks' },
      update: {},
      create: { name: 'Закуски', slug: 'snacks', sortOrder: 4 },
    }),
    prisma.category.upsert({
      where: { slug: 'sauces' },
      update: {},
      create: { name: 'Соусы', slug: 'sauces', sortOrder: 5 },
    }),
    prisma.category.upsert({
      where: { slug: 'drinks' },
      update: {},
      create: { name: 'Напитки', slug: 'drinks', sortOrder: 6 },
    }),
  ]);

  const [sets, rolls, bakedRolls, snacks, sauceCat, drinks] = categories;

  // Products
  const productsData = [
    {
      name: 'Сет "Любимка"',
      pieces: '40 роллов',
      description: 'Рис, лосось, сыр, огурец, крабовая палочка, сливочный сыр, нори',
      price: 194000,
      categoryId: sets.id,
      isRecommended: false,
      sortOrder: 1,
    },
    {
      name: 'Сет "Семейный"',
      pieces: '56 роллов',
      description: 'Рис, лосось, тунец, угорь, огурец, авокадо, сливочный сыр, нори',
      price: 279000,
      categoryId: sets.id,
      isRecommended: true,
      sortOrder: 2,
    },
    {
      name: 'Сет "Хит"',
      pieces: '32 ролла',
      description: 'Рис, лосось, сливочный сыр, огурец, нори, кунжут',
      price: 159000,
      categoryId: sets.id,
      isRecommended: false,
      sortOrder: 3,
    },
    {
      name: 'Филадельфия',
      pieces: '8 шт',
      description: 'Рис, лосось, сливочный сыр',
      price: 99000,
      categoryId: rolls.id,
      isRecommended: true,
      sortOrder: 1,
    },
    {
      name: 'Ролли темпура',
      pieces: '8 шт',
      description: 'Рис, лосось, сливочный сыр, темпурная крошка',
      price: 80000,
      categoryId: rolls.id,
      isRecommended: false,
      sortOrder: 2,
    },
    {
      name: 'Калифорния',
      pieces: '8 шт',
      description: 'Рис, крабовая палочка, огурец, авокадо, тобико',
      price: 85000,
      categoryId: rolls.id,
      isRecommended: true,
      sortOrder: 3,
    },
    {
      name: 'Дракон',
      pieces: '8 шт',
      description: 'Рис, угорь, сливочный сыр, огурец, соус унаги, кунжут',
      price: 95000,
      categoryId: rolls.id,
      isRecommended: false,
      sortOrder: 4,
    },
    {
      name: 'Запечённая Калифорния',
      pieces: '8 шт',
      description: 'Рис, крабовая палочка, огурец, сырная шапка',
      price: 80000,
      categoryId: bakedRolls.id,
      isRecommended: false,
      sortOrder: 1,
    },
    {
      name: 'Запечённая Филадельфия',
      pieces: '8 шт',
      description: 'Рис, лосось, сливочный сыр, сырная шапка',
      price: 105000,
      categoryId: bakedRolls.id,
      isRecommended: true,
      sortOrder: 2,
    },
    {
      name: 'Спринг-роллы',
      pieces: '4 шт',
      description: 'Рисовая бумага, овощи, креветки',
      price: 45000,
      categoryId: snacks.id,
      isRecommended: false,
      sortOrder: 1,
    },
    {
      name: 'Кока-Кола',
      pieces: '0.5 л',
      description: '',
      price: 10000,
      categoryId: drinks.id,
      isRecommended: false,
      sortOrder: 1,
    },
    {
      name: 'Морс клюквенный',
      pieces: '0.5 л',
      description: '',
      price: 12000,
      categoryId: drinks.id,
      isRecommended: false,
      sortOrder: 2,
    },
  ];

  for (const product of productsData) {
    await prisma.product.upsert({
      where: {
        id: productsData.indexOf(product) + 1,
      },
      update: {},
      create: product,
    });
  }

  // Sauces
  const saucesData = [
    { name: 'Унаги', price: 0, sortOrder: 1 },
    { name: 'Соевый', price: 0, sortOrder: 2 },
    { name: 'Сырный', price: 0, sortOrder: 3 },
    { name: 'Спайси', price: 0, sortOrder: 4 },
  ];

  for (const sauce of saucesData) {
    await prisma.sauce.upsert({
      where: { name: sauce.name },
      update: {},
      create: sauce,
    });
  }

  // Promotions
  for (let i = 1; i <= 4; i++) {
    await prisma.promotion.upsert({
      where: { id: i },
      update: {},
      create: {
        title: `Акция ${i}`,
        imageUrl: `/uploads/promotions/sale-card${i}.png`,
        isActive: true,
        sortOrder: i,
      },
    });
  }

  // Gift promotion
  await prisma.giftPromotion.upsert({
    where: { id: 1 },
    update: {},
    create: {
      thresholdAmount: 350000,
      giftDescription: 'Филадельфия 10шт',
      isActive: true,
    },
  });

  // Admin
  const passwordHash = await bcrypt.hash('admin123', 10);
  await prisma.admin.upsert({
    where: { login: 'admin' },
    update: {},
    create: {
      login: 'admin',
      passwordHash,
    },
  });

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
