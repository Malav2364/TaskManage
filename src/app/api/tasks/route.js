import prisma from "@/lib/prisma";
import {NextResponse} from "next/server";
import redis from "@/lib/redis";

export async function POST(req) {
    try {
        const {title,description} = await req.json()

        const newTask = await prisma.task.create({
            data : {title, description}
        })

        await redis.del("tasks");

        return NextResponse.json({success : true, task : newTask}, {status : 201})
    } catch (error) {
        return NextResponse.json({success : false, message : error.message}, {status : 500})
    }
}

export async function GET() {
    try {
        const cachedTasks = await redis.get("tasks");
        if (cachedTasks) {
            console.log("Serving from Redis Cache")
            return NextResponse.json(JSON.parse(cachedTasks))
        }
        const tasks = await prisma.task.findMany();
        await redis.set("tasks", JSON.stringify(tasks), "EX", 60)
        console.log("Serving from Postgresql")
        return NextResponse.json(tasks)
    } catch (error) {
        return NextResponse.json({success : false, message : error.message}, {status : 500})
    }
}