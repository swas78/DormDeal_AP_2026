const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const connectDB = require('../config/db');
const User = require('../models/User');
const Item = require('../models/Item');
const BroadcastRequest = require('../models/BroadcastRequest');
const Deal = require('../models/Deal');
const Review = require('../models/Review');
const Notification = require('../models/Notification');
const OTP = require('../models/OTP');

const sampleStudents = [
  {
    fullName: 'Aarav Sharma',
    enrollmentId: '2023CSB1012',
    email: 'aarav.sharma@university.edu',
    phone: '+91 98765 43210',
    password: 'Password@123',
    hostelName: 'Block B',
    roomNumber: 'Room 304',
    academicYear: '3rd Year CSE',
    profilePhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    avgRating: 4.9,
    ratingCount: 8,
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
    hostelName: 'Girls Hostel 1',
    roomNumber: 'Room 208',
    academicYear: '3rd Year ECE',
    profilePhoto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
    avgRating: 4.8,
    ratingCount: 5,
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
    hostelName: 'Block A',
    roomNumber: 'Room 112',
    academicYear: '4th Year Mech',
    profilePhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    avgRating: 4.7,
    ratingCount: 11,
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
    hostelName: 'Girls Hostel 2',
    roomNumber: 'Room 405',
    academicYear: '2nd Year CSE',
    profilePhoto: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
    avgRating: 5.0,
    ratingCount: 3,
    isEmailVerified: true,
    isPhoneVerified: true,
    disclaimerAccepted: true,
    disclaimerAcceptedAt: new Date(),
  },
];

const sampleItems = [
  // 1. Direct Sale: Calculator
  {
    title: 'Casio fx-991EX ClassWiz Scientific Calculator',
    description: 'Allowed in all mid-terms and finals. Solves matrices, calculus, integration, and simultaneous equations. Slide case and manual included.',
    listingType: 'SELL',
    category: 'Electronics',
    itemCondition: 'Like New',
    price: 850,
    originalPrice: 1595,
    openToBargaining: true,
    hasDefects: false,
    defectDetails: '',
    images: ['https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&w=800&q=80'],
    status: 'AVAILABLE',
  },
  // 2. Campus Rental: Placement Blazer
  {
    title: 'Raymond Charcoal Grey Formal Suit & Blazer (Size 38)',
    description: 'Tailored two-piece formal blazer, dry-cleaned and ready for mock interviews, placement drives, and campus conferences.',
    listingType: 'RENT',
    category: 'Clothing',
    itemCondition: 'Like New',
    price: 150, // ₹150 per day
    rentalPeriod: 'day',
    securityDeposit: 800,
    listingDurationDays: 7,
    openToBargaining: false,
    hasDefects: false,
    defectDetails: '',
    images: ['https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80'],
    status: 'AVAILABLE',
  },
  // 3. Direct Sale: Bicycle
  {
    title: 'Hero Sprint Pro 21-Speed Geared Mountain Bike',
    description: 'Used for campus commutes between hostel and department. Front suspension, dual disc brakes, and free wire lock included.',
    listingType: 'SELL',
    category: 'Sports Items',
    itemCondition: 'Good',
    price: 4200,
    originalPrice: 8500,
    openToBargaining: true,
    hasDefects: true,
    defectDetails: 'Minor surface scratch on front fork, gears shift smoothly.',
    images: ['https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=800&q=80'],
    status: 'AVAILABLE',
  },
  // 4. Campus Rental: DSLR Camera
  {
    title: 'Canon EOS 200D II DSLR with 18-55mm STM Lens',
    description: 'Rent for fest coverage, college cultural night, or weekend road trips. Includes 64GB high-speed memory card, extra battery, and camera bag.',
    listingType: 'RENT',
    category: 'Electronics',
    itemCondition: 'Like New',
    price: 400, // ₹400 per day
    rentalPeriod: 'day',
    securityDeposit: 3000,
    listingDurationDays: 7,
    openToBargaining: false,
    hasDefects: false,
    defectDetails: '',
    images: ['https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80'],
    status: 'AVAILABLE',
  },
  // 5. Direct Sale: Algorithms Book
  {
    title: 'Introduction to Algorithms (CLRS 3rd Edition)',
    description: 'Standard textbook for Data Structures & Algorithms. Binding is tight, clean pages with pencil notes in DP chapters.',
    listingType: 'SELL',
    category: 'Notes',
    itemCondition: 'Good',
    price: 650,
    originalPrice: 1250,
    openToBargaining: false,
    hasDefects: false,
    defectDetails: '',
    images: ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80'],
    status: 'AVAILABLE',
  },
  // 6. Direct Sale: Electric Kettle
  {
    title: 'Pigeon 1.5L Stainless Steel Electric Kettle for Maggi & Chai',
    description: 'Hostel essential for late night study sessions. Fast heating 1500W, clean stainless steel interior, auto cut-off.',
    listingType: 'SELL',
    category: 'Utensils',
    itemCondition: 'Like New',
    price: 550,
    originalPrice: 1100,
    openToBargaining: true,
    hasDefects: false,
    defectDetails: '',
    images: ['https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80'],
    status: 'AVAILABLE',
  },
  // 7. Direct Sale: Engineering Drafter
  {
    title: 'Omega Mini Drafter with Sheet Container & Clips',
    description: 'Required for 1st year Engineering Graphics course. Unbroken scales, smooth rotating protractor head, with hard protective tube.',
    listingType: 'SELL',
    category: 'Stationery',
    itemCondition: 'Good',
    price: 350,
    originalPrice: 750,
    openToBargaining: false,
    hasDefects: false,
    defectDetails: '',
    images: ['https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?auto=format&fit=crop&w=800&q=80'],
    status: 'AVAILABLE',
  },
  // 8. Campus Rental: Camping Tent
  {
    title: 'Quechua 2-Person Waterproof Pop-Up Camping Tent',
    description: 'Perfect for weekend treks and outdoor camps. Sets up in 2 minutes, compact fold, ground pegs and rain fly included.',
    listingType: 'RENT',
    category: 'Sports Items',
    itemCondition: 'Good',
    price: 250, // ₹250 per day
    rentalPeriod: 'day',
    securityDeposit: 1000,
    listingDurationDays: 7,
    openToBargaining: false,
    hasDefects: false,
    defectDetails: '',
    images: ['https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=800&q=80'],
    status: 'AVAILABLE',
  },
];

const seedDatabase = async (shouldExit = true) => {
  try {
    await connectDB();

    console.log('[Seeder] Cleaning existing collections...');
    await User.deleteMany({});
    await Item.deleteMany({});
    await BroadcastRequest.deleteMany({});
    await Deal.deleteMany({});
    await Review.deleteMany({});
    await Notification.deleteMany({});
    await OTP.deleteMany({});

    console.log('[Seeder] Creating student accounts with hostel routing...');
    const createdUsers = [];
    for (const u of sampleStudents) {
      const user = await User.create(u);
      createdUsers.push(user);
    }
    console.log(`[Seeder] Created ${createdUsers.length} student profiles.`);

    console.log('[Seeder] Creating Sell and Rent items...');
    const itemsToInsert = sampleItems.map((item, idx) => ({
      ...item,
      seller: createdUsers[idx % createdUsers.length]._id,
    }));
    await Item.insertMany(itemsToInsert);
    console.log(`[Seeder] Created ${itemsToInsert.length} marketplace listings.`);

    console.log('[Seeder] Creating sample campus broadcast requests (3-Day TTL)...');
    await BroadcastRequest.create({
      title: 'Need a Mini Drafter for Engineering Drawing Lab tomorrow',
      category: 'Stationery',
      maxBudget: 200,
      neededByDate: 'Tomorrow 9:00 AM',
      notes: 'Please let me know if anyone in Block B or A has one!',
      buyer: createdUsers[0]._id,
      status: 'OPEN',
    });

    await BroadcastRequest.create({
      title: 'Looking for a Room Air Cooler for 2 weeks',
      category: 'Hostel Decor',
      maxBudget: 600,
      neededByDate: 'This Friday',
      notes: 'Need for exam month, can pay deposit.',
      buyer: createdUsers[1]._id,
      status: 'OPEN',
    });
    console.log('[Seeder] Created 2 campus broadcast requests.');

    console.log('====================================================');
    console.log(' SEEDING COMPLETE! Test Student Credentials:');
    console.log(' Email   : aarav.sharma@university.edu');
    console.log(' Phone   : +91 98765 43210');
    console.log(' Password: Password@123');
    console.log(' Hostel  : Block B, Room 304');
    console.log('====================================================');

    if (shouldExit) {
      process.exit(0);
    }
  } catch (err) {
    console.error(`[Seeder Error]: ${err.message}`);
    if (shouldExit) {
      process.exit(1);
    }
    throw err;
  }
};

if (require.main === module) {
  seedDatabase(true);
}

module.exports = seedDatabase;
