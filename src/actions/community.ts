"use server";

import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function createCommunity(formData: {
    title: string;
    description: string;
    department: string;
    meetLink?: string;
}) {
    const session = await getSession();
    if (!session || !session.user) throw new Error("Unauthorized");
    const user = session.user;

    const dbUser = await db.user.findUnique({ where: { id: user.id } });
    if (dbUser?.role !== "MENTOR" && dbUser?.role !== "ADMIN") {
        throw new Error("Only mentors can create communities");
    }

    const community = await db.community.create({
        data: {
            ...formData,
            mentorId: user.id,
        },
    });

    // Auto join as member
    await db.communityMember.create({
        data: {
            userId: user.id,
            communityId: community.id,
        },
    });

    revalidatePath("/dashboard/communities");
    return community;
}

export async function joinCommunity(communityId: string) {
    const session = await getSession();
    if (!session || !session.user) throw new Error("Unauthorized");
    const user = session.user;

    const membership = await db.communityMember.create({
        data: {
            userId: user.id,
            communityId,
        },
    });

    revalidatePath(`/dashboard/communities/${communityId}`);
    return membership;
}

export async function getCommunities() {
    return await db.community.findMany({
        include: {
            mentor: true,
            _count: {
                select: { members: true },
            },
        },
        orderBy: { createdAt: "desc" },
    });
}

export async function getCommunityById(id: string) {
    const session = await getSession();
    if (!session || !session.user) throw new Error("Unauthorized");
    const user = session.user;

    const community = await db.community.findUnique({
        where: { id },
        include: {
            mentor: true,
            members: {
                include: { user: true },
            },
            resources: true,
            exams: true,
        },
    });

    if (!community) return null;

    const isMember = await db.communityMember.findUnique({
        where: {
            userId_communityId: {
                userId: user.id,
                communityId: id,
            },
        },
    });

    return { ...community, isMember: !!isMember };
}
