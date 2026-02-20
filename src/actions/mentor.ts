"use server";

import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function submitMentorApplication(formData: {
    bio: string;
    department: string;
    year: string;
    motivation: string;
    gradeReportLink: string;
    nationalIdLink: string;
}) {
    const session = await getSession();

    if (!session || !session.user) throw new Error("Unauthorized");
    const user = session.user;

    // Ensure user exists in DB
    const dbUser = await db.user.findUnique({ where: { id: user.id } });
    if (!dbUser) throw new Error("User not found in database");

    const application = await db.mentorApplication.create({
        data: {
            userId: user.id,
            bio: formData.bio,
            department: formData.department,
            year: formData.year,
            motivation: formData.motivation,
            gradeReportLink: formData.gradeReportLink,
            nationalIdLink: formData.nationalIdLink,
        },
    });

    revalidatePath("/dashboard");
    return application;
}

export async function getPendingApplications() {
    const session = await getSession();
    if (!session || !session.user) throw new Error("Unauthorized");
    const user = session.user;

    const dbUser = await db.user.findUnique({ where: { id: user.id } });
    if (dbUser?.role !== "ADMIN") throw new Error("Forbidden");

    return await db.mentorApplication.findMany({
        where: { status: "PENDING" },
        include: {
            user: true,
        },
        orderBy: { createdAt: "desc" },
    });
}

export async function updateApplicationStatus(id: string, status: "APPROVED" | "REJECTED") {
    const session = await getSession();
    if (!session || !session.user) throw new Error("Unauthorized");
    const user = session.user;

    const dbUser = await db.user.findUnique({ where: { id: user.id } });
    if (dbUser?.role !== "ADMIN") throw new Error("Forbidden");

    const application = await db.mentorApplication.update({
        where: { id },
        data: { status },
        include: { user: true },
    });

    if (status === "APPROVED") {
        await db.user.update({
            where: { id: application.userId },
            data: { role: "MENTOR" },
        });
    }

    revalidatePath("/dashboard/admin");
    return application;
}
