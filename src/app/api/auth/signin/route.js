import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

// Secret key for JWT (Store it in .env)
const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(req) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Compare hashed password
    const isMatch = await bcrypt.compare(password, user.hashedPassword);
    if (!isMatch) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: "7d" } // Token valid for 7 days
    );

    return NextResponse.json({ message: "Login successful", token, id : user.id, email : user.email}, { status: 200 });
  } catch (error) {
    console.error("Sign-in Error:", error);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
