import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Clean existing data
  await prisma.chatMessage.deleteMany();
  await prisma.chatRoom.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.recentlyViewed.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.emergencyLog.deleteMany();
  await prisma.review.deleteMany();
  await prisma.pricing.deleteMany();
  await prisma.doctor.deleteMany();
  await prisma.hospitalSpecialty.deleteMany();
  await prisma.hospitalLanguage.deleteMany();
  await prisma.hospital.deleteMany();
  await prisma.specialty.deleteMany();
  await prisma.session.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash('Password123', 12);

  // ─── Users ───────────────────────────────────────────
  const traveler = await prisma.user.create({
    data: {
      email: 'traveler@example.com',
      passwordHash,
      firstName: 'Alex',
      lastName: 'Thompson',
      phone: '+14155551234',
      nationality: 'American',
      preferredLanguage: 'en',
      emergencyContactName: 'Sarah Thompson',
      emergencyContactPhone: '+14155555678',
      medicalNotes: 'Allergic to penicillin',
      travelStatus: 'TOURIST',
      role: 'TRAVELER',
      emailVerified: true,
      phoneVerified: true,
    },
  });

  const hospitalAdmin = await prisma.user.create({
    data: {
      email: 'hospital@example.com',
      passwordHash,
      firstName: 'Raj',
      lastName: 'Patel',
      phone: '+919876543210',
      nationality: 'Indian',
      preferredLanguage: 'en',
      travelStatus: 'LOCAL',
      role: 'HOSPITAL_ADMIN',
      emailVerified: true,
      phoneVerified: true,
    },
  });

  const superAdmin = await prisma.user.create({
    data: {
      email: 'admin@medassistglobal.com',
      passwordHash,
      firstName: 'System',
      lastName: 'Admin',
      phone: '+10000000000',
      preferredLanguage: 'en',
      travelStatus: 'LOCAL',
      role: 'SUPER_ADMIN',
      emailVerified: true,
      phoneVerified: true,
    },
  });

  console.log('Users created');

  // ─── Specialties ─────────────────────────────────────
  const specialtyData = [
    { name: 'General Medicine', icon: 'stethoscope', description: 'General medical consultation and treatment' },
    { name: 'Cardiology', icon: 'heart', description: 'Heart and cardiovascular system' },
    { name: 'Orthopedics', icon: 'bone', description: 'Musculoskeletal system, bones, joints' },
    { name: 'Dermatology', icon: 'skin', description: 'Skin, hair, and nails' },
    { name: 'Pediatrics', icon: 'baby', description: 'Medical care for infants and children' },
    { name: 'Emergency Medicine', icon: 'ambulance', description: 'Emergency and trauma care' },
    { name: 'Dental', icon: 'tooth', description: 'Oral health and dental procedures' },
    { name: 'ENT', icon: 'ear', description: 'Ear, nose, and throat' },
    { name: 'Ophthalmology', icon: 'eye', description: 'Eye care and vision' },
    { name: 'Neurology', icon: 'brain', description: 'Brain and nervous system disorders' },
  ];

  const specialties: Record<string, any> = {};
  for (const s of specialtyData) {
    const created = await prisma.specialty.create({ data: s });
    specialties[s.name] = created;
  }

  console.log('Specialties created');

  // ─── Hospitals ───────────────────────────────────────
  const hospitalsData = [
    {
      name: 'Apollo Hospitals Mumbai',
      slug: 'apollo-hospitals-mumbai',
      description: 'One of India\'s largest and most respected healthcare groups, offering world-class medical treatment with cutting-edge technology.',
      address: 'Plot No. 13, Parsik Hill Road, Sector 23, CBD Belapur',
      city: 'Mumbai',
      country: 'India',
      latitude: 19.0176,
      longitude: 73.0378,
      phone: '+912267101010',
      email: 'info@apollomumbai.com',
      website: 'https://www.apollohospitals.com',
      isVerified: true,
      isEmergencyCapable: true,
      availabilityStatus: 'OPEN' as const,
      adminUserId: hospitalAdmin.id,
      languages: ['English', 'Hindi', 'Marathi'],
      specialtyNames: ['General Medicine', 'Cardiology', 'Orthopedics', 'Neurology', 'Emergency Medicine'],
    },
    {
      name: 'Fortis Hospital Mumbai',
      slug: 'fortis-hospital-mumbai',
      description: 'A leading integrated healthcare delivery service provider in India with focus on multi-specialty care.',
      address: 'Mulund Goregaon Link Road, Mulund West',
      city: 'Mumbai',
      country: 'India',
      latitude: 19.1726,
      longitude: 72.9415,
      phone: '+912225994000',
      email: 'info@fortismumbai.com',
      website: 'https://www.fortishealthcare.com',
      isVerified: true,
      isEmergencyCapable: true,
      availabilityStatus: 'OPEN' as const,
      languages: ['English', 'Hindi'],
      specialtyNames: ['General Medicine', 'Cardiology', 'Dermatology', 'Pediatrics'],
    },
    {
      name: 'Bumrungrad International Hospital',
      slug: 'bumrungrad-international-bangkok',
      description: 'Southeast Asia\'s leading international hospital with 580 beds and over 30 specialty centers.',
      address: '33 Sukhumvit 3, Wattana',
      city: 'Bangkok',
      country: 'Thailand',
      latitude: 13.7431,
      longitude: 100.5518,
      phone: '+6620667888',
      email: 'info@bumrungrad.com',
      website: 'https://www.bumrungrad.com',
      isVerified: true,
      isEmergencyCapable: true,
      availabilityStatus: 'OPEN' as const,
      languages: ['English', 'Thai', 'Japanese', 'Mandarin', 'Arabic'],
      specialtyNames: ['General Medicine', 'Cardiology', 'Orthopedics', 'Ophthalmology', 'Dental'],
    },
    {
      name: 'Bangkok Hospital',
      slug: 'bangkok-hospital-main',
      description: 'A JCI-accredited international hospital providing comprehensive medical services to patients worldwide.',
      address: '2 Soi Soonvijai 7, New Phetchaburi Road',
      city: 'Bangkok',
      country: 'Thailand',
      latitude: 13.7454,
      longitude: 100.5747,
      phone: '+6627102000',
      email: 'info@bangkokhospital.com',
      website: 'https://www.bangkokhospital.com',
      isVerified: true,
      isEmergencyCapable: true,
      availabilityStatus: 'OPEN' as const,
      languages: ['English', 'Thai', 'Mandarin'],
      specialtyNames: ['General Medicine', 'ENT', 'Dermatology', 'Neurology'],
    },
    {
      name: 'Acibadem Hospital Istanbul',
      slug: 'acibadem-hospital-istanbul',
      description: 'Turkey\'s leading healthcare group with advanced technology and internationally accredited services.',
      address: 'Altunizade, Fahrettin Kerim Gokay Cad.',
      city: 'Istanbul',
      country: 'Turkey',
      latitude: 41.0217,
      longitude: 29.0425,
      phone: '+902124044444',
      email: 'info@acibadem.com',
      website: 'https://www.acibadem.com.tr',
      isVerified: true,
      isEmergencyCapable: true,
      availabilityStatus: 'OPEN' as const,
      languages: ['English', 'Turkish', 'Arabic', 'German'],
      specialtyNames: ['General Medicine', 'Cardiology', 'Orthopedics', 'Ophthalmology', 'Emergency Medicine'],
    },
    {
      name: 'Memorial Hospital Istanbul',
      slug: 'memorial-hospital-istanbul',
      description: 'Award-winning hospital chain known for organ transplantation and oncology services.',
      address: 'Piyalepasa Bulvari, Sisli',
      city: 'Istanbul',
      country: 'Turkey',
      latitude: 41.0602,
      longitude: 28.9706,
      phone: '+902123146666',
      email: 'info@memorial.com.tr',
      website: 'https://www.memorial.com.tr',
      isVerified: true,
      isEmergencyCapable: false,
      availabilityStatus: 'OPEN' as const,
      languages: ['English', 'Turkish', 'Arabic', 'French'],
      specialtyNames: ['Cardiology', 'Neurology', 'Pediatrics', 'Dental'],
    },
    {
      name: 'Mediclinic City Hospital Dubai',
      slug: 'mediclinic-city-hospital-dubai',
      description: 'A modern multi-disciplinary hospital in the heart of Dubai Healthcare City.',
      address: 'Building 37, Dubai Healthcare City',
      city: 'Dubai',
      country: 'UAE',
      latitude: 25.2303,
      longitude: 55.3189,
      phone: '+97145191000',
      email: 'info@mediclinic.ae',
      website: 'https://www.mediclinic.ae',
      isVerified: true,
      isEmergencyCapable: true,
      availabilityStatus: 'OPEN' as const,
      languages: ['English', 'Arabic', 'Hindi', 'French'],
      specialtyNames: ['General Medicine', 'Cardiology', 'Dermatology', 'ENT', 'Emergency Medicine'],
    },
    {
      name: 'American Hospital Dubai',
      slug: 'american-hospital-dubai',
      description: 'Premier private hospital providing comprehensive services with American medical standards.',
      address: '19th Street, Oud Metha',
      city: 'Dubai',
      country: 'UAE',
      latitude: 25.2349,
      longitude: 55.3128,
      phone: '+97143775500',
      email: 'info@ahdubai.com',
      website: 'https://www.ahdubai.com',
      isVerified: true,
      isEmergencyCapable: true,
      availabilityStatus: 'OPEN' as const,
      languages: ['English', 'Arabic', 'French', 'German'],
      specialtyNames: ['General Medicine', 'Orthopedics', 'Ophthalmology', 'Pediatrics'],
    },
    {
      name: 'Mount Elizabeth Hospital',
      slug: 'mount-elizabeth-hospital-singapore',
      description: 'Singapore\'s flagship private tertiary acute care hospital with renowned specialists.',
      address: '3 Mount Elizabeth',
      city: 'Singapore',
      country: 'Singapore',
      latitude: 1.3063,
      longitude: 103.8354,
      phone: '+6567372666',
      email: 'info@mountelizabeth.com.sg',
      website: 'https://www.mountelizabeth.com.sg',
      isVerified: true,
      isEmergencyCapable: true,
      availabilityStatus: 'OPEN' as const,
      languages: ['English', 'Mandarin', 'Japanese'],
      specialtyNames: ['General Medicine', 'Cardiology', 'Neurology', 'Orthopedics', 'ENT'],
    },
    {
      name: 'Raffles Hospital Singapore',
      slug: 'raffles-hospital-singapore',
      description: 'A premier private hospital offering a comprehensive range of specialist medical services.',
      address: '585 North Bridge Road',
      city: 'Singapore',
      country: 'Singapore',
      latitude: 1.3007,
      longitude: 103.8557,
      phone: '+6563111111',
      email: 'info@raffleshospital.com',
      website: 'https://www.raffleshospital.com',
      isVerified: true,
      isEmergencyCapable: true,
      availabilityStatus: 'LIMITED' as const,
      languages: ['English', 'Mandarin', 'Japanese', 'Spanish'],
      specialtyNames: ['General Medicine', 'Dermatology', 'Dental', 'Ophthalmology', 'Pediatrics'],
    },
  ];

  const hospitals: Record<string, any> = {};

  for (const h of hospitalsData) {
    const { languages, specialtyNames, ...hospitalData } = h;

    const hospital = await prisma.hospital.create({
      data: {
        ...hospitalData,
        languages: {
          create: languages.map((lang) => ({ language: lang })),
        },
      },
    });

    // Link specialties
    for (const sName of specialtyNames) {
      if (specialties[sName]) {
        await prisma.hospitalSpecialty.create({
          data: {
            hospitalId: hospital.id,
            specialtyId: specialties[sName].id,
          },
        });
      }
    }

    hospitals[hospital.slug] = hospital;
  }

  console.log('Hospitals created');

  // ─── Doctors ─────────────────────────────────────────
  const doctorsByHospital: Record<string, any[]> = {
    'apollo-hospitals-mumbai': [
      { name: 'Dr. Priya Sharma', specialty: 'Cardiology', qualifications: ['MBBS', 'MD', 'DM Cardiology'], languages: ['English', 'Hindi'], consultationFee: 100, experience: 15 },
      { name: 'Dr. Vikram Singh', specialty: 'Orthopedics', qualifications: ['MBBS', 'MS Orthopedics'], languages: ['English', 'Hindi', 'Marathi'], consultationFee: 80, experience: 12 },
      { name: 'Dr. Anita Desai', specialty: 'General Medicine', qualifications: ['MBBS', 'MD'], languages: ['English', 'Hindi'], consultationFee: 60, experience: 10 },
      { name: 'Dr. Rajesh Kumar', specialty: 'Neurology', qualifications: ['MBBS', 'MD', 'DM Neurology'], languages: ['English', 'Hindi'], consultationFee: 120, experience: 18 },
    ],
    'fortis-hospital-mumbai': [
      { name: 'Dr. Meera Iyer', specialty: 'Pediatrics', qualifications: ['MBBS', 'MD Pediatrics'], languages: ['English', 'Hindi'], consultationFee: 70, experience: 8 },
      { name: 'Dr. Arjun Nair', specialty: 'Dermatology', qualifications: ['MBBS', 'MD Dermatology'], languages: ['English', 'Hindi'], consultationFee: 90, experience: 11 },
      { name: 'Dr. Sunita Reddy', specialty: 'Cardiology', qualifications: ['MBBS', 'MD', 'DM'], languages: ['English', 'Hindi'], consultationFee: 110, experience: 14 },
    ],
    'bumrungrad-international-bangkok': [
      { name: 'Dr. Somchai Phuket', specialty: 'Cardiology', qualifications: ['MD', 'Fellowship Cardiology'], languages: ['English', 'Thai'], consultationFee: 150, experience: 20 },
      { name: 'Dr. Yuki Tanaka', specialty: 'Orthopedics', qualifications: ['MD', 'PhD'], languages: ['English', 'Japanese', 'Thai'], consultationFee: 140, experience: 16 },
      { name: 'Dr. Chen Wei', specialty: 'Ophthalmology', qualifications: ['MD', 'FRCS'], languages: ['English', 'Mandarin', 'Thai'], consultationFee: 130, experience: 13 },
      { name: 'Dr. Napat Siriwan', specialty: 'General Medicine', qualifications: ['MD'], languages: ['English', 'Thai'], consultationFee: 80, experience: 7 },
    ],
    'bangkok-hospital-main': [
      { name: 'Dr. Patchara Wongsiri', specialty: 'ENT', qualifications: ['MD', 'Fellowship ENT'], languages: ['English', 'Thai'], consultationFee: 100, experience: 12 },
      { name: 'Dr. Apinya Charoensuk', specialty: 'Neurology', qualifications: ['MD', 'Board Certified'], languages: ['English', 'Thai', 'Mandarin'], consultationFee: 120, experience: 15 },
      { name: 'Dr. Thana Meksuwan', specialty: 'Dermatology', qualifications: ['MD'], languages: ['English', 'Thai'], consultationFee: 90, experience: 9 },
    ],
    'acibadem-hospital-istanbul': [
      { name: 'Dr. Mehmet Ozturk', specialty: 'Cardiology', qualifications: ['MD', 'PhD Cardiology'], languages: ['English', 'Turkish', 'German'], consultationFee: 130, experience: 22 },
      { name: 'Dr. Ayse Demir', specialty: 'Ophthalmology', qualifications: ['MD', 'Fellowship'], languages: ['English', 'Turkish', 'Arabic'], consultationFee: 110, experience: 14 },
      { name: 'Dr. Kemal Yilmaz', specialty: 'Orthopedics', qualifications: ['MD', 'FRCS'], languages: ['English', 'Turkish'], consultationFee: 100, experience: 16 },
    ],
    'memorial-hospital-istanbul': [
      { name: 'Dr. Elif Kaya', specialty: 'Pediatrics', qualifications: ['MD', 'Fellowship Pediatrics'], languages: ['English', 'Turkish', 'French'], consultationFee: 90, experience: 11 },
      { name: 'Dr. Hasan Celik', specialty: 'Neurology', qualifications: ['MD', 'PhD'], languages: ['English', 'Turkish', 'Arabic'], consultationFee: 140, experience: 19 },
    ],
    'mediclinic-city-hospital-dubai': [
      { name: 'Dr. Ahmed Al-Rashid', specialty: 'General Medicine', qualifications: ['MBBS', 'MD'], languages: ['English', 'Arabic'], consultationFee: 200, experience: 15 },
      { name: 'Dr. Sarah Mitchell', specialty: 'Dermatology', qualifications: ['MD', 'FAAD'], languages: ['English', 'French'], consultationFee: 250, experience: 13 },
      { name: 'Dr. Ravi Menon', specialty: 'ENT', qualifications: ['MBBS', 'MS ENT'], languages: ['English', 'Hindi', 'Arabic'], consultationFee: 180, experience: 10 },
    ],
    'american-hospital-dubai': [
      { name: 'Dr. James Wilson', specialty: 'Orthopedics', qualifications: ['MD', 'FAAOS'], languages: ['English'], consultationFee: 300, experience: 25 },
      { name: 'Dr. Fatima Hassan', specialty: 'Pediatrics', qualifications: ['MD', 'Board Certified'], languages: ['English', 'Arabic'], consultationFee: 220, experience: 12 },
      { name: 'Dr. Michael Roberts', specialty: 'Ophthalmology', qualifications: ['MD', 'PhD'], languages: ['English', 'German'], consultationFee: 280, experience: 18 },
    ],
    'mount-elizabeth-hospital-singapore': [
      { name: 'Dr. Lim Wei Hong', specialty: 'Cardiology', qualifications: ['MBBS', 'MRCP', 'FAMS'], languages: ['English', 'Mandarin'], consultationFee: 350, experience: 20 },
      { name: 'Dr. Tan Soo Lin', specialty: 'Neurology', qualifications: ['MBBS', 'FRCP'], languages: ['English', 'Mandarin'], consultationFee: 320, experience: 17 },
      { name: 'Dr. Hiroshi Yamamoto', specialty: 'ENT', qualifications: ['MD', 'PhD'], languages: ['English', 'Japanese'], consultationFee: 280, experience: 14 },
    ],
    'raffles-hospital-singapore': [
      { name: 'Dr. Lee Mei Ling', specialty: 'Dermatology', qualifications: ['MBBS', 'MRCP Derm'], languages: ['English', 'Mandarin'], consultationFee: 250, experience: 11 },
      { name: 'Dr. David Chen', specialty: 'Dental', qualifications: ['BDS', 'MDS'], languages: ['English', 'Mandarin'], consultationFee: 200, experience: 9 },
      { name: 'Dr. Maria Garcia', specialty: 'Pediatrics', qualifications: ['MD', 'Fellowship'], languages: ['English', 'Spanish'], consultationFee: 280, experience: 13 },
    ],
  };

  for (const [slug, doctors] of Object.entries(doctorsByHospital)) {
    const hospital = hospitals[slug];
    if (hospital) {
      for (const doc of doctors) {
        await prisma.doctor.create({
          data: {
            hospitalId: hospital.id,
            ...doc,
          },
        });
      }
    }
  }

  console.log('Doctors created');

  // ─── Pricing ─────────────────────────────────────────
  const pricingCategories = [
    { serviceName: 'General Consultation', category: 'Consultation', minPrice: 30, maxPrice: 100 },
    { serviceName: 'Specialist Consultation', category: 'Consultation', minPrice: 80, maxPrice: 300 },
    { serviceName: 'Emergency Room Visit', category: 'Emergency', minPrice: 100, maxPrice: 500 },
    { serviceName: 'X-Ray', category: 'Diagnostics', minPrice: 20, maxPrice: 80 },
    { serviceName: 'Blood Tests (Basic Panel)', category: 'Diagnostics', minPrice: 30, maxPrice: 120 },
    { serviceName: 'MRI Scan', category: 'Diagnostics', minPrice: 200, maxPrice: 800 },
    { serviceName: 'CT Scan', category: 'Diagnostics', minPrice: 150, maxPrice: 600 },
    { serviceName: 'Dental Cleaning', category: 'Dental', minPrice: 40, maxPrice: 150 },
    { serviceName: 'Eye Examination', category: 'Ophthalmology', minPrice: 50, maxPrice: 200 },
    { serviceName: 'Physiotherapy Session', category: 'Rehabilitation', minPrice: 40, maxPrice: 120 },
  ];

  const currencyByCountry: Record<string, string> = {
    India: 'INR',
    Thailand: 'THB',
    Turkey: 'TRY',
    UAE: 'AED',
    Singapore: 'SGD',
  };

  const priceMultiplier: Record<string, number> = {
    India: 0.4,
    Thailand: 0.5,
    Turkey: 0.6,
    UAE: 1.5,
    Singapore: 2.0,
  };

  for (const hospital of Object.values(hospitals)) {
    const country = hospital.country;
    const multiplier = priceMultiplier[country] || 1;
    const currency = currencyByCountry[country] || 'USD';

    for (const pricing of pricingCategories) {
      await prisma.pricing.create({
        data: {
          hospitalId: hospital.id,
          serviceName: pricing.serviceName,
          category: pricing.category,
          minPrice: Math.round(pricing.minPrice * multiplier),
          maxPrice: Math.round(pricing.maxPrice * multiplier),
          currency,
        },
      });
    }
  }

  console.log('Pricing created');

  // ─── Reviews ─────────────────────────────────────────
  const reviewTexts = [
    { rating: 5, title: 'Excellent care for tourists', content: 'Outstanding medical care with excellent English-speaking staff. The hospital handled my emergency swiftly and professionally. Highly recommended for international travelers.' },
    { rating: 4, title: 'Very good experience', content: 'Very modern facility with knowledgeable doctors. Wait times were reasonable and the staff was very accommodating of language barriers. Would visit again if needed.' },
    { rating: 5, title: 'Life-saving treatment', content: 'I had a serious accident while traveling and this hospital provided exceptional emergency care. The doctors and nurses were incredibly compassionate and skilled.' },
    { rating: 3, title: 'Decent but expensive', content: 'The medical care was adequate but the pricing seemed higher than expected. Communication could have been better. Still, I received proper treatment for my condition.' },
    { rating: 4, title: 'Clean and modern', content: 'Very clean and modern facility. The international patient department was very helpful with insurance paperwork. Doctors were thorough in their examination.' },
    { rating: 5, title: 'Best hospital for foreigners', content: 'As a tourist, I felt completely taken care of. They had translators available and the staff went above and beyond to make me comfortable during my stay.' },
    { rating: 4, title: 'Professional and efficient', content: 'Fast service, professional doctors, and a well-organized system. The billing was transparent and they helped with travel insurance claims.' },
    { rating: 3, title: 'Good but crowded', content: 'Good quality medical care but the hospital was quite crowded. Had to wait longer than expected. The doctors were competent and the treatment was effective.' },
  ];

  let reviewIndex = 0;
  for (const hospital of Object.values(hospitals)) {
    const numReviews = Math.floor(Math.random() * 3) + 1;
    for (let i = 0; i < numReviews; i++) {
      const review = reviewTexts[reviewIndex % reviewTexts.length];
      await prisma.review.create({
        data: {
          hospitalId: hospital.id,
          userId: traveler.id,
          rating: review.rating,
          title: review.title,
          content: review.content,
          isVerified: true,
          isApproved: true,
        },
      });
      reviewIndex++;
    }

    // Update hospital rating
    const aggregation = await prisma.review.aggregate({
      where: { hospitalId: hospital.id, isApproved: true },
      _avg: { rating: true },
      _count: { rating: true },
    });

    await prisma.hospital.update({
      where: { id: hospital.id },
      data: {
        rating: aggregation._avg.rating || 0,
        reviewCount: aggregation._count.rating,
      },
    });
  }

  console.log('Reviews created');

  // ─── Favorites ───────────────────────────────────────
  const favoriteHospitals = Object.values(hospitals).slice(0, 3);
  for (const hospital of favoriteHospitals) {
    await prisma.favorite.create({
      data: {
        userId: traveler.id,
        hospitalId: hospital.id,
      },
    });
  }

  console.log('Favorites created');

  // ─── Sample Notifications ────────────────────────────
  await prisma.notification.createMany({
    data: [
      {
        userId: traveler.id,
        title: 'Welcome to MedAssist Global',
        body: 'Thank you for joining MedAssist Global. We are here to help you find the best medical care wherever you travel.',
        type: 'SYSTEM',
      },
      {
        userId: traveler.id,
        title: 'Complete Your Profile',
        body: 'Add your emergency contact and medical notes for faster assistance in emergencies.',
        type: 'SYSTEM',
      },
      {
        userId: hospitalAdmin.id,
        title: 'Hospital Verified',
        body: 'Your hospital Apollo Hospitals Mumbai has been verified and is now visible to travelers.',
        type: 'SYSTEM',
      },
    ],
  });

  console.log('Notifications created');

  console.log('');
  console.log('=== Seed completed successfully ===');
  console.log('');
  console.log('Test Accounts:');
  console.log('  Traveler:       traveler@example.com / Password123');
  console.log('  Hospital Admin: hospital@example.com / Password123');
  console.log('  Super Admin:    admin@medassistglobal.com / Password123');
  console.log('');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('Seed error:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
