import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import redis from "@/lib/redis";

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(req) {
    try {
        const body = await req.json();
        const { title, description } = body;

        if (!title || !description) {
            return NextResponse.json({ success: false, message: "Title and description are required" }, { status: 400 });
        }

        const authHeader = req.headers.get("authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return NextResponse.json({ success: false, message: "Unauthorized: No token provided" }, { status: 401 });
        }

        const token = authHeader.split(" ")[1];
        let decoded;
        try {
            decoded = jwt.verify(token, JWT_SECRET);
        } catch (error) {
            return NextResponse.json({ success: false, message: "Invalid or expired token" }, { status: 401 });
        }

        const userId = decoded.id;
        if (!userId) {
            return NextResponse.json({ success: false, message: "Invalid token: User ID not found" }, { status: 401 });
        }

        const existingUser = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!existingUser) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        }
        
        const newTask = await prisma.task.create({
            data: { title, description, userId}
        });

        await redis.del(`tasks:${userId}`); // ✅ Clear only this user's tasks cache

        return NextResponse.json({ success: true, task: newTask }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function GET(req) {
    try {
        const authHeader = req.headers.get("authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, JWT_SECRET);
        const userId = decoded.id;

        const cachedTasks = await redis.get(`tasks:${userId}`);
        if (cachedTasks) {
            console.log("Serving from Redis Cache");
            return NextResponse.json(JSON.parse(cachedTasks));
        }

        const tasks = await prisma.task.findMany({
            where: { userId }
        });

        await redis.set(`tasks:${userId}`, JSON.stringify(tasks), "EX", 60);
        console.log("Serving from PostgreSQL");
        return NextResponse.json(tasks);
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
