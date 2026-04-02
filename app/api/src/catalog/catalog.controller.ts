import { Controller, Get, Param, Query, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

type RecipeContent = {
  id: number;
  name: string;
  category: string;
  time: string;
  serves: number;
  dietary: string[];
  protein: boolean;
  img: string;
  desc: string;
  rating: number;
  popular: boolean;
};

type ReviewHero = {
  id: number;
  tag: string;
  title: string;
  desc: string;
  img1: string;
  img2: string;
};

type ReviewCard = {
  id: number;
  tab: 'Customer Reviews' | 'Press Reviews';
  color: string;
  img: string;
  title: string;
  desc: string;
};

const RECIPES: RecipeContent[] = [
  {
    id: 1,
    name: 'MIXED BERRY SMOOTHIE BOWL',
    category: 'Smoothies',
    time: '10 min',
    serves: 2,
    dietary: ['Vegetarian', 'Vegan'],
    protein: false,
    img: 'https://images.unsplash.com/photo-1576777647084-cac2dd176310?w=400&q=80',
    desc: 'Thick frozen berry blend topped with granola and fresh fruit.',
    rating: 4.9,
    popular: true,
  },
  {
    id: 2,
    name: 'MANGO LASSI SMOOTHIE',
    category: 'Smoothies',
    time: '5 min',
    serves: 2,
    dietary: ['Vegetarian'],
    protein: false,
    img: 'https://images.unsplash.com/photo-1667889244854-364252b3c14a?w=400&q=80',
    desc: 'Frozen mango blended with yogurt and cardamom.',
    rating: 4.8,
    popular: false,
  },
  {
    id: 3,
    name: 'PROTEIN QUINOA POWER BOWL',
    category: 'Meal Prep',
    time: '20 min',
    serves: 4,
    dietary: ['Vegan', 'Vegetarian'],
    protein: true,
    img: 'https://images.unsplash.com/photo-1679279726937-122c49626802?w=400&q=80',
    desc: 'Quinoa with roasted broccoli, avocado and tahini.',
    rating: 4.9,
    popular: true,
  },
  {
    id: 4,
    name: 'SWEET POTATO BABY PUREE',
    category: 'Snacks',
    time: '15 min',
    serves: 6,
    dietary: ['Vegan', 'Vegetarian'],
    protein: false,
    img: 'https://images.unsplash.com/photo-1711205229065-89353695a869?w=400&q=80',
    desc: 'Naturally sweet puree perfect for baby first food.',
    rating: 5,
    popular: true,
  },
  {
    id: 5,
    name: 'BROCCOLI AND VEG STIR FRY',
    category: 'Snacks',
    time: '12 min',
    serves: 3,
    dietary: ['Vegan', 'Vegetarian'],
    protein: false,
    img: 'https://images.unsplash.com/photo-1662611284583-f34180194370?w=400&q=80',
    desc: 'Broccoli and spinach wok tossed in garlic and ginger.',
    rating: 4.7,
    popular: false,
  },
  {
    id: 6,
    name: 'BERRY PARFAIT LAYERS',
    category: 'Desserts',
    time: '8 min',
    serves: 2,
    dietary: ['Vegetarian'],
    protein: false,
    img: 'https://images.unsplash.com/photo-1769434129307-33ecda53c1ed?w=400&q=80',
    desc: 'Mixed berry blend layered with yogurt and granola.',
    rating: 4.8,
    popular: false,
  },
  {
    id: 7,
    name: 'GYM MEAL PREP SUNDAY',
    category: 'Meal Prep',
    time: '35 min',
    serves: 5,
    dietary: ['Vegan'],
    protein: true,
    img: 'https://images.unsplash.com/photo-1687041568037-dab13851ea14?w=400&q=80',
    desc: 'Five days of high protein meals using our Quinoa Bowl.',
    rating: 4.9,
    popular: true,
  },
  {
    id: 8,
    name: 'ACAI SMOOTHIE BOWL',
    category: 'Smoothies',
    time: '10 min',
    serves: 1,
    dietary: ['Vegan', 'Vegetarian'],
    protein: false,
    img: 'https://images.unsplash.com/photo-1621470626764-0e8c9303800a?w=400&q=80',
    desc: 'Thick acai base topped with berries and coconut flakes.',
    rating: 4.9,
    popular: true,
  },
  {
    id: 9,
    name: 'GULAB JAMUN DESSERT BITES',
    category: 'Desserts',
    time: '25 min',
    serves: 8,
    dietary: ['Vegetarian'],
    protein: false,
    img: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400&q=80',
    desc: 'Soft golden dumplings soaked in cardamom rose syrup.',
    rating: 4.9,
    popular: true,
  },
];

const REVIEW_HERO_SLIDES: ReviewHero[] = [
  {
    id: 1,
    tag: 'FEATURED REVIEW',
    title: 'NUTROFREEZE\nX CHEF ARJUN',
    desc: 'Renowned chef Arjun Sharma partners with NutroFreeze to show how our frozen South Asian snacks bring authentic flavour with zero compromise.',
    img1: 'https://images.unsplash.com/photo-1716801564904-5605f562b664?w=480&q=90',
    img2: 'https://images.unsplash.com/photo-1730635572578-8d51c382d4c2?w=200&q=80',
  },
  {
    id: 2,
    tag: 'FEATURED REVIEW',
    title: '4.9 STARS\nOUR CUSTOMERS SPEAK',
    desc: 'Thousands of families across Canada rate NutroFreeze as their go-to frozen food brand. Here is what they love most about us.',
    img1: 'https://images.unsplash.com/photo-1640542509430-f529fdfce835?w=480&q=90',
    img2: 'https://images.unsplash.com/photo-1588505617603-f80b72bf8f24?w=200&q=80',
  },
  {
    id: 3,
    tag: 'FEATURED REVIEW',
    title: 'GROCERY BUSINESS\nMAGAZINE PICK',
    desc: 'Canada leading trade magazine celebrated NutroFreeze mission to bring authentic South Asian frozen flavours to mainstream grocery shelves.',
    img1: 'https://images.unsplash.com/photo-1727041423608-c15f1a145cc2?w=480&q=90',
    img2: 'https://images.unsplash.com/photo-1647553756926-21a62021b9d2?w=200&q=80',
  },
];

const REVIEW_CARDS: ReviewCard[] = [
  {
    id: 1,
    tab: 'Press Reviews',
    color: '#0891b2',
    img: 'https://images.unsplash.com/photo-1716801564904-5605f562b664?w=400&q=80',
    title: '5 STARS FROM FOOD INSIDER CANADA',
    desc: 'Food Insider Canada names NutroFreeze the best frozen South Asian brand for 2025, praising its authentic spice profiles.',
  },
  {
    id: 2,
    tab: 'Customer Reviews',
    color: '#ca8a04',
    img: 'https://images.unsplash.com/photo-1765360024320-b2ab819c6f75?w=400&q=80',
    title: 'A GAME CHANGER FOR BUSY FAMILIES',
    desc: 'I used to spend hours in the kitchen. NutroFreeze changed everything. The samosas taste exactly like my mom made them.',
  },
  {
    id: 3,
    tab: 'Press Reviews',
    color: '#0d9488',
    img: 'https://images.unsplash.com/photo-1647553756926-21a62021b9d2?w=400&q=80',
    title: 'FEATURED IN TORONTO LIFE MAGAZINE',
    desc: 'Toronto Life spotlights NutroFreeze as a pioneer bringing nutritious halal-certified South Asian frozen food to Canadian grocery.',
  },
  {
    id: 4,
    tab: 'Press Reviews',
    color: '#7c3aed',
    img: 'https://images.unsplash.com/photo-1525790428446-ad5140bdd234?w=400&q=80',
    title: 'HEALTH DIGEST TOP PICK 2025',
    desc: 'NutroFreeze Protein Quinoa Bowl earns Health Digest top pick for best ready-to-eat high-protein frozen meal of the year.',
  },
  {
    id: 5,
    tab: 'Customer Reviews',
    color: '#9f1239',
    img: 'https://images.unsplash.com/photo-1730635572578-8d51c382d4c2?w=400&q=80',
    title: 'MY KIDS ASK FOR IT EVERY WEEK',
    desc: 'The Mini Punjabi Samosas have become a weekly staple in our house. Kids love them and I love the clean ingredients.',
  },
  {
    id: 6,
    tab: 'Customer Reviews',
    color: '#0369a1',
    img: 'https://images.unsplash.com/photo-1646343589384-9d4147eed5fd?w=400&q=80',
    title: 'SMOOTHIE BOWL SENSATION',
    desc: 'NutroFreeze frozen berry blends are the go-to for smoothie bowl lovers everywhere rich, vibrant and completely natural.',
  },
  {
    id: 7,
    tab: 'Press Reviews',
    color: '#0891b2',
    img: 'https://images.unsplash.com/photo-1640542509430-f529fdfce835?w=400&q=80',
    title: 'CURRY LOVERS REJOICE',
    desc: 'Chef Arjun Sharma joins NutroFreeze to spotlight how traditional South Asian freezing techniques preserve authentic flavour and nutrition.',
  },
  {
    id: 8,
    tab: 'Customer Reviews',
    color: '#be185d',
    img: 'https://images.unsplash.com/photo-1758221617316-1fa0fab44324?w=400&q=80',
    title: 'FAMILY TASTE TEST WE ARE CONVINCED',
    desc: 'We did a blind taste test between fresh naan and NutroFreeze. Our family could not tell the difference.',
  },
];

@Controller()
export class CatalogController {
  constructor(private prisma: PrismaService) {}

  @Get()
  root() {
    return {
      ok: true,
      service: 'NeutroFreeze API',
      endpoints: ['/health', '/catalog/categories', '/catalog/products'],
    };
  }

  @Get('health')
  health() {
    return { ok: true };
  }

  @Get('content/recipes')
  listRecipes() {
    return RECIPES;
  }

  @Get('content/reviews/hero')
  listReviewHeroSlides() {
    return REVIEW_HERO_SLIDES;
  }

  @Get('content/reviews/cards')
  listReviewCards() {
    return REVIEW_CARDS;
  }

  @Get('catalog/categories')
  async listCategories() {
    return this.prisma.category.findMany({
      orderBy: { sortOrder: 'asc' },
      include: { _count: { select: { products: true } } },
    });
  }

  @Get('catalog/products')
  async listProducts(@Query('categorySlug') categorySlug?: string) {
    const where: any = { status: 'ACTIVE' as const };
    if (categorySlug) {
      where.category = { slug: categorySlug };
    }
    return this.prisma.product.findMany({
      where,
      include: {
        category: true,
        variants: { include: { inventory: true } },
        images: { orderBy: { sortOrder: 'asc' } },
      },
      orderBy: { title: 'asc' },
    });
  }

  @Get('catalog/products/:slug')
  async getProduct(@Param('slug') slug: string) {
    const product = await this.prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        variants: { include: { inventory: true } },
        images: { orderBy: { sortOrder: 'asc' } },
      },
    });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }
}
