"use server";

import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function getNotifications() {
    const session = await getSession();
    if (!session || !session.user) throw new Error("Unauthorized");
    const userId = session.user.id;

    return await db.notification.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 50,
    });
}

export async function getUnreadNotificationCount() {
    const session = await getSession();
    if (!session || !session.user) return 0;
    const userId = session.user.id;

    return await db.notification.count({
        where: { userId, seen: false },
    });
}

export async function markNotificationAsRead(notificationId: string) {
    const session = await getSession();
    if (!session || !session.user) throw new Error("Unauthorized");
    const userId = session.user.id;

    const notification = await db.notification.findFirst({
        where: { id: notificationId, userId },
    });

    if (!notification) throw new Error("Notification not found");

    await db.notification.update({
        where: { id: notificationId },
        data: { seen: true },
    });

    revalidatePath("/dashboard");
    return { success: true };
}

export async function markAllNotificationsAsRead() {
    const session = await getSession();
    if (!session || !session.user) throw new Error("Unauthorized");
    const userId = session.user.id;

    await db.notification.updateMany({
        where: { userId, seen: false },
        data: { seen: true },
    });

    revalidatePath("/dashboard");
    return { success: true };
}

export async function createNotification(data: {
    userId: string;
    title: string;
    message: string;
    type: string;
    link?: string;
}) {
    return await db.notification.create({
        data,
    });
}

export async function deleteNotification(notificationId: string) {
    const session = await getSession();
    if (!session || !session.user) throw new Error("Unauthorized");
    const userId = session.user.id;

    const notification = await db.notification.findFirst({
        where: { id: notificationId, userId },
    });

    if (!notification) throw new Error("Notification not found");

    await db.notification.delete({
        where: { id: notificationId },
    });

    revalidatePath("/dashboard");
    return { success: true };
}

// Helper function to send notifications to multiple users
export async function notifyUsers(
    userIds: string[],
    data: { title: string; message: string; type: string; link?: string }
) {
    await db.notification.createMany({
        data: userIds.map((userId) => ({
            userId,
            ...data,
        })),
    });
}

// Notification types for reference:
// - MESSAGE: New message received
// - RESOURCE: New resource uploaded
// - EXAM: New exam created or exam results
// - BLOG: New blog post or comment
// - COMMUNITY: Community updates (new member, etc.)
// - RATING: New rating received
// - APPLICATION: Mentor application status update
// - SYSTEM: System notifications
