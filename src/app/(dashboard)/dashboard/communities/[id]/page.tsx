import { getCommunityById, joinCommunity } from "@/actions/community";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import {
    Users,
    Video,
    FileText,
    PenTool,
    MessageCircle,
    Lock,
    ArrowLeft
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import Image from "next/image";

export default async function CommunityDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const community = await getCommunityById(id);

    if (!community) {
        redirect("/dashboard/communities");
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <Link
                href="/dashboard/communities"
                className="flex items-center gap-2 text-gray-500 hover:text-white mb-12 uppercase text-[10px] font-bold tracking-[0.3em] transition-colors"
            >
                <ArrowLeft className="h-3 w-3" /> Back to Communities
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Left Column: Header & Features */}
                <div className="lg:col-span-2 space-y-12">
                    <div>
                        <div className="flex items-center gap-4 mb-4">
                            <span className="text-[10px] font-bold bg-white text-black px-2 py-1 rounded-none uppercase tracking-[0.2em]">
                                {community.department}
                            </span>
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">
                                Created on {formatDate(community.createdAt)}
                            </span>
                        </div>
                        <h1 className="text-5xl font-bold tracking-tighter uppercase mb-6 leading-none">
                            {community.title}
                        </h1>
                        <p className="text-gray-400 text-lg leading-relaxed uppercase tracking-wider max-w-2xl">
                            {community.description}
                        </p>
                    </div>

                    {!community.isMember ? (
                        <div className="bg-zinc-950 border border-white/10 rounded-none p-12 text-center">
                            <Lock className="h-12 w-12 mx-auto mb-6 text-gray-600" />
                            <h2 className="text-2xl font-bold uppercase mb-4">Join this community</h2>
                            <p className="text-gray-500 mb-8 max-w-md mx-auto">
                                Access resources, take exams, and connect with mentors and peers in this community.
                            </p>
                            <form action={async () => {
                                "use server";
                                await joinCommunity(community.id);
                            }}>
                                <Button className="bg-white text-black hover:bg-gray-200 h-14 px-12 text-lg font-bold uppercase tracking-widest rounded-none">
                                    Join Now
                                </Button>
                            </form>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="bg-zinc-950 border border-white/10 rounded-none p-8 hover:border-white/30 transition-all cursor-pointer group">
                                <FileText className="h-6 w-6 mb-4 text-gray-500 group-hover:text-white" />
                                <h3 className="text-xl font-bold uppercase mb-2">Resources</h3>
                                <p className="text-gray-500 text-xs uppercase tracking-widest">
                                    {community.resources.length} PDFs, Links & Notes
                                </p>
                            </div>
                            <div className="bg-zinc-950 border border-white/10 rounded-none p-8 hover:border-white/30 transition-all cursor-pointer group">
                                <PenTool className="h-6 w-6 mb-4 text-gray-500 group-hover:text-white" />
                                <h3 className="text-xl font-bold uppercase mb-2">Exams</h3>
                                <p className="text-gray-500 text-xs uppercase tracking-widest">
                                    {community.exams.length} Practice Tests Available
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column: Sidebar */}
                <div className="space-y-8">
                    <div className="bg-zinc-950 border border-white/10 rounded-none p-8">
                        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-[0.2em] mb-6 border-b border-white/5 pb-4">
                            Mentor in Charge
                        </h4>
                        <div className="flex items-center gap-4 mb-6">
                            {community.mentor.imageUrl && (
                                <Image
                                    src={community.mentor.imageUrl}
                                    alt={community.mentor.name || "Mentor"}
                                    width={48}
                                    height={48}
                                    className="rounded-none grayscale border border-white/10"
                                />
                            )}
                            <div>
                                <p className="font-bold uppercase text-sm">{community.mentor.name}</p>
                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-tight">
                                    {community.mentor.department}
                                </p>
                            </div>
                        </div>

                        {community.meetLink && community.isMember && (
                            <a href={community.meetLink} target="_blank" rel="noopener noreferrer">
                                <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10 h-12 uppercase font-bold tracking-widest mb-4 rounded-none">
                                    <Video className="h-4 w-4 mr-2" /> Live Meet link
                                </Button>
                            </a>
                        )}

                        {community.isMember && (
                            <Button variant="ghost" className="w-full text-zinc-500 hover:text-white h-12 uppercase font-bold tracking-widest text-[10px] rounded-none">
                                <MessageCircle className="h-4 w-4 mr-2" /> Open Group Chat
                            </Button>
                        )}
                    </div>

                    <div className="bg-zinc-950 border border-white/10 rounded-none p-8">
                        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-[0.2em] mb-6 border-b border-white/5 pb-4">
                            Community Stats
                        </h4>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-500 uppercase tracking-widest">Members</span>
                                <span className="font-bold">{community.members.length}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-500 uppercase tracking-widest">Resources</span>
                                <span className="font-bold">{community.resources.length}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-500 uppercase tracking-widest">Exams</span>
                                <span className="font-bold">{community.exams.length}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
