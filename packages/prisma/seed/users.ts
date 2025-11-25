import { UserRole } from '@prisma/client';
import bcrypt from 'bcrypt';

// Helper to hash passwords (in production, you'd use bcrypt)
const hashPassword = async (password: string) => {
    return await bcrypt.hash(password, 10);
};

export const createUsers = async () => {
    const hashedPassword = await hashPassword('password123');

    return [
        {
            id: 'user-tourist-1',
            name: 'John Doe',
            email: 'john.doe@example.com',
            password_hash: hashedPassword,
            contact_no: '+94771234567',
            role: UserRole.tourist,
        },
        {
            id: 'user-tourist-2',
            name: 'Jane Smith',
            email: 'jane.smith@example.com',
            password_hash: hashedPassword,
            contact_no: '+94772345678',
            role: UserRole.tourist,
        },
        {
            id: 'user-guide-1',
            name: 'Nimal Perera',
            email: 'nimal.perera@example.com',
            password_hash: hashedPassword,
            contact_no: '+94773456789',
            role: UserRole.guide,
        },
        {
            id: 'user-guide-2',
            name: 'Sunil Fernando',
            email: 'sunil.fernando@example.com',
            password_hash: hashedPassword,
            contact_no: '+94774567890',
            role: UserRole.guide,
        },
        {
            id: 'user-accommodation-1',
            name: 'Paradise Hotels Ltd',
            email: 'contact@paradisehotels.com',
            password_hash: hashedPassword,
            contact_no: '+94775678901',
            role: UserRole.accommodation_provider,
        },
        {
            id: 'user-accommodation-2',
            name: 'Beach Resorts Inc',
            email: 'info@beachresorts.com',
            password_hash: hashedPassword,
            contact_no: '+94776789012',
            role: UserRole.accommodation_provider,
        },
        {
            id: 'user-admin-1',
            name: 'Admin User',
            email: 'admin@wbth.com',
            password_hash: hashedPassword,
            contact_no: '+94777890123',
            role: UserRole.admin,
        },
    ];
};

export const tourists = [
    {
        user_id: 'user-tourist-1',
        country: 'United States',
        dob: new Date('1990-05-15'),
    },
    {
        user_id: 'user-tourist-2',
        country: 'United Kingdom',
        dob: new Date('1988-11-22'),
    },
];
