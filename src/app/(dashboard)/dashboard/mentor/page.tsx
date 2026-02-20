import { syncUser } from "@/actions/user";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
    Users,
    BookOpen,
    Trophy,
    MessageSquare,
    ChevronRight,
    Star,
    PlusCircle,
    FileText,
    Settings,
    Award,
} from "lucide-react";

export default async function MentorDashboard() {
    const user = await syncUser();

    if (!user) redirect("/sign-in");
    if (user.role !== "MENTOR") redirect("/dashboard");

    // Fetch mentor-specific stats
    const [communitiesOwned, totalMembers, blogsWritten, ratingsReceived] = await Promise.all([
        db.community.count({ where: { mentorId: user.id } }),
        db.communityMember.count({
            where: { community: { mentorId: user.id } },
        }),
        db.blog.count({ where: { authorId: user.id } }),
        db.rating.aggregate({
            where: { mentorId: user.id },
            _avg: { score: true },
            _count: { score: true },
        }),
    ]);

    const avgRating = ratingsReceived._avg.score
        ? ratingsReceived._avg.score.toFixed(1)
        : "N/A";
    const totalRatings = ratingsReceived._count.score;

    const stats = [
        { name: "My Communities", value: communitiesOwned.toString(), icon: Users },
        { name: "Total Members", value: totalMembers.toString(), icon: Users },
        { name: "Blogs Published", value: blogsWritten.toString(), icon: BookOpen },
        { name: "Avg Rating", value: avgRating, icon: Star, subtitle: `${totalRatings} reviews` },
    ];

    // Fetch recent communities
    const recentCommunities = await db.community.findMany({
        where: { mentorId: user.id },
        include: { _count: { select: { members: true } } },
        orderBy: { createdAt: "desc" },
        take: 3,
    });

    return (
        <div className="container mx-auto px-4 py-12">
            {/* Header */}
            <div className="mb-12">
                <div className="flex items-center gap-3 mb-2">
                    <div className="h-10 w-10 rounded-none bg-white text-black flex items-center justify-center">
                        <Award className="h-5 w-5" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight uppercase">
                            Mentor Dashboard
                        </h1>
                        <p className="text-gray-400 uppercase text-xs tracking-[0.2em] mt-1">
                            Welcome back, {user.name?.split(" ")[0]} • Mentor
                        </p>
                    </div>
                </div>
            </div>

            {/* Mentor Action Bar */}
            <div className="mb-12 border border-white/10 bg-black p-8 rounded-none flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                    <div className="h-14 w-14 rounded-none bg-white text-black flex items-center justify-center">
                        <PlusCircle className="h-7 w-7" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold uppercase">Mentor Tools</h2>
                        <p className="text-gray-400 uppercase text-xs tracking-widest mt-1">
                            Create communities, write blogs, and manage your resources.
                        </p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Link href="/dashboard/communities/create">
                        <Button className="bg-white text-black hover:bg-gray-200 h-12 px-6 uppercase font-bold tracking-widest text-xs rounded-none">
                            <PlusCircle className="h-4 w-4 mr-2" />
                            New Community
                        </Button>
                    </Link>
                    <Link href="/dashboard/blog-editor">
                        <Button
                            variant="outline"
                            className="border-white/20 text-white hover:bg-white/10 h-12 px-6 uppercase font-bold tracking-widest text-xs rounded-none"
                        >
                            <FileText className="h-4 w-4 mr-2" />
                            Write Blog
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {stats.map((stat) => (
                    <div
                        key={stat.name}
                        className="bg-black border border-white/20 p-8 rounded-none hover:border-white transition-all duration-300 group"
                    >
                        <stat.icon className="h-6 w-6 text-gray-400 mb-4 group-hover:text-white transition-colors duration-300" />
                        <p className="text-gray-400 uppercase text-[10px] font-bold tracking-[0.2em]">
                            {stat.name}
                        </p>
                        <p className="text-4xl font-bold mt-2">{stat.value}</p>
                        {"subtitle" in stat && stat.subtitle && (
                            <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">
                                {stat.subtitle}
                            </p>
                        )}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Quick Navigation */}
                <div className="lg:col-span-2 space-y-6">
                    <h2 className="text-xl font-bold border-b border-white/10 pb-4 uppercase tracking-widest">
                        Quick Navigation
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Link
                            href="/dashboard/communities"
                            className="p-6 bg-white/5 border border-white/20 rounded-none hover:bg-white/10 transition-all duration-300 flex items-center justify-between group"
                        >
                            <div className="flex items-center gap-4">
                                <Users className="h-6 w-6 text-white" />
                                <span className="font-bold uppercase tracking-widest text-sm text-white">
                                    My Communities
                                </span>
                            </div>
                            <ChevronRight className="h-5 w-5 text-white/40 group-hover:text-white transition-colors" />
                        </Link>
                        <Link
                            href="/dashboard/exams"
                            className="p-6 bg-white/5 border border-white/20 rounded-none hover:bg-white/10 transition-all duration-300 flex items-center justify-between group"
                        >
                            <div className="flex items-center gap-4">
                                <Trophy className="h-6 w-6 text-white" />
                                <span className="font-bold uppercase tracking-widest text-sm text-white">
                                    Create Exams
                                </span>
                            </div>
                            <ChevronRight className="h-5 w-5 text-white/40 group-hover:text-white transition-colors" />
                        </Link>
                        <Link
                            href="/dashboard/chat"
                            className="p-6 bg-white/5 border border-white/20 rounded-none hover:bg-white/10 transition-all duration-300 flex items-center justify-between group"
                        >
                            <div className="flex items-center gap-4">
                                <MessageSquare className="h-6 w-6 text-white" />
                                <span className="font-bold uppercase tracking-widest text-sm text-white">
                                    Messages
                                </span>
                            </div>
                            <ChevronRight className="h-5 w-5 text-white/40 group-hover:text-white transition-colors" />
                        </Link>
                        <Link
                            href="/dashboard/blog-editor"
                            className="p-6 bg-white/5 border border-white/20 rounded-none hover:bg-white/10 transition-all duration-300 flex items-center justify-between group"
                        >
                            <div className="flex items-center gap-4">
                                <BookOpen className="h-6 w-6 text-white" />
                                <span className="font-bold uppercase tracking-widest text-sm text-white">
                                    Write Blog
                                </span>
                            </div>
                            <ChevronRight className="h-5 w-5 text-white/40 group-hover:text-white transition-colors" />
                        </Link>
                        <Link
                            href="/dashboard/resources"
                            className="p-6 bg-white/5 border border-white/20 rounded-none hover:bg-white/10 transition-all duration-300 flex items-center justify-between group"
                        >
                            <div className="flex items-center gap-4">
                                <BookOpen className="h-6 w-6 text-white" />
                                <span className="font-bold uppercase tracking-widest text-sm text-white">
                                    Resources
                                </span>
                            </div>
                            <ChevronRight className="h-5 w-5 text-white/40 group-hover:text-white transition-colors" />
                        </Link>
                        <Link
                            href="/dashboard/profile"
                            className="p-6 bg-white/5 border border-white/20 rounded-none hover:bg-white/10 transition-all duration-300 flex items-center justify-between group"
                        >
                            <div className="flex items-center gap-4">
                                <Settings className="h-6 w-6 text-white" />
                                <span className="font-bold uppercase tracking-widest text-sm text-white">
                                    Profile Settings
                                </span>
                            </div>
                            <ChevronRight className="h-5 w-5 text-white/40 group-hover:text-white transition-colors" />
                        </Link>
                    </div>
                </div>

                {/* Sidebar - My Communities */}
                <div className="space-y-6">
                    <h2 className="text-xl font-bold border-b border-white/10 pb-4 uppercase tracking-widest">
                        My Communities
                    </h2>
                    <div className="space-y-4">
                        {recentCommunities.length === 0 ? (
                            <div className="p-8 bg-black border border-white/10 rounded-none text-center">
                                <p className="text-white uppercase tracking-widest text-xs font-bold">
                                    No communities yet
                                </p>
                                <Link href="/dashboard/communities/create">
                                    <Button
                                        variant="ghost"
                                        className="mt-4 text-xs uppercase tracking-widest hover:bg-white/5 rounded-none"
                                    >
                                        Create Your First Community
                                    </Button>
                                </Link>
                            </div>
                        ) : (
                            recentCommunities.map((community) => (
                                <Link
                                    key={community.id}
                                    href={`/dashboard/communities/${community.id}`}
                                    className="block p-4 bg-black border border-white/10 rounded-none hover:border-white/40 transition-all duration-300"
                                >
                                    <p className="font-bold text-sm text-white">{community.title}</p>
                                    <p className="text-xs text-gray-400 uppercase tracking-widest mt-1">
                                        {community._count.members} {community._count.members === 1 ? "member" : "members"} • {community.department}
                                    </p>
                                </Link>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
