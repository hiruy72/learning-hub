"use server";

import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

// ============ GROUP CHAT (Community Messages) ============

export async function sendCommunityMessage(data: {
    communityId: string;
    content: string;
}) {
    const session = await getSession();
    if (!session || !session.user) throw new Error("Unauthorized");
    const userId = session.user.id;

    // Verify user is a member of the community
    const membership = await db.communityMember.findUnique({
        where: {
            userId_communityId: {
                userId,
                communityId: data.communityId,
            },
        },
    });

    if (!membership) throw new Error("You must be a member of this community");

    const message = await db.message.create({
        data: {
            content: data.content,
            senderId: userId,
            communityId: data.communityId,
        },
        include: {
            sender: {
                select: { id: true, name: true, imageUrl: true, role: true },
            },
        },
    });

    revalidatePath(`/dashboard/communities/${data.communityId}`);
    return message;
}

export async function getCommunityMessages(communityId: string) {
    const session = await getSession();
    if (!session || !session.user) throw new Error("Unauthorized");

    return await db.message.findMany({
        where: { communityId },
        include: {
            sender: {
                select: { id: true, name: true, imageUrl: true, role: true },
            },
        },
        orderBy: { createdAt: "asc" },
    });
}

// ============ PRIVATE CHAT (Direct Messages) ============

export async function getOrCreateConversation(otherUserId: string) {
    const session = await getSession();
    if (!session || !session.user) throw new Error("Unauthorized");
    const userId = session.user.id;

    if (userId === otherUserId) throw new Error("Cannot message yourself");

    // Find existing conversation
    const existingConversation = await db.conversation.findFirst({
        where: {
            AND: [
                { participants: { some: { userId } } },
                { participants: { some: { userId: otherUserId } } },
            ],
        },
        include: {
            participants: {
                include: { user: { select: { id: true, name: true, imageUrl: true, role: true } } },
            },
        },
    });

    if (existingConversation) return existingConversation;

    // Create new conversation
    const newConversation = await db.conversation.create({
        data: {
            participants: {
                create: [
                    { userId },
                    { userId: otherUserId },
                ],
            },
        },
        include: {
            participants: {
                include: { user: { select: { id: true, name: true, imageUrl: true, role: true } } },
            },
        },
    });

    return newConversation;
}

export async function sendDirectMessage(data: {
    conversationId: string;
    content: string;
}) {
    const session = await getSession();
    if (!session || !session.user) throw new Error("Unauthorized");
    const userId = session.user.id;

    // Verify user is a participant
    const participant = await db.conversationParticipant.findUnique({
        where: {
            userId_conversationId: {
                userId,
                conversationId: data.conversationId,
            },
        },
    });

    if (!participant) throw new Error("Not a participant of this conversation");

    const message = await db.directMessage.create({
        data: {
            content: data.content,
            senderId: userId,
            conversationId: data.conversationId,
        },
        include: {
            sender: {
                select: { id: true, name: true, imageUrl: true, role: true },
            },
        },
    });

    // Update conversation timestamp
    await db.conversation.update({
        where: { id: data.conversationId },
        data: { updatedAt: new Date() },
    });

    // Create notification for other participants
    const conversation = await db.conversation.findUnique({
        where: { id: data.conversationId },
        include: { participants: true },
    });

    if (conversation) {
        const otherParticipants = conversation.participants.filter(p => p.userId !== userId);
        for (const p of otherParticipants) {
            await db.notification.create({
                data: {
                    userId: p.userId,
                    title: "New Message",
                    message: `${session.user.name || "Someone"} sent you a message`,
                    type: "MESSAGE",
                    link: `/dashboard/chat?conversation=${data.conversationId}`,
                },
            });
        }
    }

    revalidatePath("/dashboard/chat");
    return message;
}

export async function getDirectMessages(conversationId: string) {
    const session = await getSession();
    if (!session || !session.user) throw new Error("Unauthorized");
    const userId = session.user.id;

    // Verify user is a participant
    const participant = await db.conversationParticipant.findUnique({
        where: {
            userId_conversationId: {
                userId,
                conversationId,
            },
        },
    });

    if (!participant) throw new Error("Not a participant");

    // Update last read
    await db.conversationParticipant.update({
        where: { id: participant.id },
        data: { lastReadAt: new Date() },
    });

    return await db.directMessage.findMany({
        where: { conversationId },
        include: {
            sender: {
                select: { id: true, name: true, imageUrl: true, role: true },
            },
        },
        orderBy: { createdAt: "asc" },
    });
}

export async function getUserConversations() {
    const session = await getSession();
    if (!session || !session.user) throw new Error("Unauthorized");
    const userId = session.user.id;

    const conversations = await db.conversation.findMany({
        where: {
            participants: { some: { userId } },
        },
        include: {
            participants: {
                include: {
                    user: {
                        select: { id: true, name: true, imageUrl: true, role: true },
                    },
                },
            },
            messages: {
                orderBy: { createdAt: "desc" },
                take: 1,
            },
        },
        orderBy: { updatedAt: "desc" },
    });

    return conversations.map(conv => {
        const otherParticipant = conv.participants.find(p => p.userId !== userId);
        const lastMessage = conv.messages[0];
        const currentUserParticipant = conv.participants.find(p => p.userId === userId);
        const hasUnread = lastMessage &&
            currentUserParticipant &&
            lastMessage.createdAt > currentUserParticipant.lastReadAt &&
            lastMessage.senderId !== userId;

        return {
            ...conv,
            otherUser: otherParticipant?.user,
            lastMessage,
            hasUnread,
        };
    });
}

export async function getAvailableUsers() {
    const session = await getSession();
    if (!session || !session.user) throw new Error("Unauthorized");
    const userId = session.user.id;

    // Get users that the current user can message (community members, mentors, etc.)
    const users = await db.user.findMany({
        where: {
            id: { not: userId },
        },
        select: {
            id: true,
            name: true,
            imageUrl: true,
            role: true,
            department: true,
        },
        orderBy: { name: "asc" },
    });

    return users;
}

export async function getUserJoinedCommunities() {
    const session = await getSession();
    if (!session || !session.user) throw new Error("Unauthorized");
    const userId = session.user.id;

    return await db.community.findMany({
        where: {
            members: { some: { userId } },
        },
        include: {
            mentor: { select: { id: true, name: true } },
            _count: { select: { members: true, messages: true } },
        },
    });
}

// ============ COMMUNITY MANAGEMENT ============

export async function createCommunity(data: {
    title: string;
    description: string;
    department: string;
}) {
    const session = await getSession();
    if (!session || !session.user || session.user.role !== "MENTOR") {
        throw new Error("Only mentors can create communities");
    }
    const userId = session.user.id;

    const community = await db.community.create({
        data: {
            title: data.title,
            description: data.description,
            department: data.department,
            mentorId: userId,
            members: {
                create: {
                    userId,
                },
            },
        },
    });

    revalidatePath("/dashboard/chat");
    return community;
}

export async function joinCommunity(communityId: string) {
    const session = await getSession();
    if (!session || !session.user) throw new Error("Unauthorized");
    const userId = session.user.id;

    const membership = await db.communityMember.create({
        data: {
            userId,
            communityId,
        },
    });

    revalidatePath("/dashboard/chat");
    return membership;
}

export async function getAvailableCommunities() {
    const session = await getSession();
    if (!session || !session.user) throw new Error("Unauthorized");
    const userId = session.user.id;

    // Communities the user is NOT a member of
    return await db.community.findMany({
        where: {
            members: {
                none: {
                    userId,
                },
            },
        },
        include: {
            mentor: { select: { name: true } },
            _count: { select: { members: true } },
        },
    });
}
