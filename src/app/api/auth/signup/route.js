import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const body = await req.json();
        const {email, password} = body;

        const existingUser = await prisma.user.findUnique({
            where : {email}
        });
        if (existingUser) {
            return NextResponse.json({success : false, message : "User Already Exists"}, {status : 400})
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser =await prisma.user.create({
            data : {email, hashedPassword},
        });
        return NextResponse.json({success : true, user : newUser}, {status : 201})
    } catch (error) {
return NextResponse.json({success : false, message : error.message},{status : 500})
    }
}