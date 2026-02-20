import { syncUser } from "@/actions/user";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import {
    User,
    Mail,
    GraduationCap,
    Calendar,
    Shield,
    ArrowLeft,
    Edit3,
} from "lucide-react";

export default async function ProfilePage() {
    const user = await syncUser();

    if (!user) redirect("/sign-in");

    const roleBadgeStyles: Record<string, string> = {
        ADMIN: "bg-white text-black",
        MENTOR: "bg-zinc-800 text-white border border-white/20",
        MENTEE: "bg-zinc-900 text-gray-300 border border-white/10",
    };

    return (
        <div className="container mx-auto max-w-3xl px-4 py-12">
            <Link
                href="/dashboard"
                className="flex items-center gap-2 text-gray-400 hover:text-white mb-12 uppercase text-[10px] font-bold tracking-[0.3em] transition-colors"
            >
                <ArrowLeft className="h-3 w-3" /> Back to Dashboard
            </Link>

            <div className="space-y-12">
                {/* Header */}
                <div className="flex flex-col md:flex-row items-start gap-8">
                    <div className="relative">
                        {user.imageUrl ? (
                            <Image
                                src={user.imageUrl}
                                alt={user.name || "User"}
                                width={120}
                                height={120}
                                className="rounded-none grayscale border-2 border-white/10"
                            />
                        ) : (
                            <div className="h-[120px] w-[120px] rounded-none bg-black border-2 border-white/10 flex items-center justify-center">
                                <User className="h-12 w-12 text-gray-400" />
                            </div>
                        )}
                    </div>
                    <div className="flex-grow">
                        <div className="flex items-center gap-4 mb-2">
                            <h1 className="text-4xl font-bold tracking-tight uppercase">
                                {user.name || "Unknown User"}
                            </h1>
                            <span
                                className={`text-[10px] font-bold px-3 py-1 rounded-none uppercase tracking-widest ${roleBadgeStyles[user.role] || roleBadgeStyles.MENTEE
                                    }`}
                            >
                                {user.role}
                            </span>
                        </div>
                        <p className="text-gray-400 uppercase text-xs tracking-[0.2em]">
                            Member since{" "}
                            {new Date(user.createdAt).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                            })}
                        </p>
                    </div>
                </div>

                {/* Profile Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-black border border-white/10 rounded-none p-8 space-y-4">
                        <div className="flex items-center gap-3 text-gray-400 mb-2">
                            <Mail className="h-4 w-4" />
                            <span className="text-[10px] font-bold uppercase tracking-widest">
                                Email
                            </span>
                        </div>
                        <p className="text-white font-medium">{user.email}</p>
                    </div>

                    <div className="bg-black border border-white/10 rounded-none p-8 space-y-4">
                        <div className="flex items-center gap-3 text-gray-400 mb-2">
                            <Shield className="h-4 w-4" />
                            <span className="text-[10px] font-bold uppercase tracking-widest">
                                Role
                            </span>
                        </div>
                        <p className="text-white font-medium uppercase">{user.role}</p>
                    </div>

                    <div className="bg-black border border-white/10 rounded-none p-8 space-y-4">
                        <div className="flex items-center gap-3 text-gray-400 mb-2">
                            <GraduationCap className="h-4 w-4" />
                            <span className="text-[10px] font-bold uppercase tracking-widest">
                                Department
                            </span>
                        </div>
                        <p className="text-white font-medium">
                            {user.department || "Not set"}
                        </p>
                    </div>

                    <div className="bg-black border border-white/10 rounded-none p-8 space-y-4">
                        <div className="flex items-center gap-3 text-gray-400 mb-2">
                            <Calendar className="h-4 w-4" />
                            <span className="text-[10px] font-bold uppercase tracking-widest">
                                Year
                            </span>
                        </div>
                        <p className="text-white font-medium">
                            {user.year || "Not set"}
                        </p>
                    </div>
                </div>

                {/* Bio Section */}
                <div className="bg-black border border-white/10 rounded-none p-8">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
                        Bio
                    </h3>
                    <p className="text-gray-300 leading-relaxed">
                        {user.bio || "No bio added yet. Your bio will appear here once you update your profile."}
                    </p>
                </div>

                {/* Actions */}
                <div className="flex gap-4 pt-4 border-t border-white/10">
                    <Link href="/dashboard/profile/edit">
                        <Button
                            className="bg-white text-black hover:bg-gray-200 h-12 px-8 uppercase font-bold tracking-widest text-xs rounded-none"
                        >
                            <Edit3 className="h-4 w-4 mr-2" />
                            Edit Profile
                        </Button>
                    </Link>
                    {user.role === "MENTEE" && (
                        <Link href="/dashboard/apply">
                            <Button
                                variant="outline"
                                className="border-white/20 text-white hover:bg-white/10 h-12 px-8 uppercase font-bold tracking-widest text-xs rounded-none"
                            >
                                Apply as Mentor
                            </Button>
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}
