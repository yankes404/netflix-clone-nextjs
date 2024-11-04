import { saveWatchTime } from "@/features/tracks/actions";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (
    req: NextRequest,
    { params }: { params: { trackId: string } }
) => {
    try {
        const body = await req.json();
        const { episodeId, time } = body;

        if (typeof time !== "number") {
            return NextResponse.json({ error: "time must be number" }, { status: 400 });
        }

        if (episodeId && typeof episodeId !== "string") {
            return NextResponse.json({ error: "episodeId must be string or undefinded" }, { status: 400 });
        }

        const { error } = await saveWatchTime({
            trackId: params.trackId,
            episodeId,
            time
        });

        if (error) {
            return NextResponse.json({ error }, { status: 500 });
        }
    
        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}