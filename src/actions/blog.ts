"use server";

import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function createBlog(formData: {
    title: string;
    content: string;
    imageUrl?: string;
    tags?: string[];
}) {
    const session = await getSession();
    if (!session || !session.user) throw new Error("Unauthorized");
    const user = session.user;

    const dbUser = await db.user.findUnique({ where: { id: user.id } });
    if (dbUser?.role !== "MENTOR" && dbUser?.role !== "ADMIN") {
        throw new Error("Only mentors/admins can post blogs");
    }

    const blog = await db.blog.create({
        data: {
            ...formData,
            authorId: user.id,
        },
    });

    revalidatePath("/blogs");
    return blog;
}

export async function getBlogs(search?: string, tag?: string) {
    return await db.blog.findMany({
        where: {
            AND: [
                search ? {
                    OR: [
                        { title: { contains: search, mode: "insensitive" } },
                        { content: { contains: search, mode: "insensitive" } },
                    ]
                } : {},
                tag ? { tags: { has: tag } } : {},
            ]
        },
        include: {
            author: true,
            _count: {
                select: { comments: true, likes: true }
            }
        },
        orderBy: { createdAt: "desc" },
    });
}

export async function getBlogById(id: string) {
    return await db.blog.findUnique({
        where: { id },
        include: {
            author: true,
            comments: {
                include: { author: true },
                orderBy: { createdAt: "desc" }
            },
            likes: true,
            _count: {
                select: { likes: true }
            }
        }
    });
}

export async function toggleLikeBlog(blogId: string) {
    const session = await getSession();
    if (!session || !session.user) throw new Error("Unauthorized");
    const userId = session.user.id;

    const existingLike = await db.like.findUnique({
        where: {
            blogId_userId: { blogId, userId }
        }
    });

    if (existingLike) {
        await db.like.delete({
            where: { id: existingLike.id }
        });
    } else {
        await db.like.create({
            data: { blogId, userId }
        });
    }

    revalidatePath(`/blogs/${blogId}`);
    revalidatePath("/blogs");
}
