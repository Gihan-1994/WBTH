import { prisma } from '../src/client';
import users from './users';
import guides from './guides';
import accommodations from './accommodations';
import events from './events';

async function main() {
  await prisma.user.createMany({ data: users });
  // …create related guides, accommodations, events
}
main().catch((e) => { console.error(e); process.exit(1); }).finally(async () => prisma.$disconnect());
