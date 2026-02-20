import { getBlogById } from "@/actions/blog";
import { getSession } from "@/lib/auth";
import { formatDate } from "@/lib/utils";
import { ArrowLeft, MessageSquare, Share2, Tag } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { LikeButton } from "@/components/blog/LikeButton";

export default async function BlogDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const blog = await getBlogById(id);
    const session = await getSession();

    if (!blog) notFound();

    const isLiked = blog.likes.some(like => like.userId === session?.user?.id);

    return (
        <div className="container mx-auto px-4 py-24 max-w-4xl">
            <Link
                href="/blogs"
                className="flex items-center gap-2 text-gray-500 hover:text-white mb-12 uppercase text-[10px] font-bold tracking-[0.3em] transition-colors group"
            >
                <ArrowLeft className="h-3 w-3 group-hover:-translate-x-1 transition-transform" /> Back to Journal
            </Link>

            <article className="space-y-16">
                {/* Meta Header */}
                <div className="space-y-8">
                    <div className="flex flex-wrap gap-2">
                        {blog.tags.map((tag) => (
                            <span
                                key={tag}
                                className="text-[10px] bg-white text-black px-3 py-1 rounded-none font-bold uppercase tracking-widest"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>

                    <h1 className="text-5xl md:text-8xl font-black tracking-tight leading-[0.9] uppercase">
                        {blog.title}
                    </h1>

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 border-y border-white/10 py-10">
                        <div className="flex items-center gap-5">
                            <div className="h-14 w-14 rounded-none bg-black border border-white/20 flex items-center justify-center font-black overflow-hidden relative">
                                {blog.author.imageUrl ? (
                                    <Image
                                        src={blog.author.imageUrl}
                                        alt={blog.author.name || "Author"}
                                        fill
                                        className="object-cover grayscale"
                                    />
                                ) : (
                                    <span className="text-xl text-gray-500">{blog.author.name?.charAt(0)}</span>
                                )}
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] mb-1">Written by</p>
                                <p className="text-lg font-black uppercase tracking-tight">{blog.author.name}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-8">
                            <div className="hidden md:block text-right">
                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] mb-1">Published</p>
                                <p className="text-sm font-bold uppercase">{formatDate(blog.createdAt)}</p>
                            </div>
                            <div className="h-10 w-px bg-white/10 hidden md:block" />
                            <div className="flex items-center gap-4">
                                <LikeButton
                                    blogId={blog.id}
                                    initialLikes={blog._count.likes}
                                    initialIsLiked={isLiked}
                                />
                                <Button variant="ghost" size="icon" className="text-gray-500 hover:text-white hover:bg-white/5 rounded-none">
                                    <Share2 className="h-5 w-5" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Hero Image */}
                {blog.imageUrl && (
                    <div className="aspect-[21/9] bg-black border border-white/10 rounded-none overflow-hidden relative">
                        <Image
                            src={blog.imageUrl}
                            alt={blog.title}
                            fill
                            className="object-cover grayscale hover:grayscale-0 transition-all duration-1000"
                        />
                    </div>
                )}

                {/* Content */}
                <div className="prose prose-invert prose-lg max-w-none">
                    <div className="text-gray-300 leading-[1.8] uppercase text-sm tracking-widest space-y-8 whitespace-pre-wrap font-medium">
                        {blog.content}
                    </div>
                </div>

                {/* Footer / Discussion */}
                <div className="pt-24 border-t border-white/10 space-y-12">
                    <div className="flex items-center justify-between">
                        <h3 className="text-3xl font-black uppercase tracking-tighter">Discussion ({blog.comments.length})</h3>
                        <div className="h-px flex-grow mx-8 bg-white/10 hidden md:block" />
                    </div>

                    <div className="space-y-12">
                        {blog.comments.map((comment) => (
                            <div key={comment.id} className="flex gap-6 group">
                                <div className="h-12 w-12 shrink-0 bg-black border border-white/10 rounded-none flex items-center justify-center font-bold text-gray-500 relative overflow-hidden">
                                    {comment.author.imageUrl ? (
                                        <Image src={comment.author.imageUrl} alt={comment.author.name || ""} fill className="object-cover grayscale" />
                                    ) : (
                                        comment.author.name?.charAt(0)
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-3">
                                        <span className="text-[10px] font-black uppercase tracking-widest">{comment.author.name}</span>
                                        <span className="h-1 w-1 bg-white/20 rounded-none" />
                                        <span className="text-[10px] text-gray-500 font-bold uppercase">{formatDate(comment.createdAt)}</span>
                                    </div>
                                    <p className="text-gray-400 text-xs uppercase tracking-wider leading-relaxed">
                                        {comment.content}
                                    </p>
                                </div>
                            </div>
                        ))}

                        {blog.comments.length === 0 && (
                            <div className="py-20 border border-dashed border-white/5 rounded-none text-center">
                                <p className="text-gray-600 uppercase text-[10px] font-bold tracking-[0.3em]">No discussions yet</p>
                            </div>
                        )}

                        {!session && (
                            <div className="bg-white/5 border border-white/10 rounded-none p-12 text-center space-y-6">
                                <MessageSquare className="h-8 w-8 text-gray-500 mx-auto opacity-20" />
                                <p className="text-gray-400 uppercase text-xs tracking-[0.2em] font-bold">Sign in to join the conversation</p>
                                <Link href="/sign-in" className="inline-block">
                                    <Button className="bg-white text-black hover:bg-gray-200 h-12 px-10 uppercase font-black tracking-widest text-[10px] rounded-none">
                                        Sign In
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </article>
        </div>
    );
}

