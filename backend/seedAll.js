/**
 * seedAll.js
 * ---------------------------------------------------------------------------
 * ONE-FILE seed script for this project (ProVet Elite / PetStore — a
 * veterinary pharmacy & pet-wellness e-commerce store, Pakistan-focused,
 * JazzCash/EasyPaisa payments).
 *
 * Connects directly to the MongoDB instance defined by process.env.MONGO_URI
 * (same variable server.js uses) so pointing it at your deployed connection
 * string seeds the live database directly — no redeploy needed.
 *
 * It seeds:
 *   - User          (a demo admin + a demo regular user — ALWAYS
 *                     created/updated, even if accounts with those emails
 *                     already exist, so login credentials for testers
 *                     always work)
 *   - Category       (skipped if categories already exist, unless RESET=true)
 *   - Product        (several vet products per category, same skip rule)
 *   - PaymentMethod  (JazzCash + EasyPaisa demo accounts, same skip rule)
 *   - About          (site "About" content — always upserted, single doc)
 *   - Order          (a couple of demo orders for the demo user, so Track
 *                      Orders / Admin Orders tab aren't empty — same skip rule)
 *
 * USAGE
 * ---------------------------------------------------------------------------
 *   cd backend
 *   node seedAll.js
 *
 *   # or against a specific deployed DB without touching .env:
 *   MONGO_URI="mongodb+srv://user:pass@cluster.mongodb.net/dbname" node seedAll.js
 *
 *   # wipe catalog/orders/payment-methods & reseed even if data already exists:
 *   RESET=true node seedAll.js
 *
 * NOTE: the demo admin/user accounts are always (re)created with a known
 * password and isVerified:true on every run — that's intentional, so
 * testers can always log in, even if a same-email account already existed.
 * ---------------------------------------------------------------------------
 */

require('dotenv').config();

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

if (!process.env.MONGO_URI) {
  console.log('🚫 No MONGO_URI found in env (.env or shell env).');
  console.log('   Set MONGO_URI="<your mongodb connection string>" and re-run.');
  process.exit(1);
}

mongoose.connect(process.env.MONGO_URI);

const RESET = String(process.env.RESET || '').toLowerCase() === 'true';

const DEMO_ADMIN = { email: 'admin@demo.com', password: 'AdminDemo123!', role: 'admin' };
const DEMO_USER = { email: 'user@demo.com', password: 'UserDemo123!', role: 'user' };

// ---------------------------------------------------------------------------
// Sample catalog data — matches this site's actual domain: "ProVet Elite" /
// "PetStore", a veterinary pharmacy & pet-wellness store. Prices in PKR (Rs.)
// to match the frontend's `Rs.{price}` display.
// ---------------------------------------------------------------------------
const catalog = {
  'Prescription Diets': [
    { name: "Hill's Prescription Diet i/d Digestive Care (Dog)", price: 8500, quantity: 45, description: 'Vet-recommended prescription diet formulated to support dogs recovering from digestive upset.' },
    { name: 'Royal Canin Renal Support (Cat)', price: 7900, quantity: 30, description: 'Prescription diet designed to support kidney function in adult cats with renal conditions.' },
    { name: 'Purina Pro Plan Veterinary Diets EN Gastroenteric', price: 8200, quantity: 38, description: 'Highly digestible prescription formula for dogs with sensitive stomachs, vet-approved.' },
    { name: "Hill's Prescription Diet Metabolic Weight Management", price: 7600, quantity: 25, description: 'Clinically proven weight-management formula for overweight dogs, recommended by veterinarians.' },
  ],
  'Supplements & Wellness': [
    { name: 'Omega-3 Fish Oil Chews for Dogs', price: 3200, quantity: 150, description: 'Supports healthy skin, coat, and heart function with EPA and DHA fatty acids.' },
    { name: 'Multivitamin Daily Wellness Chews (Dog)', price: 2800, quantity: 140, description: 'Daily multivitamin supplement supporting immune health, energy, and overall wellness.' },
    { name: 'Probiotic & Prebiotic Powder for Cats', price: 3400, quantity: 90, description: 'Vet-formulated probiotic blend to support gut flora balance and immune health.' },
    { name: 'Calming Chews for Anxious Dogs', price: 2950, quantity: 100, description: 'Non-drowsy calming supplement with chamomile and L-theanine for stress-prone dogs.' },
  ],
  'Pharmacy & Medications': [
    { name: 'Flea & Tick Prevention Topical (Dog, 3-month supply)', price: 5600, quantity: 70, description: 'Fast-acting monthly topical treatment protecting against fleas, ticks, and mosquitoes.' },
    { name: 'Heartworm Prevention Chewables (Dog)', price: 6200, quantity: 60, description: 'Monthly chewable tablet for prevention of heartworm disease, prescribed by veterinarians.' },
    { name: 'Antihistamine Allergy Relief Tablets (Cat & Dog)', price: 2100, quantity: 85, description: 'Vet-approved allergy relief for seasonal itching and mild allergic reactions.' },
    { name: 'Ear Infection Treatment Drops', price: 1950, quantity: 55, description: 'Medicated ear drops for treating and preventing common ear infections in pets.' },
  ],
  'Joint Care': [
    { name: 'Glucosamine & Chondroitin Joint Support Chews', price: 3600, quantity: 110, description: 'Advanced joint supplement supporting cartilage health and mobility in senior dogs.' },
    { name: 'Hip & Joint Mobility Formula (Large Breed)', price: 4200, quantity: 75, description: 'High-strength joint formula designed for large and giant breed dogs prone to hip dysplasia.' },
    { name: 'Turmeric & MSM Joint Support Powder', price: 3100, quantity: 65, description: 'Natural anti-inflammatory joint powder that can be mixed into daily meals.' },
  ],
  'Digestive Health': [
    { name: 'Digestive Enzyme Supplement for Dogs', price: 2700, quantity: 95, description: 'Enzyme blend supporting nutrient absorption and reducing digestive discomfort.' },
    { name: 'Slippery Elm Bark Digestive Aid', price: 2300, quantity: 80, description: 'Soothing digestive supplement for dogs and cats with occasional stomach upset.' },
    { name: 'Fiber-Rich Digestive Support Chews (Cat)', price: 2500, quantity: 70, description: 'Supports healthy digestion and reduces hairball frequency in cats.' },
  ],
  'Oral & Dental Care': [
    { name: 'Enzymatic Dental Chews (Dog)', price: 2050, quantity: 160, description: 'Daily dental chews that reduce plaque and tartar buildup while freshening breath.' },
    { name: 'Vet-Approved Pet Toothpaste & Brush Kit', price: 1700, quantity: 120, description: 'Complete oral hygiene kit formulated specifically for safe use in dogs and cats.' },
    { name: 'Dental Water Additive for Cats', price: 1450, quantity: 100, description: 'Tasteless additive mixed into drinking water to help control plaque and freshen breath.' },
  ],
  'Grooming & Hygiene': [
    { name: 'Medicated Anti-Itch Shampoo for Dogs', price: 2150, quantity: 90, description: 'Soothing oatmeal shampoo formulated for dogs with sensitive or itchy skin.' },
    { name: 'Hypoallergenic Grooming Wipes (Cat & Dog)', price: 1350, quantity: 130, description: 'Gentle, fragrance-free wipes for quick cleanups between baths.' },
    { name: 'Ear Cleaning Solution', price: 1600, quantity: 105, description: 'Vet-recommended ear cleanser that helps prevent wax buildup and odor.' },
  ],
};

const paymentMethodDefs = [
  {
    method: 'JazzCash',
    accountTitle: 'ProVet Elite Pharmacy',
    accountNumber: '0300-1234567',
    qrCodeUrl: 'https://placehold.co/300x300/png?text=JazzCash+QR',
    instructions: 'Send payment to the above JazzCash account and upload your transaction screenshot at checkout.',
  },
  {
    method: 'EasyPaisa',
    accountTitle: 'ProVet Elite Pharmacy',
    accountNumber: '0345-7654321',
    qrCodeUrl: 'https://placehold.co/300x300/png?text=EasyPaisa+QR',
    instructions: 'Send payment to the above EasyPaisa account and upload your transaction screenshot at checkout.',
  },
];

const aboutContent = `ProVet Elite is dedicated to bridging the gap between world-class veterinary medicine and your doorstep.
We supply certified veterinary pharmaceuticals, prescription diets, and premium pet wellness products, sourced with clinical precision and delivered with heartfelt care.

Our Promise:
- Certified Pharmacy accredited by the Board of Veterinary Medicine
- Secure payments with 256-bit SSL encryption
- Temperature-controlled priority shipping for medical products

Every product on our shelves is selected in consultation with licensed veterinarians, ensuring your companion receives nothing less than clinical-grade care.`;

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function placeholderImage(seed) {
  return `https://picsum.photos/seed/${encodeURIComponent(seed)}/400/300`;
}

// ---------------------------------------------------------------------------
async function seedAll() {
  try {
    const User = require('./models/User');
    const Category = require('./models/Category');
    const Product = require('./models/Product');
    const PaymentMethod = require('./models/PaymentMethod');
    const About = require('./models/About');
    const Order = require('./models/Order');

    console.log(`🔌 Connected target: ${process.env.MONGO_URI.replace(/\/\/.*@/, '//***:***@')}`);

    // ---- 1. Demo users (ALWAYS created/updated so login always works) ------
    async function upsertDemoUser({ email, password, role }) {
      const hashedPassword = await bcrypt.hash(password, 10);
      let user = await User.findOne({ email });
      if (user) {
        user.password = hashedPassword;
        user.role = role;
        user.isVerified = true;
        await user.save();
        console.log(`  🔄 Updated existing user: ${email} (role: ${role})`);
      } else {
        user = await new User({ email, password: hashedPassword, role, isVerified: true }).save();
        console.log(`  ✅ Created user: ${email} (role: ${role})`);
      }
      return user;
    }

    console.log('👤 Ensuring demo login accounts exist...');
    const adminUser = await upsertDemoUser(DEMO_ADMIN);
    const regularUser = await upsertDemoUser(DEMO_USER);

    // ---- 2. Reset (optional) --------------------------------------------------
    if (RESET) {
      console.log('🧹 RESET=true — clearing existing catalog, payment methods & orders...');
      await Order.deleteMany({});
      await Product.deleteMany({});
      await Category.deleteMany({});
      await PaymentMethod.deleteMany({});
      console.log('✅ Cleared.');
    }

    // ---- 3. Categories + Products -------------------------------------------
    const existingCategoryCount = await Category.countDocuments();
    let allProducts = [];

    if (existingCategoryCount === 0) {
      console.log('🌱 Seeding categories & products...');
      let categoryCount = 0;
      let productCount = 0;

      for (const [categoryName, products] of Object.entries(catalog)) {
        const category = await new Category({ name: categoryName }).save();
        categoryCount++;

        for (const p of products) {
          const product = await new Product({
            name: p.name,
            quantity: p.quantity,
            description: p.description,
            image: placeholderImage(p.name),
            category: category._id,
            price: p.price,
          }).save();
          allProducts.push(product);
          productCount++;
        }
      }
      console.log(`✅ Created ${categoryCount} categories and ${productCount} products`);
    } else {
      console.log(`⏭️  ${existingCategoryCount} categories already exist — skipping catalog seed`);
      allProducts = await Product.find();
    }

    // ---- 4. Payment methods (JazzCash / EasyPaisa) ---------------------------
    const existingPaymentMethodCount = await PaymentMethod.countDocuments();
    if (existingPaymentMethodCount === 0) {
      for (const pm of paymentMethodDefs) {
        await new PaymentMethod(pm).save();
      }
      console.log(`✅ Created ${paymentMethodDefs.length} payment methods (JazzCash, EasyPaisa)`);
    } else {
      console.log(`⏭️  ${existingPaymentMethodCount} payment methods already exist — skipping`);
    }

    // ---- 5. About content (always upserted — single document) ----------------
    let about = await About.findOne();
    if (about) {
      about.content = aboutContent;
      await about.save();
      console.log('🔄 Updated existing About content');
    } else {
      await new About({ content: aboutContent }).save();
      console.log('✅ Created About content');
    }

    // ---- 6. Demo orders for the demo user -------------------------------------
    const existingOrderCount = await Order.countDocuments();
    if (existingOrderCount === 0 && allProducts.length > 0) {
      const orderStatuses = ['pending', 'confirmed', 'cancelled'];
      const paymentMethods = ['JazzCash', 'EasyPaisa', 'COD'];
      let ordersCreated = 0;

      for (let i = 0; i < 3; i++) {
        const itemCount = randomInt(1, 3);
        const cartItems = [];
        let amount = 0;

        for (let j = 0; j < itemCount; j++) {
          const product = pick(allProducts);
          const qty = randomInt(1, 2);
          cartItems.push({
            productId: product._id,
            name: product.name,
            price: product.price,
            qty,
          });
          amount += product.price * qty;
        }

        await new Order({
          user: regularUser._id,
          customerName: 'Demo User',
          contactNumber: '0300-0000000',
          email: DEMO_USER.email,
          address: '123 Model Town, Lahore, Pakistan',
          cartItems,
          amount,
          paymentMethod: pick(paymentMethods),
          transactionId: `TXN-DEMO-${1000 + i}`,
          status: pick(orderStatuses),
        }).save();
        ordersCreated++;
      }
      console.log(`✅ Created ${ordersCreated} demo orders for ${DEMO_USER.email}`);
    } else if (existingOrderCount > 0) {
      console.log(`⏭️  ${existingOrderCount} orders already exist — skipping demo orders`);
    }

    console.log('\n🎉 Done! Your deployed MongoDB is now populated with demo data.');
    console.log('   Admin login:  admin@demo.com / AdminDemo123!');
    console.log('   User login:   user@demo.com  / UserDemo123!');
    console.log('\n   Tip: run again with RESET=true to wipe and reseed the catalog/orders/payment methods.');
    process.exit(0);
  } catch (e) {
    console.log('\n🚫 Error! The Error info is below');
    console.log(e);
    process.exit(1);
  }
}

seedAll();