import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function rateMentor(data: {
    mentorId: string;
    score: number;
    review?: string;
}) {
    const session = await getSession();
    if (!session || !session.user) throw new Error("Unauthorized");
    const user = session.user;

    const rating = await db.rating.upsert({
        where: {
            mentorId_menteeId: {
                mentorId: data.mentorId,
                menteeId: user.id,
            },
        },
        update: {
            score: data.score,
            review: data.review,
        },
        create: {
            mentorId: data.mentorId,
            menteeId: user.id,
            score: data.score,
            review: data.review,
        },
    });

    revalidatePath(`/dashboard/communities`); // Or wherever mentor profiles are
    return rating;
}

export async function getMentorAverageRating(mentorId: string) {
    const aggregate = await db.rating.aggregate({
        where: { mentorId },
        _avg: {
            score: true,
        },
        _count: true,
    });

    return {
        average: aggregate._avg.score || 0,
        count: aggregate._count,
    };
}
