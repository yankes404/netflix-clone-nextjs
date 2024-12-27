"use server";

import { NextRequest, NextResponse } from "next/server";

import { getDynamicFile } from "./action";

interface Props {
    params: Promise<{ type: string; id: string }>;
}

export const GET = async(_: NextRequest, { params }: Props) => {
    try {
        const { id, type } = await params;

        if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });
        if (type !== "images" && type !== "videos") return NextResponse.json({ error: "Invalid type" }, { status: 400 });

        const { error, successFile, status } = await getDynamicFile({
            id,
            type
        });

        if (error) {
            return NextResponse.json({ error }, { status: status ?? 500 });
        }
        
        if (successFile) {
            const headers = new Headers();
            
            headers.set("Content-Type", successFile.contentType);

            return new NextResponse(successFile.buffer, { headers });
        } else {
            return NextResponse.json({ error: "File not found" }, { status: 404 });
        }
    } catch (error) {
        console.error("[ROUTE] Error while getting dynamic file",error);

        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}