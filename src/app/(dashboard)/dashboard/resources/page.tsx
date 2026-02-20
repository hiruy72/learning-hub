import { syncUser } from "@/actions/user";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
    ArrowLeft,
    FileText,
    Link as LinkIcon,
    StickyNote,
    Upload,
    ExternalLink,
} from "lucide-react";

export default async function ResourcesPage() {
    const user = await syncUser();
    if (!user) redirect("/sign-in");

    // Fetch resources from user's communities
    const memberCommunityIds = await db.communityMember.findMany({
        where: { userId: user.id },
        select: { communityId: true },
    });

    const resources = await db.resource.findMany({
        where: {
            communityId: { in: memberCommunityIds.map((m) => m.communityId) },
        },
        include: {
            community: { select: { title: true } },
        },
        orderBy: { createdAt: "desc" },
    });

    const isMentorOrAdmin = user.role === "MENTOR" || user.role === "ADMIN";

    const typeIcon: Record<string, typeof FileText> = {
        PDF: FileText,
        LINK: LinkIcon,
        NOTE: StickyNote,
    };

    return (
        <div className="container mx-auto px-4 py-12">
            <Link
                href="/dashboard"
                className="flex items-center gap-2 text-gray-400 hover:text-white mb-12 uppercase text-[10px] font-bold tracking-[0.3em] transition-colors"
            >
                <ArrowLeft className="h-3 w-3" /> Back to Dashboard
            </Link>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight uppercase">
                        Resources
                    </h1>
                    <p className="text-gray-400 uppercase text-xs tracking-[0.2em] mt-2">
                        Study materials from your communities
                    </p>
                </div>

                {isMentorOrAdmin && (
                    <Link href="/dashboard/resources/upload">
                        <Button className="bg-white text-black hover:bg-gray-200 uppercase font-bold tracking-widest rounded-none">
                            <Upload className="mr-2 h-4 w-4" /> Upload Resource
                        </Button>
                    </Link>
                )}
            </div>

            {resources.length === 0 ? (
                <div className="text-center py-24 border border-dashed border-white/10 rounded-none">
                    <FileText className="h-10 w-10 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-400 uppercase tracking-widest text-sm font-bold">
                        No resources available
                    </p>
                    <p className="text-gray-500 text-xs mt-2 uppercase tracking-widest font-bold">
                        Join a community to access shared resources.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {resources.map((resource) => {
                        const Icon = typeIcon[resource.type] || FileText;
                        return (
                            <div
                                key={resource.id}
                                className="bg-black border border-white/10 rounded-none p-8 hover:border-white/30 transition-all duration-300 group"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="h-10 w-10 rounded-none bg-white/5 flex items-center justify-center border border-white/10">
                                        <Icon className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors" />
                                    </div>
                                    <span className="text-[10px] font-bold bg-black text-gray-400 px-2 py-1 rounded-none uppercase tracking-widest border border-white/10">
                                        {resource.type}
                                    </span>
                                </div>

                                <h3 className="text-lg font-bold uppercase mb-2">
                                    {resource.title}
                                </h3>
                                {resource.description && (
                                    <p className="text-gray-400 text-xs uppercase tracking-wider line-clamp-2 mb-4">
                                        {resource.description}
                                    </p>
                                )}

                                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                    <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">
                                        {resource.community.title}
                                    </span>
                                    {(resource.link || resource.fileUrl) && (
                                        <a
                                            href={resource.link || resource.fileUrl || "#"}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-1 text-[10px] text-gray-400 hover:text-white uppercase tracking-widest font-bold transition-colors"
                                        >
                                            Open <ExternalLink className="h-3 w-3" />
                                        </a>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
