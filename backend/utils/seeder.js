const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const connectDB = require('../config/db');
const User = require('../models/User');
const Product = require('../models/Product');
const OTP = require('../models/OTP');

const sampleUsers = [
  {
    fullName: 'Aarav Sharma',
    enrollmentId: '2023CSB1012',
    email: 'aarav.sharma@university.edu',
    phone: '+91 98765 43210',
    password: 'Password@123',
    profilePhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    isEmailVerified: true,
    isPhoneVerified: true,
    disclaimerAccepted: true,
    disclaimerAcceptedAt: new Date(),
  },
  {
    fullName: 'Priya Patel',
    enrollmentId: '2023ECB1045',
    email: 'priya.patel@university.edu',
    phone: '+91 98123 45678',
    password: 'Password@123',
    profilePhoto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
    isEmailVerified: true,
    isPhoneVerified: true,
    disclaimerAccepted: true,
    disclaimerAcceptedAt: new Date(),
  },
  {
    fullName: 'Rohan Verma',
    enrollmentId: '2022MEB1078',
    email: 'rohan.verma@university.edu',
    phone: '+91 97234 56789',
    password: 'Password@123',
    profilePhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    isEmailVerified: true,
    isPhoneVerified: true,
    disclaimerAccepted: true,
    disclaimerAcceptedAt: new Date(),
  },
  {
    fullName: 'Ananya Iyer',
    enrollmentId: '2024CSB1090',
    email: 'ananya.iyer@university.edu',
    phone: '+91 96543 21098',
    password: 'Password@123',
    profilePhoto: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
    isEmailVerified: true,
    isPhoneVerified: true,
    disclaimerAccepted: true,
    disclaimerAcceptedAt: new Date(),
  },
];

const sampleProducts = [
  {
    title: 'Hero Sprint Pro 21-Speed Geared Mountain Bike',
    description: 'Used for 2 semesters to commute between hostel and department. Excellent condition with dual disc brakes, front suspension, mudguards, and an attached combination cable lock. Smooth gear shifting.',
    price: 4500,
    category: 'Cycles',
    condition: 'Good',
    images: [
      'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?auto=format&fit=crop&w=800&q=80',
    ],
    status: 'Available',
  },
  {
    title: 'Apple iPad 9th Gen (64GB, Space Grey) + Pencil',
    description: 'Perfect for taking digital notes in engineering lectures and annotating research PDFs. Battery health is at 94%. Comes with tempered glass installed, folding flip cover, and stylus pencil.',
    price: 18500,
    category: 'Electronics',
    condition: 'Like New',
    images: [
      'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=80',
    ],
    status: 'Available',
  },
  {
    title: 'Casio fx-991EX ClassWiz Scientific Calculator',
    description: 'Allowed in all university mid-term and semester examinations. Matrix, calculus, and equation solving functions. Original box and slide case included.',
    price: 850,
    category: 'Electronics',
    condition: 'Like New',
    images: [
      'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&w=800&q=80',
    ],
    status: 'Available',
  },
  {
    title: 'Introduction to Algorithms (CLRS 3rd Edition)',
    description: 'The standard algorithms bible for CS students. Clean pages with minimal pencil highlights in dynamic programming chapters. Binding is solid.',
    price: 750,
    category: 'Books & Study Material',
    condition: 'Good',
    images: [
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
    ],
    status: 'Available',
  },
  {
    title: 'Operating Systems Principles (Silberschatz) + Handwritten Lecture Notes',
    description: 'Covers process scheduling, memory management, file systems, and threads. Giving away my semester handwritten cheat sheets and question bank free with this.',
    price: 450,
    category: 'Books & Study Material',
    condition: 'Good',
    images: [
      'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80',
    ],
    status: 'Available',
  },
  {
    title: 'Ergonomic Mesh Study Chair with Lumbar Support',
    description: 'High quality breathable mesh chair with pneumatic height adjustment and sturdy rolling casters. Essential for long night-time coding and assignment sessions in the hostel.',
    price: 1800,
    category: 'Furniture',
    condition: 'Good',
    images: [
      'https://images.unsplash.com/photo-1580481077195-c3a821a5060f?auto=format&fit=crop&w=800&q=80',
    ],
    status: 'Available',
  },
  {
    title: 'Foldable Bed Study Table with Cup Holder & Tablet Slot',
    description: 'Compact wooden engineered study table. Foldable legs make it very easy to store under the hostel bed. No scratches, barely used for 3 months.',
    price: 400,
    category: 'Furniture',
    condition: 'Like New',
    images: [
      'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=800&q=80',
    ],
    status: 'Available',
  },
  {
    title: 'Bajaj 1.5L Cordless Electric Kettle for Maggi & Coffee',
    description: 'Hostel lifesaver for late night noodles, green tea, and black coffee. Fast boil 1500W heating element, auto cut-off safety. Clean stainless steel interior.',
    price: 650,
    category: 'Hostel Essentials',
    condition: 'Like New',
    images: [
      'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80',
    ],
    status: 'Available',
  },
  {
    title: 'Havells 3-Blade High-Speed Table Fan',
    description: 'Silent and powerful breeze for summer hostel rooms. Oscillating head, 3-speed regulator dial, copper motor. 100% working condition.',
    price: 900,
    category: 'Hostel Essentials',
    condition: 'Good',
    images: [
      'https://images.unsplash.com/photo-1618941716939-553df3c6c278?auto=format&fit=crop&w=800&q=80',
    ],
    status: 'Available',
  },
  {
    title: 'Yonex Muscle Power 29 Light Badminton Racket + 3 Shuttles',
    description: 'Isometric head shape, full graphite shaft, strung at 24 lbs tension with Yonex BG65 string. Gripped with fresh Wilson overgrip. Free 3-pack Mavis 350 shuttles.',
    price: 1100,
    category: 'Sports Equipment',
    condition: 'Like New',
    images: [
      'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=800&q=80',
    ],
    status: 'Available',
  },
  {
    title: 'Nivia Storm Rubber Football (Size 5)',
    description: 'All-weather rubber molded ball for turf and hard ground campus grounds. Holds air pressure perfectly with zero leaks.',
    price: 350,
    category: 'Sports Equipment',
    condition: 'Good',
    images: [
      'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=800&q=80',
    ],
    status: 'Available',
  },
  {
    title: 'University Official Fleece Varsity Jacket (Navy & Grey, Size L)',
    description: 'Official university branded jacket bought during the annual tech fest. Thick warm fleece lining, brass buttons, two side pockets. Worn twice only.',
    price: 800,
    category: 'Fashion',
    condition: 'Like New',
    images: [
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80',
    ],
    status: 'Available',
  },
  {
    title: 'Peter England Formal Black Two-Piece Blazer (Size 40)',
    description: 'Tailored fit formal blazer suitable for placement interviews, campus presentations, and conferences. Dry cleaned and ready to wear.',
    price: 1400,
    category: 'Fashion',
    condition: 'Like New',
    images: [
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80',
    ],
    status: 'Available',
  },
  {
    title: 'Yamaha F280 Acoustic Guitar with Padded Gig Bag & Capo',
    description: 'Natural gloss spruce top, rosewood fretboard. Rich projection and low action setup done by luthier. Perfect for campus cultural night jams. Includes D’Addario strings.',
    price: 5200,
    category: 'Other Items',
    condition: 'Like New',
    images: [
      'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&w=800&q=80',
    ],
    status: 'Available',
  },
  {
    title: 'Amazon Echo Dot 4th Gen Smart Speaker with Alexa',
    description: 'Smart speaker with clock display. Great audio quality for streaming music and setting morning wake-up alarms for 8:00 AM classes. Original 15W power adapter included.',
    price: 1900,
    category: 'Other Items',
    condition: 'Good',
    images: [
      'https://images.unsplash.com/photo-1543512214-318c7553f230?auto=format&fit=crop&w=800&q=80',
    ],
    status: 'Available',
  },
];

const seedDatabase = async (shouldExit = true) => {
  try {
    await connectDB();

    console.log('[Seeder] Cleaning existing database collections...');
    await User.deleteMany({});
    await Product.deleteMany({});
    await OTP.deleteMany({});

    console.log('[Seeder] Inserting student accounts...');
    const createdUsers = [];
    for (const userData of sampleUsers) {
      // create one-by-one so pre-save password hashing is triggered
      const user = await User.create(userData);
      createdUsers.push(user);
    }
    console.log(`[Seeder] Created ${createdUsers.length} student users.`);

    console.log('[Seeder] Inserting marketplace products...');
    const productsToInsert = sampleProducts.map((p, index) => {
      // distribute products across the created student sellers
      const seller = createdUsers[index % createdUsers.length]._id;
      return {
        ...p,
        seller,
      };
    });

    await Product.insertMany(productsToInsert);
    console.log(`[Seeder] Created ${productsToInsert.length} marketplace products.`);

    console.log('====================================================');
    console.log(' SEEDING COMPLETE! Test Student Login Credentials:');
    console.log(' Email   : aarav.sharma@university.edu');
    console.log(' Phone   : +91 98765 43210');
    console.log(' Password: Password@123');
    console.log('====================================================');

    if (shouldExit) {
      process.exit(0);
    }
  } catch (error) {
    console.error(`[Seeder Error]: ${error.message}`);
    if (shouldExit) {
      process.exit(1);
    }
    throw error;
  }
};

// If run directly from CLI
if (require.main === module) {
  seedDatabase(true);
}

module.exports = seedDatabase;
