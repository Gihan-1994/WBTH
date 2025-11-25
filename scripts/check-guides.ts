import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    const users = await prisma.user.findMany({
        include: {
            guide: true,
        },
    });

    const bookings = await prisma.booking.findMany({
        where: {
            guide_id: "1cc8636d-12d3-4b4e-b201-b321160c1b75" // ngg user id
        }
    });

    console.log("Users:", JSON.stringify(users, null, 2));
    console.log("Bookings for guide:", JSON.stringify(bookings, null, 2));
    console.log("Bookings:", JSON.stringify(bookings, null, 2));
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
