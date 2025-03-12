import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import redis from "@/lib/redis";
import { getToken } from "next-auth/jwt";


export async function GET(req, { params }) {
    try {
        const { id } = await params;

        const task = await prisma.task.findUnique({ where: { id } });

        if (!task) {
            return NextResponse.json({ success: false, message: "Task not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, task });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// Fix the PUT handler
export async function PUT(req, context) {
    const token = await getToken({req, secret: process.env.NEXTAUTH_SECRET});
    if (!token) {
        return NextResponse.json({error: "Unauthorized"}, {status: 401})
    }
    
    try {
        const {completed} = await req.json();
        // Get the params from context
        const params = await context.params;
        const taskId = params.id;

        const task = await prisma.task.findUnique({
            where: {id: taskId}
        })

        if (!task || task.userId !== token.user.id) {
            return NextResponse.json({error: "Not authorized to update task"}, {status: 401})
        }

        const updatedTask = await prisma.task.update({
            where: {id: taskId},
            data: {completed},
        })
        await redis.del("tasks");
        return NextResponse.json({success: true, updatedTask})
    } catch (error) {
        return NextResponse.json({success: false, message: error.message}, {status: 500})
    }
}

// Fix the DELETE handler
export async function DELETE(req, context) {
    const token = await getToken({req, secret: process.env.NEXTAUTH_SECRET});
    if (!token) {
        return NextResponse.json({error: "Unauthorized"}, {status: 401});
    }
    
    try {
        // Get the params from context
        const params = await context.params;
        const taskId = params.id;
        
        const task = await prisma.task.findUnique({
            where: {id: taskId}
        })
        
        if (!task || task.userId !== token.user.id) {
            return NextResponse.json({error: "Not authorized to delete this task"}, {status: 401})
        }
        
        await prisma.task.delete({
            where: {id: taskId}
        });
        
        await redis.del("tasks");
        return NextResponse.json({success: true, message: "Task Deleted Successfully!"})
    } catch (error) {
        return NextResponse.json({success: false, message: error.message}, {status: 500})
    }
}