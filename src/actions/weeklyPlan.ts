"use server";

import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

function getWeekStart(date: Date = new Date()): Date {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day; // Adjust to get Sunday
    d.setDate(diff);
    d.setHours(0, 0, 0, 0);
    return d;
}

export async function getOrCreateWeeklyPlan(weekStart?: Date) {
    const session = await getSession();
    if (!session || !session.user) throw new Error("Unauthorized");
    const userId = session.user.id;

    const targetWeekStart = weekStart || getWeekStart();

    // Try to find existing plan
    let plan = await db.weeklyPlan.findUnique({
        where: {
            userId_weekStart: {
                userId,
                weekStart: targetWeekStart,
            },
        },
        include: {
            tasks: {
                orderBy: [{ dayOfWeek: "asc" }, { createdAt: "asc" }],
            },
        },
    });

    // Create new plan if doesn't exist
    if (!plan) {
        plan = await db.weeklyPlan.create({
            data: {
                userId,
                weekStart: targetWeekStart,
            },
            include: {
                tasks: true,
            },
        });
    }

    return plan;
}

export async function addWeeklyTask(data: {
    weeklyPlanId: string;
    title: string;
    description?: string;
    dayOfWeek: number;
    priority?: string;
}) {
    const session = await getSession();
    if (!session || !session.user) throw new Error("Unauthorized");

    // Verify plan belongs to user
    const plan = await db.weeklyPlan.findFirst({
        where: {
            id: data.weeklyPlanId,
            userId: session.user.id,
        },
    });

    if (!plan) throw new Error("Plan not found");

    const task = await db.weeklyTask.create({
        data: {
            weeklyPlanId: data.weeklyPlanId,
            title: data.title,
            description: data.description,
            dayOfWeek: data.dayOfWeek,
            priority: data.priority || "medium",
        },
    });

    revalidatePath("/dashboard/weekly-plan");
    return task;
}

export async function updateWeeklyTask(
    taskId: string,
    data: {
        title?: string;
        description?: string;
        dayOfWeek?: number;
        completed?: boolean;
        priority?: string;
    }
) {
    const session = await getSession();
    if (!session || !session.user) throw new Error("Unauthorized");

    // Verify task belongs to user
    const task = await db.weeklyTask.findFirst({
        where: {
            id: taskId,
            weeklyPlan: { userId: session.user.id },
        },
    });

    if (!task) throw new Error("Task not found");

    const updatedTask = await db.weeklyTask.update({
        where: { id: taskId },
        data,
    });

    revalidatePath("/dashboard/weekly-plan");
    return updatedTask;
}

export async function toggleTaskComplete(taskId: string) {
    const session = await getSession();
    if (!session || !session.user) throw new Error("Unauthorized");

    const task = await db.weeklyTask.findFirst({
        where: {
            id: taskId,
            weeklyPlan: { userId: session.user.id },
        },
    });

    if (!task) throw new Error("Task not found");

    const updatedTask = await db.weeklyTask.update({
        where: { id: taskId },
        data: { completed: !task.completed },
    });

    revalidatePath("/dashboard/weekly-plan");
    return updatedTask;
}

export async function deleteWeeklyTask(taskId: string) {
    const session = await getSession();
    if (!session || !session.user) throw new Error("Unauthorized");

    const task = await db.weeklyTask.findFirst({
        where: {
            id: taskId,
            weeklyPlan: { userId: session.user.id },
        },
    });

    if (!task) throw new Error("Task not found");

    await db.weeklyTask.delete({
        where: { id: taskId },
    });

    revalidatePath("/dashboard/weekly-plan");
    return { success: true };
}

export async function getWeeklyPlanStats() {
    const session = await getSession();
    if (!session || !session.user) throw new Error("Unauthorized");
    const userId = session.user.id;

    const weekStart = getWeekStart();

    const plan = await db.weeklyPlan.findUnique({
        where: {
            userId_weekStart: {
                userId,
                weekStart,
            },
        },
        include: {
            tasks: true,
        },
    });

    if (!plan) {
        return { total: 0, completed: 0, percentage: 0 };
    }

    const total = plan.tasks.length;
    const completed = plan.tasks.filter((t) => t.completed).length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { total, completed, percentage };
}
