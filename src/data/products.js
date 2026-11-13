export const CATEGORIES = [
  'Clothing',
  'Electronics',
  'Notes',
  'Printouts',
  'Groceries',
  'Stationery',
  'Hostel Decor',
  'Utensils',
  'Skincare',
  'Haircare',
  'Sports Items'
];

export const CONDITIONS = ['All', 'Brand New', 'Like New', 'Good', 'Fair'];

export const BUY_PRODUCTS = [
  {
    id: 'buy-1',
    name: 'Casio fx-991EX ClassWiz Scientific Calculator',
    category: 'Electronics',
    price: 950,
    originalPrice: 1595,
    condition: 'Like New',
    images: [
      'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1587145820266-a5951ee6f620?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Barely used for 2 semesters of engineering math and stats. 552 functions, high-resolution LCD display, includes solar panel and slide-on protective case.',
    seller: {
      name: 'Rohan Sharma',
      hostel: 'Block B - Room 304',
      year: '3rd Year CSE',
      rating: 4.9,
      contact: 'rohan.s@college.edu'
    },
    listingDuration: '14 days',
    listedDate: '2 days ago',
    openToBargaining: true,
    defects: false,
    defectDetails: 'None. In mint condition with zero scratches on screen.'
  },
  {
    id: 'buy-2',
    name: 'College Oversized Varsity Hoodie (Black & Grey)',
    category: 'Clothing',
    price: 499,
    originalPrice: 1299,
    condition: 'Good',
    images: [
      'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Super cozy fleece lined unisex hoodie, size L. Worn during one winter season, washed and sanitized. Perfect for late night study sessions in library.',
    seller: {
      name: 'Aanya Patel',
      hostel: 'Girls Hostel 2 - Room 112',
      year: '2nd Year IT',
      rating: 4.8,
      contact: 'aanya.p@college.edu'
    },
    listingDuration: '14 days',
    listedDate: '1 day ago',
    openToBargaining: true,
    defects: false,
    defectDetails: 'Minor wash wear, no tears or stains.'
  },
  {
    id: 'buy-3',
    name: 'Data Structures & Algorithms Handwritten Complete Notes',
    category: 'Notes',
    price: 250,
    originalPrice: 400,
    condition: 'Like New',
    images: [
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Comprehensive 180-page spiral-bound handwritten notes covering Trees, Graphs, DP, Sorting, and Big-O with diagrammatic proofs and C++/Java code snippets.',
    seller: {
      name: 'Aditya Verma',
      hostel: 'Aryabhatta Hall - Room 208',
      year: '4th Year ECE',
      rating: 5.0,
      contact: 'aditya.v@college.edu'
    },
    listingDuration: '14 days',
    listedDate: '3 days ago',
    openToBargaining: false,
    defects: false,
    defectDetails: 'Clean, highlighted key theorems only.'
  },
  {
    id: 'buy-4',
    name: 'Pigeon 1.5L Stainless Steel Electric Kettle',
    category: 'Electronics',
    price: 420,
    originalPrice: 899,
    condition: 'Good',
    images: [
      'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Hostel lifeline! Works flawlessly for midnight tea, coffee, and boiling eggs/noodles. Automatic shut-off and 360-degree swivel base.',
    seller: {
      name: 'Vikram Singh',
      hostel: 'Block D - Room 415',
      year: 'Graduated Alum',
      rating: 4.7,
      contact: 'vikram.s@college.edu'
    },
    listingDuration: '14 days',
    listedDate: 'Just now',
    openToBargaining: true,
    defects: false,
    defectDetails: 'Minor water scale mark inside base, fully descaled and working.'
  },
  {
    id: 'buy-5',
    name: 'Architectural Mini Drafter & Technical Drawing Tools',
    category: 'Stationery',
    price: 380,
    originalPrice: 750,
    condition: 'Like New',
    images: [
      'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Essential for Engineering Graphics & CAD courses. Includes steel clamp, dual scales with 360 degree protractor head, and protective carry pouch.',
    seller: {
      name: 'Sneha Kulkarni',
      hostel: 'Kaveri Hostel - Room 302',
      year: '2nd Year Mech',
      rating: 4.9,
      contact: 'sneha.k@college.edu'
    },
    listingDuration: '14 days',
    listedDate: '4 days ago',
    openToBargaining: false,
    defects: false,
    defectDetails: 'None. Smooth rotation and intact screws.'
  },
  {
    id: 'buy-6',
    name: 'Warm Fairy String Lights (10m) + Wooden Photo Clips',
    category: 'Hostel Decor',
    price: 180,
    originalPrice: 350,
    condition: 'Brand New',
    images: [
      'https://images.unsplash.com/photo-1512909006721-3d6018887383?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1543257580-7269da773bf5?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'USB-powered 100 LED warm white copper fairy lights with 30 mini wooden clips to hang polaroids and memories on your hostel room wall.',
    seller: {
      name: 'Pooja Nair',
      hostel: 'Sarojini Hostel - Room 108',
      year: '1st Year BBA',
      rating: 5.0,
      contact: 'pooja.n@college.edu'
    },
    listingDuration: '14 days',
    listedDate: '5 days ago',
    openToBargaining: false,
    defects: false,
    defectDetails: 'Brand new in original box, never unpacked.'
  },
  {
    id: 'buy-7',
    name: 'Yonex GR 303 Badminton Racket + 3 Nylon Shuttles',
    category: 'Sports Items',
    price: 520,
    originalPrice: 1100,
    condition: 'Good',
    images: [
      'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1613918108466-292b78a8ef95?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1521537634581-0dced2fedc92?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Aluminum frame, durable steel shaft with brand new grip tape installed. Perfect for college evening games at the sports complex.',
    seller: {
      name: 'Harsh Vardhan',
      hostel: 'Tagore Hostel - Room 402',
      year: '3rd Year Civil',
      rating: 4.6,
      contact: 'harsh.v@college.edu'
    },
    listingDuration: '14 days',
    listedDate: '2 days ago',
    openToBargaining: true,
    defects: true,
    defectDetails: 'Minor paint chip at racket head rim, strings are tight and in top condition.'
  },
  {
    id: 'buy-8',
    name: 'Stainless Steel Hostel Utensil Starter Set (5 Pieces)',
    category: 'Utensils',
    price: 320,
    originalPrice: 650,
    condition: 'Like New',
    images: [
      'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Heavy gauge food grade steel set: 1 dinner plate, 2 curry bowls, 1 water glass, and 1 fork-spoon combo. Great for hostel mess deliveries.',
    seller: {
      name: 'Tanmay Joshi',
      hostel: 'Block A - Room 119',
      year: '2nd Year Chem',
      rating: 4.8,
      contact: 'tanmay.j@college.edu'
    },
    listingDuration: '14 days',
    listedDate: '3 days ago',
    openToBargaining: true,
    defects: false,
    defectDetails: 'Thoroughly sanitized and spotless.'
  },
  {
    id: 'buy-9',
    name: 'Gate Computer Science Exam Question Bank & Printouts',
    category: 'Printouts',
    price: 299,
    originalPrice: 700,
    condition: 'Good',
    images: [
      'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1532012164546-f432f2e3edd4?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Last 15 years chapter-wise solved GATE CS question papers bound together with clear index tabs. High quality double-sided printouts.',
    seller: {
      name: 'Deepak Rao',
      hostel: 'Block C - Room 310',
      year: 'Final Year CSE',
      rating: 5.0,
      contact: 'deepak.r@college.edu'
    },
    listingDuration: '14 days',
    listedDate: '6 days ago',
    openToBargaining: false,
    defects: false,
    defectDetails: 'Pencil marks on page margins, easily erasable.'
  },
  {
    id: 'buy-10',
    name: 'Minimalist Sunscreen SPF 50 & Gentle Cleanser (Sealed)',
    category: 'Skincare',
    price: 450,
    originalPrice: 798,
    condition: 'Brand New',
    images: [
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1608248597359-00f395462208?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Unopened duo pack ordered by mistake. Non-comedogenic, broad spectrum SPF 50 PA++++, expiry date Nov 2027.',
    seller: {
      name: 'Riya Sen',
      hostel: 'Girls Hostel 1 - Room 204',
      year: '3rd Year Biotech',
      rating: 4.9,
      contact: 'riya.s@college.edu'
    },
    listingDuration: '14 days',
    listedDate: '1 day ago',
    openToBargaining: true,
    defects: false,
    defectDetails: 'Brand new in sealed carton.'
  },
  {
    id: 'buy-11',
    name: 'Philips Foldable 1200W Compact Hair Dryer',
    category: 'Haircare',
    price: 650,
    originalPrice: 1295,
    condition: 'Like New',
    images: [
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Compact foldable handle, 2 flexible speed/heat settings, 1.5m cord. Ideal for hostel rooms with limited storage.',
    seller: {
      name: 'Megha Sharma',
      hostel: 'Kaveri Hostel - Room 410',
      year: '2nd Year MBA',
      rating: 4.7,
      contact: 'megha.s@college.edu'
    },
    listingDuration: '14 days',
    listedDate: '4 days ago',
    openToBargaining: true,
    defects: false,
    defectDetails: 'Used only 4-5 times, looks like new.'
  },
  {
    id: 'buy-12',
    name: 'Hostel Snack & Breakfast Bundle (Maggi, Oats, Coffee)',
    category: 'Groceries',
    price: 340,
    originalPrice: 510,
    condition: 'Brand New',
    images: [
      'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Unopened 12-pack Maggi Special Masala, 1kg Quaker Oats pouch, and 50g Nescafe Classic jar. Expiry dates late 2027.',
    seller: {
      name: 'Karan Mehra',
      hostel: 'Block B - Room 102',
      year: '1st Year CSE',
      rating: 4.9,
      contact: 'karan.m@college.edu'
    },
    listingDuration: '14 days',
    listedDate: 'Just now',
    openToBargaining: false,
    defects: false,
    defectDetails: 'All packs completely sealed and factory fresh.'
  }
];

export const RENT_PRODUCTS = [
  {
    id: 'rent-1',
    name: 'Hero Sprint 26T City Bicycle with Cable Lock & Basket',
    category: 'Sports Items',
    rentalPrice: 60,
    rentalPeriod: 'day',
    listingDuration: '2 days',
    availability: 'Available',
    securityDeposit: 300,
    images: [
      'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Smooth riding bicycle perfect for quick commute across large college campus, attending labs, or visiting nearby markets. Serviced last week.',
    owner: {
      name: 'Devansh Roy',
      hostel: 'Block A - Cycle Stand 14',
      rating: 4.9,
      contact: 'devansh.r@college.edu'
    }
  },
  {
    id: 'rent-2',
    name: 'Mini Drafter & Drafting Board Set for Exam & Practicals',
    category: 'Stationery',
    rentalPrice: 40,
    rentalPeriod: 'day',
    listingDuration: '2 days',
    availability: 'Available',
    securityDeposit: 200,
    images: [
      'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Do not buy a drafter for just 1 practical exam! Rent this calibrated drafter and 23x32 inch waterproof pin-wood board.',
    owner: {
      name: 'Nikhil Saxena',
      hostel: 'Tagore Hall - Room 312',
      rating: 5.0,
      contact: 'nikhil.s@college.edu'
    }
  },
  {
    id: 'rent-3',
    name: 'Raymond Navy Blue Slim-Fit Blazer (Size 38 / 40)',
    category: 'Clothing',
    rentalPrice: 150,
    rentalPeriod: 'day',
    listingDuration: '2 days',
    availability: 'Available',
    securityDeposit: 500,
    images: [
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Dry-cleaned premium blazer for placement interviews, formal club events, and college presentations. Includes garment cover.',
    owner: {
      name: 'Aman Mathur',
      hostel: 'Block C - Room 201',
      rating: 4.8,
      contact: 'aman.m@college.edu'
    }
  },
  {
    id: 'rent-4',
    name: 'Bajaj Personal Room Air Cooler (24 Litres)',
    category: 'Electronics',
    rentalPrice: 100,
    rentalPeriod: 'day',
    listingDuration: '2 days',
    availability: 'Currently Rented',
    securityDeposit: 600,
    images: [
      'https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1545259741-2ea3ebf61fa3?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Honeycomb pad cooling with 3 speed levels. Low power consumption suitable for hostel plugs. Currently rented until Sunday.',
    owner: {
      name: 'Sahil Jain',
      hostel: 'Aryabhatta - Room 105',
      rating: 4.7,
      contact: 'sahil.j@college.edu'
    }
  },
  {
    id: 'rent-5',
    name: 'Canon EOS 200D DSLR Camera with 18-55mm STM Lens',
    category: 'Electronics',
    rentalPrice: 450,
    rentalPeriod: 'day',
    listingDuration: '2 days',
    availability: 'Reserved',
    securityDeposit: 1500,
    images: [
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1502982720700-bfff97f2ecac?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Great for college fests, convocation photoshoots, or weekend trips. Includes 64GB high speed SD card, 2 batteries, and camera bag.',
    owner: {
      name: 'Pranav Nair',
      hostel: 'Block B - Room 408',
      rating: 5.0,
      contact: 'pranav.n@college.edu'
    }
  },
  {
    id: 'rent-6',
    name: 'Quechua 3-Person Waterproof Camping Tent',
    category: 'Sports Items',
    rentalPrice: 180,
    rentalPeriod: 'day',
    listingDuration: '2 days',
    availability: 'Available',
    securityDeposit: 700,
    images: [
      'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Easy pop-up assembly in 5 minutes, wind and waterproof tested. Lightweight carry bag included. Ideal for college trekking trips.',
    owner: {
      name: 'Simran Gill',
      hostel: 'Sarojini Hostel - Room 315',
      rating: 4.9,
      contact: 'simran.g@college.edu'
    }
  },
  {
    id: 'rent-7',
    name: 'Prestige 1200W Induction Cooktop with Kadai & Pan',
    category: 'Utensils',
    rentalPrice: 75,
    rentalPeriod: 'day',
    listingDuration: '2 days',
    availability: 'Available',
    securityDeposit: 400,
    images: [
      'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Anti-magnetic wall, Indian menu presets, energy saving timer. Comes with 1 non-stick frying pan and spatula. Cleaned & tested.',
    owner: {
      name: 'Kavita Joshi',
      hostel: 'Girls Hostel 2 - Room 209',
      rating: 4.8,
      contact: 'kavita.j@college.edu'
    }
  },
  {
    id: 'rent-8',
    name: 'Ergonomic Mesh Study Chair with Lumbar Support',
    category: 'Hostel Decor',
    rentalPrice: 50,
    rentalPeriod: 'day',
    listingDuration: '2 days',
    availability: 'Available',
    securityDeposit: 350,
    images: [
      'https://images.unsplash.com/photo-1580481077195-c990ee587be6?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1505797149-43b0069ec26b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1589384267710-7a170981ca78?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Breathable mesh back, adjustable height and smooth casters. Save your back during semester exam prep marathons.',
    owner: {
      name: 'Varun Tandon',
      hostel: 'Block D - Room 104',
      rating: 4.9,
      contact: 'varun.t@college.edu'
    }
  }
];
