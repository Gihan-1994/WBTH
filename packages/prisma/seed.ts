import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');
  // Add your seed data here based on the spec
  // Example:
  // await prisma.user.create({
  //   data: {
  //     name: 'Admin User',
  //     email: 'admin@example.com',
  //     password_hash: 'hashed_password', // In a real app, hash this securely
  //     role: 'admin',
  //   },
  // });
  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
