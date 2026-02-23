"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
    addWeeklyTask, 
    toggleTaskComplete, 
    deleteWeeklyTask,
    updateWeeklyTask 
} from "@/actions/weeklyPlan";
import { 
    Plus, 
    Check, 
    Trash2, 
    Circle,
    ChevronDown,
    ChevronUp,
    AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface Task {
    id: string;
    title: string;
    description: string | null;
    dayOfWeek: number;
    completed: boolean;
    priority: string;
}

interface WeeklyPlan {
    id: string;
    tasks: Task[];
}

interface WeeklyPlanClientProps {
    plan: WeeklyPlan;
    weekDays: string[];
}

export function WeeklyPlanClient({ plan, weekDays }: WeeklyPlanClientProps) {
    const [isPending, startTransition] = useTransition();
    const [expandedDays, setExpandedDays] = useState<number[]>([new Date().getDay()]);
    const [newTaskInputs, setNewTaskInputs] = useState<{ [key: number]: string }>({});
    const [newTaskPriority, setNewTaskPriority] = useState<{ [key: number]: string }>({});

    const toggleDay = (dayIndex: number) => {
        setExpandedDays(prev => 
            prev.includes(dayIndex) 
                ? prev.filter(d => d !== dayIndex) 
                : [...prev, dayIndex]
        );
    };

    const handleAddTask = (dayOfWeek: number) => {
        const title = newTaskInputs[dayOfWeek]?.trim();
        if (!title) return;

        startTransition(async () => {
            try {
                await addWeeklyTask({
                    weeklyPlanId: plan.id,
                    title,
                    dayOfWeek,
                    priority: newTaskPriority[dayOfWeek] || "medium",
                });
                setNewTaskInputs(prev => ({ ...prev, [dayOfWeek]: "" }));
                toast.success("Task added");
            } catch (error) {
                toast.error("Failed to add task");
            }
        });
    };

    const handleToggleComplete = (taskId: string) => {
        startTransition(async () => {
            try {
                await toggleTaskComplete(taskId);
            } catch (error) {
                toast.error("Failed to update task");
            }
        });
    };

    const handleDeleteTask = (taskId: string) => {
        startTransition(async () => {
            try {
                await deleteWeeklyTask(taskId);
                toast.success("Task deleted");
            } catch (error) {
                toast.error("Failed to delete task");
            }
        });
    };

    const getTasksByDay = (dayIndex: number) => {
        return plan.tasks.filter(task => task.dayOfWeek === dayIndex);
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case "high": return "border-red-500/50 bg-red-500/5";
            case "medium": return "border-yellow-500/50 bg-yellow-500/5";
            case "low": return "border-green-500/50 bg-green-500/5";
            default: return "border-white/10";
        }
    };

    const today = new Date().getDay();

    return (
        <div className="space-y-4">
            {weekDays.map((day, dayIndex) => {
                const tasks = getTasksByDay(dayIndex);
                const completedCount = tasks.filter(t => t.completed).length;
                const isExpanded = expandedDays.includes(dayIndex);
                const isToday = dayIndex === today;

                return (
                    <div 
                        key={dayIndex}
                        className={cn(
                            "border rounded-none transition-all",
                            isToday ? "border-white/40 bg-white/5" : "border-white/10",
                            isExpanded && "bg-black"
                        )}
                    >
                        {/* Day Header */}
                        <button
                            onClick={() => toggleDay(dayIndex)}
                            className="w-full p-6 flex items-center justify-between hover:bg-white/5 transition-colors"
                        >
                            <div className="flex items-center gap-4">
                                <span className={cn(
                                    "text-xl font-bold uppercase tracking-tight",
                                    isToday && "text-white"
                                )}>
                                    {day}
                                </span>
                                {isToday && (
                                    <span className="text-[10px] bg-white text-black px-2 py-0.5 font-bold uppercase tracking-widest">
                                        Today
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="text-xs text-gray-400 uppercase tracking-widest">
                                    {completedCount}/{tasks.length} tasks
                                </span>
                                {isExpanded ? (
                                    <ChevronUp className="h-4 w-4 text-gray-400" />
                                ) : (
                                    <ChevronDown className="h-4 w-4 text-gray-400" />
                                )}
                            </div>
                        </button>

                        {/* Tasks */}
                        {isExpanded && (
                            <div className="px-6 pb-6 space-y-4">
                                {/* Task List */}
                                {tasks.length > 0 ? (
                                    <div className="space-y-2">
                                        {tasks.map((task) => (
                                            <div
                                                key={task.id}
                                                className={cn(
                                                    "flex items-center gap-4 p-4 border rounded-none group transition-all",
                                                    task.completed 
                                                        ? "border-white/5 opacity-50" 
                                                        : getPriorityColor(task.priority)
                                                )}
                                            >
                                                <button
                                                    onClick={() => handleToggleComplete(task.id)}
                                                    disabled={isPending}
                                                    className="flex-shrink-0"
                                                >
                                                    {task.completed ? (
                                                        <Check className="h-5 w-5 text-green-500" />
                                                    ) : (
                                                        <Circle className="h-5 w-5 text-gray-400 hover:text-white transition-colors" />
                                                    )}
                                                </button>
                                                <div className="flex-grow">
                                                    <p className={cn(
                                                        "text-sm uppercase tracking-wide",
                                                        task.completed && "line-through text-gray-500"
                                                    )}>
                                                        {task.title}
                                                    </p>
                                                    {task.description && (
                                                        <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-wider">
                                                            {task.description}
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    {task.priority === "high" && (
                                                        <AlertCircle className="h-4 w-4 text-red-500" />
                                                    )}
                                                    <button
                                                        onClick={() => handleDeleteTask(task.id)}
                                                        disabled={isPending}
                                                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <Trash2 className="h-4 w-4 text-gray-400 hover:text-red-500 transition-colors" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="py-8 text-center border border-dashed border-white/10 rounded-none">
                                        <p className="text-gray-500 uppercase text-[10px] tracking-widest">
                                            No tasks for this day
                                        </p>
                                    </div>
                                )}

                                {/* Add Task Form */}
                                <div className="flex gap-2 mt-4">
                                    <select
                                        value={newTaskPriority[dayIndex] || "medium"}
                                        onChange={(e) => setNewTaskPriority(prev => ({
                                            ...prev,
                                            [dayIndex]: e.target.value
                                        }))}
                                        className="bg-black border border-white/20 rounded-none px-3 text-xs uppercase tracking-widest focus:border-white transition-colors"
                                    >
                                        <option value="low">Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                    </select>
                                    <Input
                                        placeholder="Add a new task..."
                                        value={newTaskInputs[dayIndex] || ""}
                                        onChange={(e) => setNewTaskInputs(prev => ({
                                            ...prev,
                                            [dayIndex]: e.target.value
                                        }))}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                handleAddTask(dayIndex);
                                            }
                                        }}
                                        className="flex-grow bg-black border-white/20 rounded-none uppercase text-xs tracking-widest placeholder:text-gray-600"
                                    />
                                    <Button
                                        onClick={() => handleAddTask(dayIndex)}
                                        disabled={isPending || !newTaskInputs[dayIndex]?.trim()}
                                        className="bg-white text-black hover:bg-gray-200 rounded-none"
                                    >
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
