import { syncUser } from "@/actions/user";
import { getPendingApplications, updateApplicationStatus } from "@/actions/mentor";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import {
    Check,
    X,
    ShieldAlert,
    Users,
    BookOpen,
    Trophy,
    MessageSquare,
    ChevronRight,
    Settings,
    BarChart3,
    UserCheck,
    FileText,
} from "lucide-react";
import Image from "next/image";

export default async function AdminDashboard() {
    const user = await syncUser();

    if (!user) redirect("/sign-in");
    if (user.role !== "ADMIN") redirect("/dashboard");

    // Fetch admin stats
    const [
        totalUsers,
        totalMentors,
        totalMentees,
        totalCommunities,
        totalBlogs,
        pendingApps,
        applications,
    ] = await Promise.all([
        db.user.count(),
        db.user.count({ where: { role: "MENTOR" } }),
        db.user.count({ where: { role: "MENTEE" } }),
        db.community.count(),
        db.blog.count(),
        db.mentorApplication.count({ where: { status: "PENDING" } }),
        getPendingApplications(),
    ]);

    const stats = [
        { name: "Total Users", value: totalUsers.toString(), icon: Users },
        { name: "Mentors", value: totalMentors.toString(), icon: UserCheck },
        { name: "Mentees", value: totalMentees.toString(), icon: Users },
        { name: "Communities", value: totalCommunities.toString(), icon: Users },
        { name: "Blogs", value: totalBlogs.toString(), icon: BookOpen },
        { name: "Pending Apps", value: pendingApps.toString(), icon: FileText },
    ];

    return (
        <div className="container mx-auto px-4 py-12">
            {/* Header */}
            <div className="mb-12">
                <div className="flex items-center gap-3 mb-2">
                    <div className="h-10 w-10 rounded-none bg-white text-black flex items-center justify-center">
                        <ShieldAlert className="h-5 w-5" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight uppercase">
                            Admin Dashboard
                        </h1>
                        <p className="text-gray-400 uppercase text-xs tracking-[0.2em] mt-1">
                            Welcome back, {user.name?.split(" ")[0]} • System Administrator
                        </p>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
                {stats.map((stat) => (
                    <div
                        key={stat.name}
                        className="bg-black border border-white/20 p-6 rounded-none hover:border-white transition-all duration-300 group"
                    >
                        <stat.icon className="h-5 w-5 text-gray-400 mb-3 group-hover:text-white transition-colors duration-300" />
                        <p className="text-gray-400 uppercase text-[10px] font-bold tracking-[0.2em]">
                            {stat.name}
                        </p>
                        <p className="text-3xl font-bold mt-1">{stat.value}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content - Pending Applications */}
                <div className="lg:col-span-2 space-y-6">
                    <h2 className="text-xl font-bold text-gray-400 uppercase tracking-[0.2em] border-b border-white/10 pb-4">
                        Pending Mentor Applications ({applications.length})
                    </h2>

                    {applications.length === 0 ? (
                        <div className="text-center py-24 border border-dashed border-white/10 rounded-none">
                            <p className="text-white uppercase tracking-widest font-bold text-sm">
                                No pending applications
                            </p>
                        </div>
                    ) : (
                        applications.map((app: any) => (
                            <div
                                key={app.id}
                                className="bg-black border border-white/10 rounded-none p-8 flex flex-col md:flex-row gap-8 items-start"
                            >
                                <div className="flex-shrink-0">
                                    {app.user.imageUrl && (
                                        <Image
                                            src={app.user.imageUrl}
                                            alt={app.user.name || "User"}
                                            width={80}
                                            height={80}
                                            className="rounded-none grayscale border border-white/20"
                                        />
                                    )}
                                </div>

                                <div className="flex-grow space-y-4">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div>
                                            <h3 className="text-2xl font-bold">
                                                {app.user.name}
                                            </h3>
                                            <p className="text-gray-400 uppercase text-xs tracking-widest mt-1">
                                                {app.user.email} • {app.department} •{" "}
                                                {app.year}
                                            </p>
                                        </div>
                                        <div className="flex gap-2">
                                            <form
                                                action={async () => {
                                                    "use server";
                                                    await updateApplicationStatus(
                                                        app.id,
                                                        "APPROVED"
                                                    );
                                                }}
                                            >
                                                <Button
                                                    size="sm"
                                                    className="bg-white text-black hover:bg-gray-200 rounded-none"
                                                >
                                                    <Check className="h-4 w-4 mr-1" /> Approve
                                                </Button>
                                            </form>
                                            <form
                                                action={async () => {
                                                    "use server";
                                                    await updateApplicationStatus(
                                                        app.id,
                                                        "REJECTED"
                                                    );
                                                }}
                                            >
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="text-white border-white/20 hover:bg-white/10 rounded-none"
                                                >
                                                    <X className="h-4 w-4 mr-1" /> Reject
                                                </Button>
                                            </form>
                                        </div>
                                    </div>

                                    <div className="space-y-4 pt-4 border-t border-white/5">
                                        <div>
                                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
                                                Bio
                                            </h4>
                                            <p className="text-gray-300">{app.bio}</p>
                                        </div>
                                        <div>
                                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
                                                Motivation
                                            </h4>
                                            <p className="text-gray-400">
                                                {app.motivation}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-4 pt-2">
                                        <a
                                            href={app.gradeReportLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-white transition-colors border border-white/10 px-3 py-2 rounded-none bg-white/5"
                                        >
                                            <FileText className="h-3 w-3" /> Grade Report
                                        </a>
                                        <a
                                            href={app.nationalIdLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-white transition-colors border border-white/10 px-3 py-2 rounded-none bg-white/5"
                                        >
                                            <ShieldAlert className="h-3 w-3" /> National ID
                                        </a>
                                    </div>

                                    <div className="text-[10px] text-gray-500 uppercase tracking-[0.2em] pt-4 border-t border-white/5 mt-4">
                                        Applied on {formatDate(app.createdAt)}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Sidebar - Admin Quick Links */}
                <div className="space-y-6">
                    <h2 className="text-xl font-bold border-b border-white/10 pb-4 uppercase tracking-widest">
                        Admin Navigation
                    </h2>
                    <div className="space-y-3">
                        <Link
                            href="/dashboard/communities"
                            className="block p-5 bg-white/5 border border-white/20 rounded-none hover:bg-white/10 transition-all duration-300 group"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Users className="h-5 w-5 text-white" />
                                    <span className="font-bold uppercase tracking-widest text-xs text-white">
                                        Manage Communities
                                    </span>
                                </div>
                                <ChevronRight className="h-4 w-4 text-white/40 group-hover:text-white transition-colors" />
                            </div>
                        </Link>
                        <Link
                            href="/blogs"
                            className="block p-5 bg-white/5 border border-white/20 rounded-none hover:bg-white/10 transition-all duration-300 group"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <BookOpen className="h-5 w-5 text-white" />
                                    <span className="font-bold uppercase tracking-widest text-xs text-white">
                                        Manage Blogs
                                    </span>
                                </div>
                                <ChevronRight className="h-4 w-4 text-white/40 group-hover:text-white transition-colors" />
                            </div>
                        </Link>
                        <Link
                            href="/dashboard/blog-editor"
                            className="block p-5 bg-white/5 border border-white/20 rounded-none hover:bg-white/10 transition-all duration-300 group"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <FileText className="h-5 w-5 text-white" />
                                    <span className="font-bold uppercase tracking-widest text-xs text-white">
                                        Write Blog
                                    </span>
                                </div>
                                <ChevronRight className="h-4 w-4 text-white/40 group-hover:text-white transition-colors" />
                            </div>
                        </Link>
                        <Link
                            href="/dashboard/chat"
                            className="block p-5 bg-white/5 border border-white/20 rounded-none hover:bg-white/10 transition-all duration-300 group"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <MessageSquare className="h-5 w-5 text-white" />
                                    <span className="font-bold uppercase tracking-widest text-xs text-white">
                                        Messages
                                    </span>
                                </div>
                                <ChevronRight className="h-4 w-4 text-white/40 group-hover:text-white transition-colors" />
                            </div>
                        </Link>
                        <Link
                            href="/dashboard/profile"
                            className="block p-5 bg-white/5 border border-white/20 rounded-none hover:bg-white/10 transition-all duration-300 group"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Settings className="h-5 w-5 text-white" />
                                    <span className="font-bold uppercase tracking-widest text-xs text-white">
                                        Profile Settings
                                    </span>
                                </div>
                                <ChevronRight className="h-4 w-4 text-white/40 group-hover:text-white transition-colors" />
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
