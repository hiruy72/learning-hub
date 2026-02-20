import { getCommunities } from "@/actions/community";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus, Users, ArrowUpRight } from "lucide-react";
import { getCurrentUserRole } from "@/actions/user";

export default async function CommunitiesPage() {
    const communities = await getCommunities();
    const role = await getCurrentUserRole();

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight uppercase">Communities</h1>
                    <p className="text-gray-400 mt-2 uppercase text-xs tracking-[0.2em]">Explore and join department-specific groups</p>
                </div>

                {(role === "MENTOR" || role === "ADMIN") && (
                    <Link href="/dashboard/communities/create">
                        <Button className="bg-white text-black hover:bg-gray-200 uppercase font-bold tracking-widest rounded-none">
                            <Plus className="mr-2 h-4 w-4" /> Create Community
                        </Button>
                    </Link>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {communities.map((community: any) => (
                    <Link
                        key={community.id}
                        href={`/dashboard/communities/${community.id}`}
                        className="group relative"
                    >
                        <div className="h-full bg-black border border-white/10 rounded-none p-8 transition-all duration-300 hover:border-white/40 hover:-translate-y-1">
                            <div className="flex justify-between items-start mb-6">
                                <span className="text-[10px] font-bold bg-white text-black px-2 py-1 rounded-none uppercase tracking-[0.2em]">
                                    {community.department}
                                </span>
                                <ArrowUpRight className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors" />
                            </div>

                            <h3 className="text-2xl font-bold mb-3 uppercase group-hover:underline underline-offset-8">
                                {community.title}
                            </h3>

                            <p className="text-gray-400 text-sm line-clamp-2 mb-8 uppercase tracking-wider leading-relaxed">
                                {community.description}
                            </p>

                            <div className="flex items-center justify-between border-t border-white/5 pt-6">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-gray-400 uppercase tracking-widest">Mentor:</span>
                                    <span className="text-xs font-bold uppercase">{community.mentor.name}</span>
                                </div>
                                <div className="flex items-center gap-1 text-gray-400">
                                    <Users className="h-3 w-3" />
                                    <span className="text-[10px] font-bold tracking-tighter">{community._count.members}</span>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}

                {communities.length === 0 && (
                    <div className="col-span-full text-center py-24 border border-dashed border-white/10 rounded-none">
                        <p className="text-gray-400 uppercase tracking-widest">No communities found</p>
                    </div>
                )}
            </div>
        </div>
    );
}
