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

    // Notify all users about new blog post
    const users = await db.user.findMany({
        where: { id: { not: user.id } },
        select: { id: true },
    });

    if (users.length > 0) {
        await db.notification.createMany({
            data: users.map(u => ({
                userId: u.id,
                title: "New Blog Post",
                message: `${dbUser?.name || "A mentor"} published: ${formData.title}`,
                type: "BLOG",
                link: `/blogs/${blog.id}`,
            })),
        });
    }

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

    const blog = await db.blog.findUnique({
        where: { id: blogId },
        select: { authorId: true, title: true },
    });

    if (existingLike) {
        await db.like.delete({
            where: { id: existingLike.id }
        });
    } else {
        await db.like.create({
            data: { blogId, userId }
        });

        // Notify blog author of the like
        if (blog && blog.authorId !== userId) {
            await db.notification.create({
                data: {
                    userId: blog.authorId,
                    title: "New Like",
                    message: `${session.user.name || "Someone"} liked your blog: ${blog.title}`,
                    type: "BLOG",
                    link: `/blogs/${blogId}`,
                },
            });
        }
    }

    revalidatePath(`/blogs/${blogId}`);
    revalidatePath("/blogs");
}

export async function addComment(blogId: string, content: string) {
    const session = await getSession();
    if (!session || !session.user) throw new Error("Unauthorized");
    const userId = session.user.id;

    const comment = await db.comment.create({
        data: {
            blogId,
            authorId: userId,
            content,
        },
        include: {
            author: true,
        },
    });

    // Notify blog author of the comment
    const blog = await db.blog.findUnique({
        where: { id: blogId },
        select: { authorId: true, title: true },
    });

    if (blog && blog.authorId !== userId) {
        await db.notification.create({
            data: {
                userId: blog.authorId,
                title: "New Comment",
                message: `${session.user.name || "Someone"} commented on: ${blog.title}`,
                type: "BLOG",
                link: `/blogs/${blogId}`,
            },
        });
    }

    revalidatePath(`/blogs/${blogId}`);
    return comment;
}

export async function deleteComment(commentId: string) {
    const session = await getSession();
    if (!session || !session.user) throw new Error("Unauthorized");
    const userId = session.user.id;

    const comment = await db.comment.findFirst({
        where: { id: commentId },
        include: { blog: true },
    });

    if (!comment) throw new Error("Comment not found");

    // Only author or blog owner can delete
    const dbUser = await db.user.findUnique({ where: { id: userId } });
    if (comment.authorId !== userId && comment.blog.authorId !== userId && dbUser?.role !== "ADMIN") {
        throw new Error("Unauthorized to delete this comment");
    }

    await db.comment.delete({
        where: { id: commentId },
    });

    revalidatePath(`/blogs/${comment.blogId}`);
    return { success: true };
}
