"use server";

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

    // Verify the user is rating a mentor
    const mentor = await db.user.findFirst({
        where: { id: data.mentorId, role: "MENTOR" },
    });

    if (!mentor) throw new Error("Mentor not found");

    // Check if user has interacted with this mentor (is in one of their communities)
    const hasInteraction = await db.communityMember.findFirst({
        where: {
            userId: user.id,
            community: { mentorId: data.mentorId },
        },
    });

    if (!hasInteraction) {
        throw new Error("You must be in the mentor's community to rate them");
    }

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

    // Notify mentor of the rating
    await db.notification.create({
        data: {
            userId: data.mentorId,
            title: "New Rating",
            message: `${session.user.name || "A mentee"} rated you ${data.score}/5${data.review ? " with a review" : ""}`,
            type: "RATING",
            link: `/dashboard/mentor`,
        },
    });

    revalidatePath(`/dashboard/communities`);
    revalidatePath(`/dashboard/mentor`);
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

export async function getMentorRatings(mentorId: string) {
    return await db.rating.findMany({
        where: { mentorId },
        include: {
            mentee: {
                select: { id: true, name: true, imageUrl: true },
            },
        },
        orderBy: { createdAt: "desc" },
    });
}

export async function getMentorWithRatings(mentorId: string) {
    const mentor = await db.user.findUnique({
        where: { id: mentorId, role: "MENTOR" },
        select: {
            id: true,
            name: true,
            imageUrl: true,
            bio: true,
            department: true,
        },
    });

    if (!mentor) return null;

    const ratings = await getMentorRatings(mentorId);
    const averageRating = await getMentorAverageRating(mentorId);

    return {
        ...mentor,
        ratings,
        averageRating: averageRating.average,
        totalRatings: averageRating.count,
    };
}

export async function getUserRatingForMentor(mentorId: string) {
    const session = await getSession();
    if (!session || !session.user) return null;

    return await db.rating.findUnique({
        where: {
            mentorId_menteeId: {
                mentorId,
                menteeId: session.user.id,
            },
        },
    });
}

export async function getAllMentorsWithRatings() {
    const mentors = await db.user.findMany({
        where: { role: "MENTOR" },
        select: {
            id: true,
            name: true,
            imageUrl: true,
            bio: true,
            department: true,
            receivedRatings: {
                select: { score: true },
            },
            _count: {
                select: { communitiesOwned: true, receivedRatings: true },
            },
        },
    });

    return mentors.map((mentor) => {
        const avgRating =
            mentor.receivedRatings.length > 0
                ? mentor.receivedRatings.reduce((acc, r) => acc + r.score, 0) / mentor.receivedRatings.length
                : 0;

        return {
            id: mentor.id,
            name: mentor.name,
            imageUrl: mentor.imageUrl,
            bio: mentor.bio,
            department: mentor.department,
            averageRating: avgRating,
            totalRatings: mentor._count.receivedRatings,
            totalCommunities: mentor._count.communitiesOwned,
        };
    });
}
