import { syncUser } from "@/actions/user";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Trophy, Clock, ArrowLeft, ChevronRight, CheckCircle2 } from "lucide-react";

export default async function ExamsPage() {
    const user = await syncUser();
    if (!user) redirect("/sign-in");

    // Fetch user's exam attempts
    const attempts = await db.examAttempt.findMany({
        where: { userId: user.id },
        include: {
            exam: {
                include: {
                    community: { select: { title: true } },
                    _count: { select: { questions: true } },
                },
            },
        },
        orderBy: { createdAt: "desc" },
    });

    // Fetch available exams from user's communities
    const memberCommunityIds = await db.communityMember.findMany({
        where: { userId: user.id },
        select: { communityId: true },
    });

    const availableExams = await db.exam.findMany({
        where: {
            communityId: { in: memberCommunityIds.map((m) => m.communityId) },
        },
        include: {
            community: { select: { title: true } },
            _count: { select: { questions: true } },
        },
        orderBy: { createdAt: "desc" },
    });

    return (
        <div className="container mx-auto px-4 py-12">
            <Link
                href="/dashboard"
                className="flex items-center gap-2 text-gray-400 hover:text-white mb-12 uppercase text-[10px] font-bold tracking-[0.3em] transition-colors"
            >
                <ArrowLeft className="h-3 w-3" /> Back to Dashboard
            </Link>

            <div className="mb-12">
                <h1 className="text-4xl font-bold tracking-tight uppercase">Exams</h1>
                <p className="text-gray-400 uppercase text-xs tracking-[0.2em] mt-2">
                    Take practice exams and track your progress
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Available Exams */}
                <div className="lg:col-span-2 space-y-6">
                    <h2 className="text-xl font-bold border-b border-white/10 pb-4 uppercase tracking-widest">
                        Available Exams ({availableExams.length})
                    </h2>

                    {availableExams.length === 0 ? (
                        <div className="text-center py-24 border border-dashed border-white/10 rounded-none">
                            <Trophy className="h-10 w-10 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-400 uppercase tracking-widest text-sm font-bold">
                                No exams available
                            </p>
                            <p className="text-gray-500 text-xs mt-2 font-bold uppercase tracking-widest">
                                Join a community to access practice exams.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {availableExams.map((exam) => (
                                <Link
                                    key={exam.id}
                                    href={`/dashboard/exams/${exam.id}`}
                                    className="block bg-black border border-white/10 rounded-none p-6 hover:border-white/30 transition-all duration-300 group"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-2">
                                            <h3 className="text-lg font-bold uppercase group-hover:underline underline-offset-4">
                                                {exam.title}
                                            </h3>
                                            <div className="flex items-center gap-4 text-[10px] text-gray-400 uppercase tracking-widest font-bold">
                                                <span>{exam.community.title}</span>
                                                <span className="h-1 w-1 bg-gray-400 rounded-full" />
                                                <span>{exam._count.questions} questions</span>
                                                <span className="h-1 w-1 bg-gray-400 rounded-full" />
                                                <span className="flex items-center gap-1">
                                                    <Clock className="h-3 w-3" />
                                                    {exam.timeLimit} min
                                                </span>
                                            </div>
                                        </div>
                                        <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors" />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

                {/* Past Attempts Sidebar */}
                <div className="space-y-6">
                    <h2 className="text-xl font-bold border-b border-white/10 pb-4 uppercase tracking-widest">
                        My Attempts ({attempts.length})
                    </h2>

                    {attempts.length === 0 ? (
                        <div className="p-8 bg-black border border-white/10 rounded-none text-center">
                            <p className="text-white uppercase tracking-widest text-xs font-bold">
                                No attempts yet
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {attempts.map((attempt) => (
                                <div
                                    key={attempt.id}
                                    className="p-4 bg-black border border-white/10 rounded-none"
                                >
                                    <div className="flex items-start justify-between mb-2">
                                        <p className="font-bold text-sm uppercase text-white">
                                            {attempt.exam.title}
                                        </p>
                                        <div className="flex items-center gap-1">
                                            <CheckCircle2 className="h-3 w-3 text-white" />
                                            <span className="text-sm font-bold text-white">{attempt.score}%</span>
                                        </div>
                                    </div>
                                    <p className="text-[10px] text-gray-400 uppercase tracking-widest">
                                        {attempt.exam.community.title} •{" "}
                                        {new Date(attempt.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
