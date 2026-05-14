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
  {
    name: 'ADMIN', description: 'Can manage most things except critical security', permissions: [
      'product:read', 'product:create', 'product:update', 'product:delete', 'inventory:read', 'inventory:update',
      'order:read', 'order:update_status', 'order:cancel', 'order:refund',
      'promo:read', 'promo:create', 'promo:update', 'promo:delete', 'loyalty:read', 'loyalty:adjust',
      'admin_user:read', 'admin_user:create', 'admin_user:update',
    ]
  },
  { name: 'OPS', description: 'Orders and inventory', permissions: ['product:read', 'inventory:read', 'inventory:update', 'order:read', 'order:update_status'] },
  { name: 'SUPPORT', description: 'Customer support', permissions: ['order:read', 'order:update_status', 'loyalty:read'] },
  { name: 'MARKETING', description: 'Promotions and content', permissions: ['product:read', 'promo:read', 'promo:create', 'promo:update'] },
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
      { name: 'Banana (Slice)', formFactor: 'Slice', description: 'Freeze-dried banana slices, naturally sweet and perfectly crispy.', price50g: 9.90, price100g: 17.90 },
      { name: 'Strawberry (Slice)', formFactor: 'Slice', description: 'Freeze-dried strawberry slices bursting with intense berry flavor.', price50g: 12.90, price100g: 22.90 },
      { name: 'Mango (Cube)', formFactor: 'Cube', description: 'Freeze-dried mango cubes, sweet, tangy, and tropical.', price50g: 14.90, price100g: 26.90 },
      { name: 'Custard Apple (Cube)', formFactor: 'Cube', description: 'Freeze-dried custard apple cubes with a creamy, sweet flavor.', price50g: 15.90, price100g: 28.90 },
      { name: 'Jamun (Slice)', formFactor: 'Slice', description: 'Freeze-dried jamun slices, tart and rich in antioxidants.', price50g: 13.90, price100g: 24.90 },
      { name: 'Chikoo (Sapota) (Slice)', formFactor: 'Slice', description: 'Freeze-dried chikoo slices with a caramel-like sweetness.', price50g: 12.90, price100g: 22.90 },
      { name: 'Pink/White Guava (Cube)', formFactor: 'Cube', description: 'Freeze-dried guava cubes, fragrant and vitamin C rich.', price50g: 11.90, price100g: 20.90 },
      { name: 'Blueberry (Whole)', formFactor: 'Whole', description: 'Freeze-dried whole blueberries, tiny bursts of superfood goodness.', price50g: 18.90, price100g: 34.90 },
      { name: 'Jackfruit (Slice)', formFactor: 'Slice', description: 'Freeze-dried jackfruit slices with a unique tropical sweetness.', price50g: 13.90, price100g: 24.90 },
      { name: 'Pineapple (Slice)', formFactor: 'Slice', description: 'Freeze-dried pineapple slices, tangy, sweet, and refreshing.', price50g: 12.90, price100g: 22.90 },
      { name: 'Kiwi (Slice)', formFactor: 'Slice', description: 'Freeze-dried kiwi slices, tart and loaded with vitamin C.', price50g: 14.90, price100g: 26.90 },
      { name: 'Papaya (Cube)', formFactor: 'Cube', description: 'Freeze-dried papaya cubes, soft, sweet, and tropical.', price50g: 11.90, price100g: 20.90 },
      { name: 'Raspberry (Whole)', formFactor: 'Whole', description: 'Freeze-dried whole raspberries, delicate, tart, and aromatic.', price50g: 18.90, price100g: 34.90 },
    ],
  },
  {
    category: 'Vegetables', slug: 'vegetables', sortOrder: 2,
    products: [
      { name: 'Carrots (Cube/Pieces)', formFactor: 'Cube', description: 'Freeze-dried carrot cubes, sweet, crunchy, and versatile.', price50g: 8.90, price100g: 15.90 },
      { name: 'Peas (Whole)', formFactor: 'Whole', description: 'Freeze-dried whole peas, naturally sweet and great for soups.', price50g: 7.90, price100g: 13.90 },
      { name: 'Corn (Whole)', formFactor: 'Whole', description: 'Freeze-dried sweet corn kernels, naturally sweet and crunchy.', price50g: 8.90, price100g: 15.90 },
      { name: 'Green Bell Pepper (Flakes)', formFactor: 'Flakes', description: 'Freeze-dried green bell pepper flakes, vibrant and flavorful.', price50g: 9.90, price100g: 17.90 },
      { name: 'Potato (Cube/Pieces)', formFactor: 'Cube', description: 'Freeze-dried potato cubes, quick to rehydrate for any meal.', price50g: 7.90, price100g: 13.90 },
      { name: 'Red Bell Pepper (Flakes)', formFactor: 'Flakes', description: 'Freeze-dried red bell pepper flakes, sweet and colorful.', price50g: 9.90, price100g: 17.90 },
      { name: 'Amla (Gooseberry) (Slice)', formFactor: 'Slice', description: 'Freeze-dried amla slices, one of the richest sources of vitamin C.', price50g: 11.90, price100g: 20.90 },
      { name: 'Bitter Gourd (Slice)', formFactor: 'Slice', description: 'Freeze-dried bitter gourd slices, a superfood for health-conscious eaters.', price50g: 9.90, price100g: 17.90 },
      { name: 'Zucchini (Slice)', formFactor: 'Slice', description: 'Freeze-dried zucchini slices, light, mild, and nutrient-packed.', price50g: 9.90, price100g: 17.90 },
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
  // Wipe all catalog data so stale products/categories don't linger
  await prisma.productImage.deleteMany({});
  await prisma.inventory.deleteMany({});
  await prisma.variant.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});
  console.log('🗑️  Cleared old catalog data');

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
