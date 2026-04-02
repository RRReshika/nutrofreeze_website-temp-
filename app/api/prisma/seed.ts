import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// ============================================
// RBAC: Permissions & Roles
// ============================================

const permissions = [
  { resource: 'product', action: 'read', description: 'View products' },
  { resource: 'product', action: 'create', description: 'Create products' },
  { resource: 'product', action: 'update', description: 'Edit products' },
  { resource: 'product', action: 'delete', description: 'Delete products' },
  { resource: 'inventory', action: 'read', description: 'View inventory' },
  { resource: 'inventory', action: 'update', description: 'Adjust inventory' },
  { resource: 'order', action: 'read', description: 'View orders' },
  { resource: 'order', action: 'update_status', description: 'Update order status' },
  { resource: 'order', action: 'cancel', description: 'Cancel orders' },
  { resource: 'order', action: 'refund', description: 'Process refunds' },
  { resource: 'promo', action: 'read', description: 'View promotions' },
  { resource: 'promo', action: 'create', description: 'Create promotions' },
  { resource: 'promo', action: 'update', description: 'Edit promotions' },
  { resource: 'promo', action: 'delete', description: 'Delete promotions' },
  { resource: 'loyalty', action: 'read', description: 'View loyalty accounts' },
  { resource: 'loyalty', action: 'adjust', description: 'Adjust points manually' },
  { resource: 'admin_user', action: 'read', description: 'View admin users' },
  { resource: 'admin_user', action: 'create', description: 'Create admin users' },
  { resource: 'admin_user', action: 'update', description: 'Edit admin users' },
  { resource: 'admin_user', action: 'delete', description: 'Delete admin users' },
  { resource: 'role', action: 'manage', description: 'Manage roles and permissions' },
];

const roles = [
  { name: 'OWNER', description: 'Full system access', permissions: permissions.map(p => `${p.resource}:${p.action}`) },
  { name: 'ADMIN', description: 'Can manage most things except critical security', permissions: [
    'product:read','product:create','product:update','product:delete','inventory:read','inventory:update',
    'order:read','order:update_status','order:cancel','order:refund',
    'promo:read','promo:create','promo:update','promo:delete','loyalty:read','loyalty:adjust',
    'admin_user:read','admin_user:create','admin_user:update',
  ]},
  { name: 'OPS', description: 'Orders and inventory', permissions: ['product:read','inventory:read','inventory:update','order:read','order:update_status'] },
  { name: 'SUPPORT', description: 'Customer support', permissions: ['order:read','order:update_status','loyalty:read'] },
  { name: 'MARKETING', description: 'Promotions and content', permissions: ['product:read','promo:read','promo:create','promo:update'] },
];

// ============================================
// CATALOG DATA: 9 Categories, 100+ Products
// ============================================

interface ProductSeed {
  name: string;
  formFactor: string | null;
  description: string;
  price50g: number;
  price100g: number;
}

const catalogData: { category: string; slug: string; sortOrder: number; products: ProductSeed[] }[] = [
  {
    category: 'Fruits', slug: 'fruits', sortOrder: 1,
    products: [
      { name: 'Apple (Slice)', formFactor: 'Slice', description: 'Freeze-dried apple slices with a satisfying crunch and natural sweetness.', price50g: 10.90, price100g: 19.90 },
      { name: 'Banana (Slice)', formFactor: 'Slice', description: 'Freeze-dried banana slices — naturally sweet and perfectly crispy.', price50g: 9.90, price100g: 17.90 },
      { name: 'Strawberry (Slice)', formFactor: 'Slice', description: 'Freeze-dried strawberry slices bursting with intense berry flavor.', price50g: 12.90, price100g: 22.90 },
      { name: 'Mango (Cube)', formFactor: 'Cube', description: 'Freeze-dried mango cubes — sweet, tangy, and tropical.', price50g: 14.90, price100g: 26.90 },
      { name: 'Custard Apple (Cube)', formFactor: 'Cube', description: 'Freeze-dried custard apple cubes with a creamy, sweet flavor.', price50g: 15.90, price100g: 28.90 },
      { name: 'Jamun (Slice)', formFactor: 'Slice', description: 'Freeze-dried jamun slices — tart and rich in antioxidants.', price50g: 13.90, price100g: 24.90 },
      { name: 'Chikoo (Sapota) (Slice)', formFactor: 'Slice', description: 'Freeze-dried chikoo slices with a caramel-like sweetness.', price50g: 12.90, price100g: 22.90 },
      { name: 'Pink/White Guava (Cube)', formFactor: 'Cube', description: 'Freeze-dried guava cubes — fragrant and vitamin C rich.', price50g: 11.90, price100g: 20.90 },
      { name: 'Pomegranate (Kernels)', formFactor: 'Kernels', description: 'Freeze-dried pomegranate kernels — crunchy and packed with antioxidants.', price50g: 16.90, price100g: 30.90 },
      { name: 'Blueberry (Whole)', formFactor: 'Whole', description: 'Freeze-dried whole blueberries — tiny bursts of superfood goodness.', price50g: 18.90, price100g: 34.90 },
      { name: 'Jackfruit (Slice)', formFactor: 'Slice', description: 'Freeze-dried jackfruit slices with a unique tropical sweetness.', price50g: 13.90, price100g: 24.90 },
      { name: 'Pineapple (Slice)', formFactor: 'Slice', description: 'Freeze-dried pineapple slices — tangy, sweet, and refreshing.', price50g: 12.90, price100g: 22.90 },
      { name: 'Kiwi (Slice)', formFactor: 'Slice', description: 'Freeze-dried kiwi slices — tart and loaded with vitamin C.', price50g: 14.90, price100g: 26.90 },
      { name: 'Papaya (Cube)', formFactor: 'Cube', description: 'Freeze-dried papaya cubes — soft, sweet, and tropical.', price50g: 11.90, price100g: 20.90 },
      { name: 'Black Jamun (Cube)', formFactor: 'Cube', description: 'Freeze-dried black jamun cubes — deeply flavored and nutrient-rich.', price50g: 14.90, price100g: 26.90 },
      { name: 'Orange (Flakes)', formFactor: 'Flakes', description: 'Freeze-dried orange flakes — zesty citrus flavor in every bite.', price50g: 12.90, price100g: 22.90 },
      { name: 'Raspberry (Whole)', formFactor: 'Whole', description: 'Freeze-dried whole raspberries — delicate, tart, and aromatic.', price50g: 18.90, price100g: 34.90 },
      { name: 'Mixed Fruit Pack', formFactor: null, description: 'An assortment of our best freeze-dried fruits in one convenient pack.', price50g: 16.90, price100g: 29.90 },
    ],
  },
  {
    category: 'Vegetables', slug: 'vegetables', sortOrder: 2,
    products: [
      { name: 'Carrots (Cube/Pieces)', formFactor: 'Cube', description: 'Freeze-dried carrot cubes — sweet, crunchy, and versatile.', price50g: 8.90, price100g: 15.90 },
      { name: 'Peas (Whole)', formFactor: 'Whole', description: 'Freeze-dried whole peas — naturally sweet and great for soups.', price50g: 7.90, price100g: 13.90 },
      { name: 'Broccoli', formFactor: null, description: 'Freeze-dried broccoli florets — nutrient-dense and easy to rehydrate.', price50g: 9.90, price100g: 17.90 },
      { name: 'Corn (Whole)', formFactor: 'Whole', description: 'Freeze-dried sweet corn kernels — naturally sweet and crunchy.', price50g: 8.90, price100g: 15.90 },
      { name: 'Ginger (Flakes)', formFactor: 'Flakes', description: 'Freeze-dried ginger flakes — aromatic and perfect for teas and cooking.', price50g: 10.90, price100g: 19.90 },
      { name: 'French Bean (Flakes/Shredded)', formFactor: 'Flakes', description: 'Freeze-dried french bean flakes — light and nutritious.', price50g: 8.90, price100g: 15.90 },
      { name: 'Green Bell Pepper (Flakes)', formFactor: 'Flakes', description: 'Freeze-dried green bell pepper flakes — vibrant and flavorful.', price50g: 9.90, price100g: 17.90 },
      { name: 'Potato (Cube/Pieces)', formFactor: 'Cube', description: 'Freeze-dried potato cubes — quick to rehydrate for any meal.', price50g: 7.90, price100g: 13.90 },
      { name: 'Red Bell Pepper (Flakes)', formFactor: 'Flakes', description: 'Freeze-dried red bell pepper flakes — sweet and colorful.', price50g: 9.90, price100g: 17.90 },
      { name: 'Cabbage (Flakes)', formFactor: 'Flakes', description: 'Freeze-dried cabbage flakes — mild and versatile for soups and stir-fries.', price50g: 7.90, price100g: 13.90 },
      { name: 'Amla (Gooseberry) (Flakes/Peel)', formFactor: 'Flakes', description: 'Freeze-dried amla flakes — one of the richest sources of vitamin C.', price50g: 11.90, price100g: 20.90 },
      { name: 'Bitter Gourd (Slice)', formFactor: 'Slice', description: 'Freeze-dried bitter gourd slices — a superfood for health-conscious eaters.', price50g: 9.90, price100g: 17.90 },
      { name: 'Zucchini (Slice)', formFactor: 'Slice', description: 'Freeze-dried zucchini slices — light, mild, and nutrient-packed.', price50g: 9.90, price100g: 17.90 },
      { name: 'Mixed Vegetable Pack', formFactor: null, description: 'A mix of our best freeze-dried vegetables for easy meal prep.', price50g: 10.90, price100g: 19.90 },
    ],
  },
  {
    category: 'Herbs', slug: 'herbs', sortOrder: 3,
    products: [
      { name: 'Tulsi (Whole)', formFactor: 'Whole', description: 'Freeze-dried whole tulsi leaves — sacred basil for teas and wellness.', price50g: 12.90, price100g: 22.90 },
      { name: 'Tulsi (Flakes)', formFactor: 'Flakes', description: 'Freeze-dried tulsi flakes — easy to sprinkle into drinks and dishes.', price50g: 11.90, price100g: 20.90 },
      { name: 'Basil (Whole)', formFactor: 'Whole', description: 'Freeze-dried whole basil leaves — aromatic Italian herb at its finest.', price50g: 12.90, price100g: 22.90 },
      { name: 'Basil (Flakes)', formFactor: 'Flakes', description: 'Freeze-dried basil flakes — convenient and intensely flavorful.', price50g: 11.90, price100g: 20.90 },
      { name: 'Parsley (Whole)', formFactor: 'Whole', description: 'Freeze-dried whole parsley — fresh flavor preserved perfectly.', price50g: 11.90, price100g: 20.90 },
      { name: 'Parsley (Flakes)', formFactor: 'Flakes', description: 'Freeze-dried parsley flakes — a kitchen essential.', price50g: 10.90, price100g: 19.90 },
      { name: 'Oregano (Whole)', formFactor: 'Whole', description: 'Freeze-dried whole oregano — bold Mediterranean flavor.', price50g: 12.90, price100g: 22.90 },
      { name: 'Oregano (Shredded)', formFactor: 'Shredded', description: 'Freeze-dried shredded oregano — ready to use in any recipe.', price50g: 11.90, price100g: 20.90 },
      { name: 'Mint (Flakes)', formFactor: 'Flakes', description: 'Freeze-dried mint flakes — cool, refreshing, and versatile.', price50g: 10.90, price100g: 19.90 },
      { name: 'Rose Petal (Flakes)', formFactor: 'Flakes', description: 'Freeze-dried rose petal flakes — fragrant and beautiful for garnishing.', price50g: 14.90, price100g: 26.90 },
    ],
  },
  {
    category: 'Food Powders', slug: 'food-powders', sortOrder: 4,
    products: [
      { name: 'Strawberry Powder', formFactor: 'Powder', description: 'Freeze-dried strawberry powder — perfect for smoothies and baking.', price50g: 13.90, price100g: 24.90 },
      { name: 'Banana Powder', formFactor: 'Powder', description: 'Freeze-dried banana powder — natural sweetener for shakes.', price50g: 10.90, price100g: 19.90 },
      { name: 'Custard Apple Powder', formFactor: 'Powder', description: 'Freeze-dried custard apple powder — creamy and unique.', price50g: 15.90, price100g: 28.90 },
      { name: 'Jamun Powder', formFactor: 'Powder', description: 'Freeze-dried jamun powder — rich in iron and antioxidants.', price50g: 13.90, price100g: 24.90 },
      { name: 'Mango Powder', formFactor: 'Powder', description: 'Freeze-dried mango powder — tropical flavor for any recipe.', price50g: 14.90, price100g: 26.90 },
      { name: 'Chikoo Powder', formFactor: 'Powder', description: 'Freeze-dried chikoo powder — naturally sweet and smooth.', price50g: 12.90, price100g: 22.90 },
      { name: 'Pink/White Guava Powder', formFactor: 'Powder', description: 'Freeze-dried guava powder — vitamin C powerhouse.', price50g: 12.90, price100g: 22.90 },
      { name: 'Pomegranate Powder', formFactor: 'Powder', description: 'Freeze-dried pomegranate powder — antioxidant-rich superfood.', price50g: 16.90, price100g: 30.90 },
      { name: 'Blueberry Powder', formFactor: 'Powder', description: 'Freeze-dried blueberry powder — brain-boosting superfood.', price50g: 18.90, price100g: 34.90 },
      { name: 'Jackfruit Powder', formFactor: 'Powder', description: 'Freeze-dried jackfruit powder — unique tropical flavor.', price50g: 13.90, price100g: 24.90 },
      { name: 'Pineapple Powder', formFactor: 'Powder', description: 'Freeze-dried pineapple powder — tangy and refreshing.', price50g: 12.90, price100g: 22.90 },
      { name: 'Spinach Powder', formFactor: 'Powder', description: 'Freeze-dried spinach powder — iron-rich green superfood.', price50g: 10.90, price100g: 19.90 },
      { name: 'Ginger Powder', formFactor: 'Powder', description: 'Freeze-dried ginger powder — warming and anti-inflammatory.', price50g: 11.90, price100g: 20.90 },
      { name: 'Beetroot Powder', formFactor: 'Powder', description: 'Freeze-dried beetroot powder — vibrant color and earthy flavor.', price50g: 10.90, price100g: 19.90 },
      { name: 'Amla Powder', formFactor: 'Powder', description: 'Freeze-dried amla powder — immunity-boosting vitamin C.', price50g: 11.90, price100g: 20.90 },
      { name: 'Green Peas Powder', formFactor: 'Powder', description: 'Freeze-dried green peas powder — plant protein boost.', price50g: 9.90, price100g: 17.90 },
      { name: 'Mint Powder', formFactor: 'Powder', description: 'Freeze-dried mint powder — refreshing and digestive.', price50g: 10.90, price100g: 19.90 },
      { name: 'Carrot Powder', formFactor: 'Powder', description: 'Freeze-dried carrot powder — beta-carotene rich.', price50g: 9.90, price100g: 17.90 },
      { name: 'Leek Powder', formFactor: 'Powder', description: 'Freeze-dried leek powder — mild onion flavor for soups.', price50g: 10.90, price100g: 19.90 },
      { name: 'Sweet Corn Powder', formFactor: 'Powder', description: 'Freeze-dried sweet corn powder — naturally sweet and versatile.', price50g: 9.90, price100g: 17.90 },
      { name: 'Celery Powder', formFactor: 'Powder', description: 'Freeze-dried celery powder — savory and aromatic.', price50g: 10.90, price100g: 19.90 },
      { name: 'Coriander Powder', formFactor: 'Powder', description: 'Freeze-dried coriander powder — fresh herb flavor preserved.', price50g: 10.90, price100g: 19.90 },
      { name: 'Rose Petal Powder', formFactor: 'Powder', description: 'Freeze-dried rose petal powder — floral and luxurious.', price50g: 14.90, price100g: 26.90 },
      { name: 'Kale Powder', formFactor: 'Powder', description: 'Freeze-dried kale powder — the ultimate green superfood.', price50g: 12.90, price100g: 22.90 },
      { name: 'Mixed Fruit Powder', formFactor: 'Powder', description: 'Blend of freeze-dried fruit powders for smoothies.', price50g: 14.90, price100g: 26.90 },
      { name: 'Mixed Vegetable Powder', formFactor: 'Powder', description: 'Blend of freeze-dried veggie powders for nutrition.', price50g: 11.90, price100g: 20.90 },
      { name: 'Superfood Powder Blend', formFactor: 'Powder', description: 'Beetroot, kale, and amla blend — ultimate nutrition boost.', price50g: 16.90, price100g: 30.90 },
    ],
  },
  {
    category: 'Meals Ready to Eat (MRE)', slug: 'meals-ready-to-eat', sortOrder: 5,
    products: [
      { name: 'Pasta Dishes', formFactor: null, description: 'Freeze-dried pasta meals — just add hot water for a complete meal.', price50g: 18.90, price100g: 34.90 },
      { name: 'Rice Meals', formFactor: null, description: 'Freeze-dried rice meals — convenient and satisfying.', price50g: 16.90, price100g: 30.90 },
      { name: 'Soups', formFactor: null, description: 'Freeze-dried soup mixes — warm, nourishing, and ready in minutes.', price50g: 12.90, price100g: 22.90 },
      { name: 'Breakfast Options', formFactor: null, description: 'Freeze-dried breakfast meals — start your day right anywhere.', price50g: 14.90, price100g: 26.90 },
      { name: 'Vegetarian Entrees', formFactor: null, description: 'Freeze-dried vegetarian meals — plant-based and delicious.', price50g: 16.90, price100g: 30.90 },
      { name: 'Non-Vegetarian Entrees', formFactor: null, description: 'Freeze-dried meat-based meals — protein-packed and hearty.', price50g: 19.90, price100g: 36.90 },
    ],
  },
  {
    category: 'Snacks', slug: 'snacks', sortOrder: 6,
    products: [
      { name: 'Chips', formFactor: null, description: 'Freeze-dried potato and veggie chips — light and addictively crunchy.', price50g: 8.90, price100g: 15.90 },
      { name: 'Ice Cream', formFactor: null, description: 'Freeze-dried ice cream bites — a crunchy twist on a classic treat.', price50g: 14.90, price100g: 26.90 },
      { name: 'Candies', formFactor: null, description: 'Freeze-dried fruit-flavored candies — intensely flavorful and fun.', price50g: 9.90, price100g: 17.90 },
      { name: 'Biscuits', formFactor: null, description: 'Freeze-dried cookies and crackers — crispy and shelf-stable.', price50g: 10.90, price100g: 19.90 },
      { name: 'Yogurt Drops', formFactor: null, description: 'Freeze-dried yogurt snacks — tangy, creamy, and probiotic-rich.', price50g: 12.90, price100g: 22.90 },
    ],
  },
  {
    category: 'Variety Buckets', slug: 'variety-buckets', sortOrder: 7,
    products: [
      { name: 'Fruit Variety Bucket', formFactor: null, description: '5 types of freeze-dried fruits in one convenient bucket.', price50g: 39.90, price100g: 69.90 },
      { name: 'Vegetable Variety Bucket', formFactor: null, description: '5 types of freeze-dried vegetables in one bucket.', price50g: 34.90, price100g: 59.90 },
      { name: 'Powder Assortment Bucket', formFactor: null, description: 'Multiple fruit, veggie, and herb powders in one bucket.', price50g: 44.90, price100g: 79.90 },
      { name: 'Snack Mix Bucket', formFactor: null, description: 'Mix of chips, candies, biscuits, and more.', price50g: 36.90, price100g: 64.90 },
      { name: 'Meal Sampler Bucket', formFactor: null, description: 'Assortment of MRE entrees for emergency or adventure.', price50g: 49.90, price100g: 89.90 },
    ],
  },
  {
    category: 'Meats', slug: 'meats', sortOrder: 8,
    products: [
      { name: 'Chicken', formFactor: null, description: 'Freeze-dried chicken strips or cubes — high protein, ready to rehydrate.', price50g: 22.90, price100g: 42.90 },
      { name: 'Mutton', formFactor: null, description: 'Freeze-dried mutton pieces — rich flavor preserved perfectly.', price50g: 26.90, price100g: 49.90 },
      { name: 'Turkey', formFactor: null, description: 'Freeze-dried turkey slices — lean protein for any meal.', price50g: 24.90, price100g: 45.90 },
      { name: 'Egg', formFactor: null, description: 'Freeze-dried eggs — scramble or use in baking, just add water.', price50g: 18.90, price100g: 34.90 },
      { name: 'Seafood (Shrimp)', formFactor: null, description: 'Freeze-dried shrimp — lightweight and flavor-packed.', price50g: 28.90, price100g: 52.90 },
    ],
  },
  {
    category: 'Baby Food', slug: 'baby-food', sortOrder: 9,
    products: [
      { name: 'Pureed Fruits', formFactor: null, description: 'Freeze-dried fruit purees for infants — gentle and nutritious.', price50g: 14.90, price100g: 26.90 },
      { name: 'Vegetable Blends', formFactor: null, description: 'Freeze-dried veggie mixes for babies — smooth and wholesome.', price50g: 13.90, price100g: 24.90 },
      { name: 'Meat Purees', formFactor: null, description: 'Freeze-dried meat-based baby meals — protein for growing babies.', price50g: 16.90, price100g: 30.90 },
      { name: 'Yogurt Bites', formFactor: null, description: 'Freeze-dried yogurt for toddlers — melts in the mouth.', price50g: 12.90, price100g: 22.90 },
      { name: 'Cereal Powders', formFactor: null, description: 'Freeze-dried baby cereals — easy to prepare and nutrient-rich.', price50g: 11.90, price100g: 20.90 },
    ],
  },
];

// ============================================
// Helper: slug from product name
// ============================================
function toSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[()\/]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

// Map product slugs to professional pack images in /products/packs/
const slugImageMap: Record<string, string> = {
  'apple-slice': 'packs/apple-pack.png',
  'banana-slice': 'packs/banana-pack.png',
  'strawberry-slice': 'packs/strawberry-pack.png',
  'mango-cube': 'packs/mango-pack.png',
  'custard-apple-cube': 'packs/custard-pack.png',
  'jamun-slice': 'packs/jamun-pack.png',
  'chikoo-sapota-slice': 'packs/chikoo-pack.png',
  'pinkwhite-guava-cube': 'packs/guava-pack.png',
  'blueberry-whole': 'packs/blueberry-pack.png',
  'jackfruit-slice': 'packs/jackfruit-pack.png',
  'pineapple-slice': 'packs/pineapple-pack.png',
  'kiwi-slice': 'packs/kiwi-pack.png',
  'papaya-cube': 'packs/papaya-pack.png',
  'raspberry-whole': 'packs/raspberry-pack.png',
  'mixed-fruit-pack': 'packs/strawberry-pack.png',
  'carrots-cubepieces': 'packs/carrot-pack.png',
  'peas-whole': 'packs/peas-pack.png',
  'corn-whole': 'packs/corn-pack.png',
  'potato-cubepieces': 'packs/potato-pack.png',
  'amla-gooseberry-flakespeel': 'packs/amla-pack.png',
  'bitter-gourd-slice': 'packs/bitter-gourd-pack.png',
  'zucchini-slice': 'packs/zucchini-pack.png',
  'green-bell-pepper-flakes': 'packs/green-bell-pepper-pack.png',
  'red-bell-pepper-flakes': 'packs/red-bell-pepper-pack.png',
  'ginger-flakes': 'packs/ginger-pack.png',
  'mixed-vegetable-pack': 'packs/carrot-pack.png',
  // Variety Buckets - Display packs
  'fruit-variety-bucket': 'packs/strawberry-pack.png',
  'vegetable-variety-bucket': 'packs/carrot-pack.png',
  'powder-assortment-bucket': 'packs/mango-pack.png',
  'snack-mix-bucket': 'packs/apple-pack.png',
  'meal-sampler-bucket': 'packs/corn-pack.png',
  // Mixed Powders - Display packs
  'mixed-fruit-powder': 'packs/raspberry-pack.png',
  'mixed-vegetable-powder': 'packs/peas-pack.png',
  'superfood-powder-blend': 'packs/kiwi-pack.png',
};

function toSku(catSlug: string, index: number, size: string): string {
  const prefix = catSlug.substring(0, 3).toUpperCase();
  return `${prefix}-${String(index + 1).padStart(3, '0')}-${size}`;
}

// ============================================
// Main seed function
// ============================================
async function main() {
  console.log('🌱 Starting seed...\n');

  // --- RBAC ---
  const createdPermissions = await Promise.all(
    permissions.map(p =>
      prisma.permission.upsert({
        where: { resource_action: { resource: p.resource, action: p.action } },
        update: {},
        create: p,
      })
    )
  );
  console.log(`✅ ${createdPermissions.length} permissions`);

  for (const roleData of roles) {
    const role = await prisma.role.upsert({
      where: { name: roleData.name },
      update: {},
      create: { name: roleData.name, description: roleData.description, isSystem: true },
    });
    for (const permString of roleData.permissions) {
      const [resource, action] = permString.split(':');
      const perm = createdPermissions.find(p => p.resource === resource && p.action === action);
      if (perm) {
        await prisma.rolePermission.upsert({
          where: { roleId_permissionId: { roleId: role.id, permissionId: perm.id } },
          update: {},
          create: { roleId: role.id, permissionId: perm.id },
        });
      }
    }
  }
  console.log(`✅ ${roles.length} roles`);

  // Admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const ownerRole = await prisma.role.findUnique({ where: { name: 'OWNER' } });
  if (ownerRole) {
    await prisma.adminUser.upsert({
      where: { email: 'admin@neutrofreeze.com' },
      update: {},
      create: {
        email: 'admin@neutrofreeze.com',
        hashedPassword,
        firstName: 'Admin',
        lastName: 'User',
        roles: { create: { roleId: ownerRole.id } },
      },
    });
    console.log('✅ Admin user (admin@neutrofreeze.com / admin123)');
  }

  // --- CATALOG ---
  let totalProducts = 0;

  for (const cat of catalogData) {
    const category = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.category, sortOrder: cat.sortOrder },
      create: { name: cat.category, slug: cat.slug, sortOrder: cat.sortOrder },
    });

    for (let i = 0; i < cat.products.length; i++) {
      const p = cat.products[i];
      const slug = toSlug(p.name);

      const imageFile = slugImageMap[slug];
      const imageUrl = imageFile ? `/products/${imageFile}` : null;

      const product = await prisma.product.upsert({
        where: { slug },
        update: { title: p.name, description: p.description, formFactor: p.formFactor, categoryId: category.id },
        create: {
          slug,
          title: p.name,
          description: p.description,
          formFactor: p.formFactor,
          categoryId: category.id,
          status: 'ACTIVE',
          ...(imageUrl ? {
            images: {
              create: {
                url: imageUrl,
                alt: p.name,
                sortOrder: 0,
              },
            },
          } : {}),
        },
      });

      // Upsert image for existing products too
      if (imageUrl) {
        const existingImage = await prisma.productImage.findFirst({
          where: { productId: product.id },
        });
        if (existingImage) {
          await prisma.productImage.update({
            where: { id: existingImage.id },
            data: { url: imageUrl, alt: p.name },
          });
        } else {
          await prisma.productImage.create({
            data: { productId: product.id, url: imageUrl, alt: p.name, sortOrder: 0 },
          });
        }
      }

      // Create variants (50g + 100g)
      const sku50 = toSku(cat.slug, i, '50');
      const sku100 = toSku(cat.slug, i, '100');

      await prisma.variant.upsert({
        where: { sku: sku50 },
        update: { price: p.price50g },
        create: {
          productId: product.id,
          sku: sku50,
          title: '50g',
          price: p.price50g,
          weightGrams: 50,
          inventory: { create: { onHand: 100 } },
        },
      });

      await prisma.variant.upsert({
        where: { sku: sku100 },
        update: { price: p.price100g },
        create: {
          productId: product.id,
          sku: sku100,
          title: '100g',
          price: p.price100g,
          weightGrams: 100,
          inventory: { create: { onHand: 50 } },
        },
      });

      totalProducts++;
    }

    console.log(`  📦 ${cat.category}: ${cat.products.length} products`);
  }

  console.log(`\n✅ ${catalogData.length} categories, ${totalProducts} products total`);

  // --- PROMO ---
  await prisma.promotion.upsert({
    where: { code: 'WELCOME10' },
    update: {},
    create: {
      code: 'WELCOME10',
      type: 'PERCENT',
      value: 10,
      minSpend: 0,
      startAt: new Date(),
      endAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      isActive: true,
    },
  });
  console.log('✅ Promotion: WELCOME10 (10% off)');

  console.log('\n🎉 Seed completed successfully!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
