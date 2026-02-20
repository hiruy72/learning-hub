import { getBlogs } from "@/actions/blog";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { Search, Tag, MessageSquare, Heart } from "lucide-react";
import Image from "next/image";

export default async function BlogsPage(props: {
    searchParams: Promise<{ search?: string; tag?: string }>;
}) {
    const searchParams = await props.searchParams;
    const blogs = await getBlogs(searchParams.search, searchParams.tag);

    return (
        <div className="container mx-auto px-4 py-24">
            <div className="text-center mb-16">
                <h1 className="text-6xl font-bold tracking-tighter uppercase mb-4">The Journal</h1>
                <p className="text-gray-500 uppercase tracking-[0.3em] text-sm">Insights, Stories, and Academic Excellence</p>
            </div>

            {/* Search & Filter Bar */}
            <div className="flex flex-col md:flex-row gap-4 mb-16">
                <div className="relative flex-grow">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <input
                        type="text"
                        placeholder="SEARCH ARTICLES..."
                        className="w-full bg-black border border-white/10 rounded-none py-4 pl-12 pr-6 text-sm uppercase tracking-widest focus:outline-none focus:border-white transition-colors"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                {blogs.map((blog: any) => (
                    <article key={blog.id} className="group flex flex-col gap-6">
                        <Link href={`/blogs/${blog.id}`} className="relative aspect-[16/9] overflow-hidden grayscale hover:grayscale-0 transition-all duration-700 border border-white/10 rounded-none">
                            {blog.imageUrl ? (
                                <Image
                                    src={blog.imageUrl}
                                    alt={blog.title}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                            ) : (
                                <div className="w-full h-full bg-zinc-900 flex items-center justify-center">
                                    <span className="text-gray-800 text-6xl font-black">BLOG</span>
                                </div>
                            )}
                        </Link>

                        <div className="space-y-4">
                            <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">
                                <span>{formatDate(blog.createdAt)}</span>
                                <span className="h-1 w-1 bg-gray-500 rounded-none" />
                                <span>{blog.author.name}</span>
                            </div>

                            <Link href={`/blogs/${blog.id}`}>
                                <h2 className="text-3xl font-bold leading-tight group-hover:underline underline-offset-8 transition-all">
                                    {blog.title}
                                </h2>
                            </Link>

                            <p className="text-gray-500 line-clamp-3 leading-loose uppercase text-sm tracking-wider">
                                {blog.content.substring(0, 150)}...
                            </p>

                            <div className="flex items-center justify-between pt-4 border-t border-white/10">
                                <div className="flex gap-2">
                                    {blog.tags.map((tag: any) => (
                                        <span key={tag} className="text-[10px] bg-white text-black px-2 py-0.5 rounded-none font-bold uppercase tracking-widest">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                                <div className="flex gap-4 text-gray-500">
                                    <div className="flex items-center gap-1 text-[10px] font-bold">
                                        <Heart className="h-3 w-3" /> {blog._count.likes}
                                    </div>
                                    <div className="flex items-center gap-1 text-[10px] font-bold">
                                        <MessageSquare className="h-3 w-3" /> {blog._count.comments}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </article>
                ))}

                {blogs.length === 0 && (
                    <div className="col-span-full text-center py-32 border border-dashed border-white/10 rounded-none">
                        <p className="text-gray-500 uppercase tracking-[0.3em]">No articles found</p>
                    </div>
                )}
            </div>
        </div>
    );
}
