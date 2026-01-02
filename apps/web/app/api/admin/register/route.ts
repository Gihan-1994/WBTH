import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@repo/prisma";
import bcrypt from "bcryptjs";
import { adminExists } from "@/lib/admin/adminAuth";

/**
 * One-time admin registration
 * POST /api/admin/register
 */
export async function POST(req: NextRequest) {
    try {
        // Check if admin already exists
        const exists = await adminExists();
        if (exists) {
            return NextResponse.json(
                { error: "Admin already exists. Only one admin is allowed." },
                { status: 400 }
            );
        }

        const body = await req.json();
        const { name, email, password, contact_no } = body;

        // Validate required fields
        if (!name || !email || !password) {
            return NextResponse.json(
                { error: "Name, email, and password are required" },
                { status: 400 }
            );
        }

        // Check if email already exists
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return NextResponse.json(
                { error: "Email already registered" },
                { status: 400 }
            );
        }

        // Hash password
        const password_hash = await bcrypt.hash(password, 10);

        // Create user with admin role
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password_hash,
                contact_no: contact_no || null,
                role: "admin",
            }
        });

        // Create admin record
        await prisma.admin.create({
            data: {
                user_id: user.id,
            }
        });

        return NextResponse.json({
            success: true,
            message: "Admin registered successfully",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            }
        });

    } catch (error) {
        console.error("Error registering admin:", error);
        return NextResponse.json(
            { error: "Failed to register admin" },
            { status: 500 }
        );
    }
}
