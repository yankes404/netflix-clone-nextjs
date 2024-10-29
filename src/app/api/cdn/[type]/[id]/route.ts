import { NextRequest, NextResponse } from "next/server";

import fs from "fs";
import path from "path";
import { getUserSubscription } from "@/features/subscriptions/utils";
import { auth } from "@/auth";

export const GET = async(_: NextRequest, { params }: { params: { type: string; id: string } }) => {
    const session = await auth();
    if (!session || !session.user) {
        return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 }
        );
    }
    
    const isSubscribed = !!(await getUserSubscription(session.user.id));
    if (!isSubscribed) {
        return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 }
        );
    }

    const { type, id } = params;

    const filePath = path.join(process.cwd(), "public", type, id);
    console.log(filePath)

    if (!fs.existsSync(filePath)) {
        return NextResponse.json(
            { error: "File not found" },
            { status: 404 }
        );
    }

    try {
        const fileContent = fs.readFileSync(filePath);

        const headers = new Headers();
        if (type === "images") {
            headers.set("Content-Type", "image/webp");
        } else if (type === "videos") {
            headers.set("Content-Type", "video/mp4");
        } else {
            return NextResponse.json(
                { error: "Invalid type parameter, must be 'images' or 'videos'" },
                { status: 400 }
            );
        }

        return new NextResponse(fileContent, { headers });
    } catch (error) {
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}