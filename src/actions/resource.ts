import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function uploadResource(formData: {
    title: string;
    description?: string;
    fileUrl?: string;
    link?: string;
    type: string;
    communityId: string;
}) {
    const session = await getSession();
    if (!session || !session.user) throw new Error("Unauthorized");
    const user = session.user;

    const dbUser = await db.user.findUnique({ where: { id: user.id } });
    if (dbUser?.role !== "MENTOR" && dbUser?.role !== "ADMIN") {
        throw new Error("Only mentors can upload resources");
    }

    const resource = await db.resource.create({
        data: {
            ...formData,
            uploaderId: user.id,
        },
    });

    revalidatePath(`/dashboard/communities/${formData.communityId}`);
    return resource;
}

export async function getResources(communityId: string) {
    return await db.resource.findMany({
        where: { communityId },
        orderBy: { createdAt: "desc" },
    });
}
