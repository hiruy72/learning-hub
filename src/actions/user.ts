"use server";

import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

import { revalidatePath } from "next/cache";

export async function syncUser() {
    const session = await getSession();

    if (!session || !session.user) return null;

    const existingUser = await db.user.findUnique({
        where: { id: session.user.id },
    });

    return existingUser;
}

export async function getCurrentUserRole() {
    const session = await getSession();
    if (!session || !session.user) return null;

    return session.user.role || "MENTEE";
}

export async function getCurrentUser() {
    const session = await getSession();
    if (!session || !session.user) return null;

    return db.user.findUnique({
        where: { id: session.user.id }
    });
}

export async function updateUserProfile(data: {
    name?: string;
    bio?: string;
    department?: string;
    year?: string;
    imageUrl?: string;
}) {
    const session = await getSession();
    if (!session || !session.user) throw new Error("Unauthorized");

    const updatedUser = await db.user.update({
        where: { id: session.user.id },
        data,
    });

    revalidatePath("/dashboard/profile");
    revalidatePath("/dashboard");
    return updatedUser;
}
