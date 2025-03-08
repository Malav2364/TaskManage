import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import redis from "@/lib/redis";


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

export async function PUT(req, { params }){
    try {
        const {id} = await params
        const body = await req.json();

        const updatedTask = await prisma.task.update({
            where : {id},
            data : body
        })
        await redis.del("tasks");
        return NextResponse.json({success : true, updatedTask})
    } catch (error) {
        return NextResponse.json({success : false, message : error.message}, {status : 500})
    }
}

export async function DELETE(req, { params }){
    try {
        const {id} = params
        await prisma.task.delete({
            where : {id}
        });
        await redis.del("tasks");
        return NextResponse.json({success : true, message : "Task Deleted Successfully !"})
    } catch (error) {
        return NextResponse.json({success : false, message : error.message}, {status : 500})
    }
}