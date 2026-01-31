import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@repo/prisma";
import { requireAdmin } from "@/lib/admin/adminAuth";
import bcrypt from "bcryptjs";

/**
 * Get all users with pagination
 * GET /api/admin/users?page=1&limit=50&role=tourist
 */
export async function GET(req: NextRequest) {
    try {
        const session = await requireAdmin();

        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "50");
        const role = searchParams.get("role");
        const search = searchParams.get("search");

        const skip = (page - 1) * limit;

        // Build where clause
        const where: any = {};
        if (role) {
            where.role = role;
        }
        if (search) {
            where.OR = [
                { name: { contains: search, mode: "insensitive" } },
                { email: { contains: search, mode: "insensitive" } },
            ];
        }

        const [users, total] = await Promise.all([
            prisma.user.findMany({
                where,
                select: {
                    id: true,
                    name: true,
                    email: true,
                    contact_no: true,
                    role: true,
                    created_at: true,
                    email_notifications_enabled: true,
                },
                orderBy: {
                    created_at: "desc"
                },
                skip,
                take: limit,
            }),
            prisma.user.count({ where })
        ]);

        return NextResponse.json({
            users,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        });

    } catch (error: any) {
        console.error("Error fetching users:", error);

        if (error.message === "Unauthorized" || error.message.includes("Forbidden")) {
            return NextResponse.json(
                { error: error.message },
                { status: 403 }
            );
        }

        return NextResponse.json(
            { error: "Failed to fetch users" },
            { status: 500 }
        );
    }
}

/**
 * Create a new user
 * POST /api/admin/users
 */
export async function POST(req: NextRequest) {
    try {
        await requireAdmin();

        const body = await req.json();
        const { name, email, password, contact_no, role } = body;

        // Validate required fields
        if (!name || !email || !password || !role) {
            return NextResponse.json(
                { error: "Name, email, password, and role are required" },
                { status: 400 }
            );
        }

        // Check if email already exists
        const existingUser = await prisma.user.findFirst({
            where: {
                email: {
                    equals: email,
                    mode: 'insensitive'
                }
            }
        });

        if (existingUser) {
            return NextResponse.json(
                { error: "Email already registered" },
                { status: 400 }
            );
        }

        // Hash password
        const password_hash = await bcrypt.hash(password, 10);

        // Create user
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password_hash,
                contact_no: contact_no || null,
                role,
            }
        });

        // Create role-specific record
        if (role === "tourist") {
            await prisma.tourist.create({
                data: { user_id: user.id }
            });
        } else if (role === "guide") {
            await prisma.guide.create({
                data: {
                    user_id: user.id,
                    experience: [],
                    languages: [],
                    expertise: [],
                }
            });
        } else if (role === "accommodation_provider") {
            await prisma.accommodationProvider.create({
                data: {
                    user_id: user.id,
                    company_name: name,
                }
            });
        }

        return NextResponse.json({
            success: true,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            }
        });

    } catch (error: any) {
        console.error("Error creating user:", error);

        if (error.message === "Unauthorized" || error.message.includes("Forbidden")) {
            return NextResponse.json(
                { error: error.message },
                { status: 403 }
            );
        }

        return NextResponse.json(
            { error: "Failed to create user" },
            { status: 500 }
        );
    }
}
