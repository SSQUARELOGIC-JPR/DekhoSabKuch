const User = require('../src/models/User');

const baseProviders = [
  // Electrician
  { name: 'Ramesh Electrician', category: 'Electrician', city: 'Jaipur', rating: 4.8, servicesDone: 120 },
  { name: 'Mahesh Electricals', category: 'Electrician', city: 'Jaipur', rating: 4.6, servicesDone: 210 },
  { name: 'Vikram Power Fix', category: 'Electrician', city: 'Jaipur', rating: 4.5, servicesDone: 95 },
  { name: 'Anil Electric Works', category: 'Electrician', city: 'Delhi', rating: 4.7, servicesDone: 180 },
  { name: 'Bright Spark Services', category: 'Electrician', city: 'Jaipur', rating: 4.3, servicesDone: 60 },

  // Plumber
  { name: 'Suresh Plumber', category: 'Plumber', city: 'Jaipur', rating: 4.6, servicesDone: 80 },
  { name: 'WaterFix Experts', category: 'Plumber', city: 'Jaipur', rating: 4.4, servicesDone: 130 },
  { name: 'Raj Plumbing Co.', category: 'Plumber', city: 'Delhi', rating: 4.7, servicesDone: 250 },
  { name: 'PipeCare Services', category: 'Plumber', city: 'Jaipur', rating: 4.2, servicesDone: 45 },
  { name: 'QuickLeak Solutions', category: 'Plumber', city: 'Jaipur', rating: 4.5, servicesDone: 160 },

  // AC Repair
  { name: 'CoolAir AC Repair', category: 'AC Repair', city: 'Jaipur', rating: 4.8, servicesDone: 140 },
  { name: 'ChillFix Experts', category: 'AC Repair', city: 'Jaipur', rating: 4.6, servicesDone: 100 },
  { name: 'AirFlow Services', category: 'AC Repair', city: 'Delhi', rating: 4.3, servicesDone: 70 },
  { name: 'Perfect Cooling Care', category: 'AC Repair', city: 'Jaipur', rating: 4.7, servicesDone: 190 },
  { name: 'Frosty Fixers', category: 'AC Repair', city: 'Jaipur', rating: 4.5, servicesDone: 110 },

  // Carpenter
  { name: 'WoodCraft Carpentry', category: 'Carpenter', city: 'Jaipur', rating: 4.4, servicesDone: 150 },
  { name: 'Royal Furniture Works', category: 'Carpenter', city: 'Jaipur', rating: 4.6, servicesDone: 300 },
  { name: 'FineWood Creations', category: 'Carpenter', city: 'Delhi', rating: 4.2, servicesDone: 90 },
  { name: 'Jaipur Carpenter Hub', category: 'Carpenter', city: 'Jaipur', rating: 4.7, servicesDone: 210 },
  { name: 'Perfect Fit Carpentry', category: 'Carpenter', city: 'Jaipur', rating: 4.3, servicesDone: 120 },

  // Painter
  { name: 'ColorPro Painters', category: 'Painter', city: 'Jaipur', rating: 4.6, servicesDone: 130 },
  { name: 'Royal Paint House', category: 'Painter', city: 'Jaipur', rating: 4.8, servicesDone: 260 },
  { name: 'Fresh Coat Services', category: 'Painter', city: 'Delhi', rating: 4.4, servicesDone: 70 },
  { name: 'WallMagic Painters', category: 'Painter', city: 'Jaipur', rating: 4.5, servicesDone: 180 },
  { name: 'DreamHome Painters', category: 'Painter', city: 'Jaipur', rating: 4.7, servicesDone: 220 },

  // Cleaning
  { name: 'CleanHome Services', category: 'Cleaning', city: 'Jaipur', rating: 4.6, servicesDone: 140 },
  { name: 'Sparkle Cleaning Co.', category: 'Cleaning', city: 'Jaipur', rating: 4.3, servicesDone: 80 },
  { name: 'DeepClean Experts', category: 'Cleaning', city: 'Delhi', rating: 4.7, servicesDone: 210 },
  { name: 'HygienePro Cleaners', category: 'Cleaning', city: 'Jaipur', rating: 4.5, servicesDone: 160 },
  { name: 'DustFree Solutions', category: 'Cleaning', city: 'Jaipur', rating: 4.2, servicesDone: 60 },

  // Beauty
  { name: 'Glam Beauty Studio', category: 'Beauty & Makeup', city: 'Jaipur', rating: 4.8, servicesDone: 220 },
  { name: 'Royal Makeup Artist', category: 'Beauty & Makeup', city: 'Jaipur', rating: 4.7, servicesDone: 300 },
  { name: 'StyleQueen Makeovers', category: 'Beauty & Makeup', city: 'Delhi', rating: 4.5, servicesDone: 150 },
  { name: 'Bridal Glow Studio', category: 'Beauty & Makeup', city: 'Jaipur', rating: 4.6, servicesDone: 240 },
  { name: 'Perfect Look Artists', category: 'Beauty & Makeup', city: 'Jaipur', rating: 4.4, servicesDone: 120 },
];

const imageMap = {
  Electrician: 'providers/profile/ramesh.jpg',
  Plumber: 'providers/profile/suresh.jpg',
  'AC Repair': 'providers/profile/coolair.jpg',
  Carpenter: 'providers/profile/woodcraft.jpg',
  Painter: 'providers/profile/colorpro.jpg',
  Cleaning: 'providers/profile/cleanhome.jpg',
  'Beauty & Makeup': 'providers/profile/glam.jpg',
};

async function seedProviders() {
  await User.deleteMany({
  role: { $in: ['provider', 'both'] },
});

  const finalProviders = baseProviders.map((p, i) => ({
    mobile: `91000000${i + 1}`,
    role: 'provider',
    name: p.name,
    city: p.city,
    state: 'Rajasthan',
    category: p.category,
    experience: Math.floor(Math.random() * 8) + 2,
    about: `${p.category} specialist with quality service`,
    rating: p.rating,
    servicesDone: p.servicesDone,

    profileImage: imageMap[p.category],
    aadharFrontImage: 'providers/aadhar/front.jpg',
    aadharBackImage: 'providers/aadhar/back.jpg',

    profileDone: true,
    paymentDone: true,
    isUserProfileComplete: true,
    isProviderProfileComplete: true,
    isAvailable: true,
  }));

  await User.insertMany(finalProviders);
  console.log('✅ Providers Seeded with Correct Folder Paths');
}

module.exports = seedProviders;