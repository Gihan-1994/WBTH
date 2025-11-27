
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Verifying Prisma Client and Database Schema...');

    try {
        // 1. Check if we can access the new fields in types
        // This is a runtime check, but if the client was generated correctly, it should work.
        // We'll try to find a provider and update their logo.

        // Find any user to act as provider
        const user = await prisma.user.findFirst();
        if (!user) {
            console.log('No users found. creating one...');
            // Create a dummy user if needed, but we likely have one.
            return;
        }

        console.log(`Found user: ${user.id}`);

        // Try to upsert an accommodation provider with a logo
        const provider = await prisma.accommodationProvider.upsert({
            where: { user_id: user.id },
            update: {
                company_name: "Test Company",
                logo: "test-logo-string",
            },
            create: {
                user_id: user.id,
                company_name: "Test Company",
                logo: "test-logo-string",
            },
        });

        console.log('Successfully updated provider logo:', provider.logo);

        // 2. Check Accommodation images
        // Create a dummy accommodation
        const accommodation = await prisma.accommodation.create({
            data: {
                provider_id: provider.provider_id,
                name: "Test Accommodation",
                location: "Test Location",
                images: ["image1", "image2"],
            }
        });

        console.log('Successfully created accommodation with images:', accommodation.images);

        // Clean up
        await prisma.accommodation.delete({ where: { id: accommodation.id } });
        console.log('Verification successful!');

    } catch (error) {
        console.error('Verification failed:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
