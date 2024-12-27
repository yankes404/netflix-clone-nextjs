"use server";

import fs from "fs";
import path from "path";

import { auth } from "@/auth";

interface Props {
    id: string;
    type: "images" | "videos";
}

interface Response {
    successFile?: {
        contentType: "image/webp" | "video/mp4";
        buffer: Buffer;
    };
    error?: string;
    status?: number;
}

export const getDynamicFile = async({
    id,
    type
}: Props): Promise<Response> => {
    const session = await auth();

    if (!session || !session.user) {
        return { error: "Unauthorized", status: 401 };
    }
    
    if (!session.user.isSubscribed) {
        return { error: "Unauthorized", status: 401 };
    }

    const filePath = path.join(process.cwd(), "secured_files", type, id);

    if (!fs.existsSync(filePath)) {
        return { error: "File not found", status: 404 };
    }

    try {
        const fileContent = fs.readFileSync(filePath);

        return {
            successFile: {
                contentType: type === "images" ? "image/webp" : "video/mp4",
                buffer: fileContent
            }
        }
    } catch (error) {
        if (process.env.NODE_ENV !== "production") {
            console.error(error);
        }

        return { error: "Internal server error", status: 500 };
    }
}