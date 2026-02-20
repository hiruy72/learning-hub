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
    UserPlus,
    GraduationCap,
    Sparkles,
} from "lucide-react";

export default async function MenteeDashboard() {
    const user = await syncUser();

    if (!user) redirect("/sign-in");
    if (user.role !== "MENTEE") redirect("/dashboard");

    // Fetch mentee-specific stats
    const [communitiesCount, examsCount, pendingApplication] = await Promise.all([
        db.communityMember.count({ where: { userId: user.id } }),
        db.examAttempt.count({ where: { userId: user.id } }),
        db.mentorApplication.findFirst({
            where: { userId: user.id, status: "PENDING" },
        }),
    ]);

    const stats = [
        { name: "Communities Joined", value: communitiesCount.toString(), icon: Users },
        { name: "Exams Taken", value: examsCount.toString(), icon: Trophy },
    ];

    return (
        <div className="container mx-auto px-4 py-12">
            {/* Header */}
            <div className="mb-12">
                <div className="flex items-center gap-3 mb-2">
                    <div className="h-10 w-10 rounded-none bg-white text-black flex items-center justify-center">
                        <GraduationCap className="h-5 w-5" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight uppercase">
                            Mentee Dashboard
                        </h1>
                        <p className="text-gray-400 uppercase text-xs tracking-[0.2em] mt-1">
                            Welcome back, {user.name?.split(" ")[0]} • Mentee
                        </p>
                    </div>
                </div>
            </div>

            {/* Apply to be Mentor CTA */}
            {!pendingApplication ? (
                <div className="mb-12 border border-white/10 bg-black text-white p-8 rounded-none flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-6">
                        <div className="h-14 w-14 rounded-none bg-white text-black flex items-center justify-center">
                            <UserPlus className="h-7 w-7" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold uppercase text-white">Ready to help others?</h2>
                            <p className="text-gray-400 uppercase text-xs tracking-widest mt-1">
                                Apply to become a mentor and share your knowledge with freshmen.
                            </p>
                        </div>
                    </div>
                    <Link href="/dashboard/apply">
                        <Button className="bg-white text-black hover:bg-gray-200 h-12 px-8 uppercase font-bold tracking-widest rounded-none">
                            <Sparkles className="h-4 w-4 mr-2" />
                            Apply Now
                        </Button>
                    </Link>
                </div>
            ) : (
                <div className="mb-12 border border-yellow-500/30 bg-yellow-500/5 p-8 rounded-none flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-6">
                        <div className="h-14 w-14 rounded-none bg-yellow-500/10 flex items-center justify-center">
                            <Sparkles className="h-7 w-7 text-yellow-500" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold uppercase text-yellow-400">Application Pending</h2>
                            <p className="text-gray-400 uppercase text-xs tracking-widest mt-1">
                                Your mentor application is being reviewed. You&apos;ll be notified once it&apos;s processed.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
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
                    </div>
                ))}
            </div>

            {/* Quick Navigation */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
                                    Browse Communities
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
                                    My Exams
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
                            href="/blogs"
                            className="p-6 bg-white/5 border border-white/20 rounded-none hover:bg-white/10 transition-all duration-300 flex items-center justify-between group"
                        >
                            <div className="flex items-center gap-4">
                                <BookOpen className="h-6 w-6 text-white" />
                                <span className="font-bold uppercase tracking-widest text-sm text-white">
                                    Read Blogs
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
                                <GraduationCap className="h-6 w-6 text-white" />
                                <span className="font-bold uppercase tracking-widest text-sm text-white">
                                    My Profile
                                </span>
                            </div>
                            <ChevronRight className="h-5 w-5 text-white/40 group-hover:text-white transition-colors" />
                        </Link>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <h2 className="text-xl font-bold border-b border-white/10 pb-4 uppercase tracking-widest">
                        Recent Activity
                    </h2>
                    <div className="space-y-4">
                        {communitiesCount === 0 && examsCount === 0 ? (
                            <div className="p-8 bg-black border border-white/10 rounded-none text-center">
                                <p className="text-white uppercase tracking-widest text-xs font-bold">
                                    No activity yet
                                </p>
                                <p className="text-gray-400 text-xs mt-2 uppercase tracking-widest">
                                    Join a community to get started!
                                </p>
                            </div>
                        ) : (
                            <>
                                <div className="p-4 bg-black border border-white/10 rounded-none">
                                    <p className="text-xs text-gray-400 uppercase font-bold tracking-widest mb-1">
                                        Communities
                                    </p>
                                    <p className="text-sm font-medium text-white">
                                        You&apos;re part of {communitiesCount} {communitiesCount === 1 ? "community" : "communities"}
                                    </p>
                                </div>
                                <div className="p-4 bg-black border border-white/10 rounded-none">
                                    <p className="text-xs text-gray-400 uppercase font-bold tracking-widest mb-1">
                                        Exams
                                    </p>
                                    <p className="text-sm font-medium text-white">
                                        {examsCount} {examsCount === 1 ? "exam" : "exams"} completed
                                    </p>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
