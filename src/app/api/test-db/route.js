import pool from "@/lib/dbconn";
import { NextResponse } from "next/server";


export async function GET() {
    try {
        const result = await pool.query('SELECT NOW()')
        return NextResponse.json({success : true, time : result.rows[0].now})
    } catch (error) {
        return NextResponse.json({success : false, message : error.message}, {status : 500});
    }
}