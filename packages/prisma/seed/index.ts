import { prisma } from '../src/client';
import { createUsers, tourists } from './users';
import { guides } from './guides';
import { accommodationProviders, accommodations } from './accommodations';
import { events } from './events';

async function main() {
  console.log('🌱 Starting database seed...\n');

  // Clear existing data (in order to respect foreign key constraints)
  console.log('🗑️  Clearing existing data...');
  await prisma.booking.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.rating.deleteMany();
  await prisma.event.deleteMany();
  await prisma.accommodation.deleteMany();
  await prisma.accommodationProvider.deleteMany();
  await prisma.guide.deleteMany();
  await prisma.tourist.deleteMany();
  await prisma.admin.deleteMany();
  await prisma.user.deleteMany();
  console.log('✓ Existing data cleared\n');

  // 1. Create Users
  console.log('👥 Creating users...');
  const usersData = await createUsers();
  for (const user of usersData) {
    await prisma.user.create({ data: user });
  }
  console.log(`✓ Created ${usersData.length} users\n`);

  // 2. Create Tourists
  console.log('🧳 Creating tourists...');
  await prisma.tourist.createMany({ data: tourists });
  console.log(`✓ Created ${tourists.length} tourists\n`);

  // 3. Create Guides
  console.log('🗺️  Creating guides...');
  await prisma.guide.createMany({ data: guides });
  console.log(`✓ Created ${guides.length} guides\n`);

  // 4. Create Accommodation Providers
  console.log('🏢 Creating accommodation providers...');
  await prisma.accommodationProvider.createMany({ data: accommodationProviders });
  console.log(`✓ Created ${accommodationProviders.length} accommodation providers\n`);

  // 5. Create Accommodations
  console.log('🏨 Creating accommodations...');
  await prisma.accommodation.createMany({ data: accommodations });
  console.log(`✓ Created ${accommodations.length} accommodations\n`);

  // 6. Create Events
  console.log('🎉 Creating events...');
  await prisma.event.createMany({ data: events });
  console.log(`✓ Created ${events.length} events\n`);

  console.log('✅ Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:');
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
