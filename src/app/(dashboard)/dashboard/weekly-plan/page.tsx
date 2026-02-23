import { syncUser } from "@/actions/user";
import { getOrCreateWeeklyPlan, getWeeklyPlanStats } from "@/actions/weeklyPlan";
import { redirect } from "next/navigation";
import { WeeklyPlanClient } from "./WeeklyPlanClient";
import { Calendar, CheckCircle2, Circle, Target } from "lucide-react";

export default async function WeeklyPlanPage() {
    const user = await syncUser();

    if (!user) redirect("/sign-in");

    const plan = await getOrCreateWeeklyPlan();
    const stats = await getWeeklyPlanStats();

    const weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    return (
        <div className="container mx-auto px-4 py-12">
            {/* Header */}
            <div className="mb-12">
                <div className="flex items-center gap-3 mb-2">
                    <div className="h-10 w-10 rounded-none bg-white text-black flex items-center justify-center">
                        <Calendar className="h-5 w-5" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight uppercase">
                            Weekly Plan
                        </h1>
                        <p className="text-gray-400 uppercase text-xs tracking-[0.2em] mt-1">
                            Organize your week, achieve your goals
                        </p>
                    </div>
                </div>
            </div>

            {/* Progress Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="bg-black border border-white/20 p-8 rounded-none hover:border-white transition-all duration-300">
                    <Target className="h-6 w-6 text-gray-400 mb-4" />
                    <p className="text-gray-400 uppercase text-[10px] font-bold tracking-[0.2em]">
                        Total Tasks
                    </p>
                    <p className="text-4xl font-bold mt-2">{stats.total}</p>
                </div>
                <div className="bg-black border border-white/20 p-8 rounded-none hover:border-white transition-all duration-300">
                    <CheckCircle2 className="h-6 w-6 text-gray-400 mb-4" />
                    <p className="text-gray-400 uppercase text-[10px] font-bold tracking-[0.2em]">
                        Completed
                    </p>
                    <p className="text-4xl font-bold mt-2">{stats.completed}</p>
                </div>
                <div className="bg-black border border-white/20 p-8 rounded-none hover:border-white transition-all duration-300">
                    <Circle className="h-6 w-6 text-gray-400 mb-4" />
                    <p className="text-gray-400 uppercase text-[10px] font-bold tracking-[0.2em]">
                        Progress
                    </p>
                    <p className="text-4xl font-bold mt-2">{stats.percentage}%</p>
                </div>
            </div>

            {/* Weekly Plan Grid */}
            <WeeklyPlanClient 
                plan={plan} 
                weekDays={weekDays}
            />
        </div>
    );
}
