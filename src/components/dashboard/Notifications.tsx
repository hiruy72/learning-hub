"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, X, User, MessageSquare, BookOpen, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const NotificationPanel = ({ isOpen, onCloseAction }: { isOpen: boolean, onCloseAction: () => void }) => {
    const [notifications, setNotifications] = useState([
        { id: 1, type: "MESSAGE", title: "New Message", text: "Mentor Alex sent you a message", time: "2m ago", read: false },
        { id: 2, type: "RESOURCE", title: "New Resource", text: "Calculus Week 4 notes uploaded in CS Community", time: "1h ago", read: false },
        { id: 3, type: "EXAM", title: "Exam Created", text: "New MCQ exam: Data Structures Quiz 1", time: "4h ago", read: true },
        { id: 4, type: "BLOG", title: "Blog Post", text: "Admin posted: 10 Tips for Freshers", time: "Yesterday", read: true },
    ]);

    const icons: any = {
        MESSAGE: MessageSquare,
        RESOURCE: BookOpen,
        EXAM: Trophy,
        BLOG: Bell
    };

    const markAsRead = (id: number) => {
        setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
    };

    const markAllAsRead = () => {
        setNotifications(notifications.map(n => ({ ...n, read: true })));
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onCloseAction}
                        className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100]"
                    />
                    <motion.div
                        initial={{ x: "100%", opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: "100%", opacity: 0 }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed right-0 top-0 h-full w-full max-w-sm bg-black border-l border-white/5 z-[101] p-8 shadow-[0_0_50px_rgba(0,0,0,1)] flex flex-col"
                    >
                        <div className="flex items-center justify-between mb-12">
                            <div>
                                <h2 className="text-3xl font-black uppercase tracking-tighter text-white">Activity</h2>
                                <div className="h-0.5 w-8 bg-white mt-1" />
                            </div>
                            <Button variant="ghost" size="icon" onClick={onCloseAction} className="hover:bg-white/5 text-gray-400 rounded-none">
                                <X className="h-5 w-5" />
                            </Button>
                        </div>

                        <div className="flex-grow overflow-y-auto pr-2 space-y-4 custom-scrollbar">
                            {notifications.length > 0 ? (
                                notifications.map((notif) => {
                                    const Icon = icons[notif.type] || Bell;
                                    return (
                                        <motion.div
                                            key={notif.id}
                                            layout
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className={cn(
                                                "p-6 rounded-none border transition-all relative group cursor-pointer",
                                                notif.read
                                                    ? 'bg-transparent border-white/5 opacity-40'
                                                    : 'bg-zinc-950/50 border-white/10 hover:border-white/20'
                                            )}
                                            onClick={() => markAsRead(notif.id)}
                                        >
                                            {!notif.read && (
                                                <div className="absolute top-6 right-6 h-2 w-2 bg-white rounded-none shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
                                            )}
                                            <div className="flex gap-5">
                                                <div className={cn(
                                                    "h-12 w-12 shrink-0 rounded-none flex items-center justify-center transition-all duration-500",
                                                    notif.read ? "bg-white/5 border border-white/5" : "bg-white shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                                                )}>
                                                    <Icon className={cn("h-5 w-5", notif.read ? "text-gray-400" : "text-black")} />
                                                </div>
                                                <div className="flex-grow">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white">{notif.title}</h4>
                                                        <span className="text-[9px] text-gray-400 font-mono font-bold uppercase">{notif.time}</span>
                                                    </div>
                                                    <p className="text-[11px] text-gray-400 uppercase tracking-tight leading-relaxed font-light">
                                                        {notif.text}
                                                    </p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-gray-500 space-y-4">
                                    <Bell className="h-12 w-12 opacity-10" />
                                    <p className="text-[10px] uppercase tracking-widest font-bold">No new activity</p>
                                </div>
                            )}
                        </div>

                        <div className="pt-8 mt-4 border-t border-white/5">
                            <Button
                                onClick={markAllAsRead}
                                className="w-full h-16 bg-white text-black hover:bg-gray-200 uppercase font-black tracking-[0.3em] text-[10px] rounded-none transition-all active:scale-[0.98]"
                            >
                                Mark all as read
                            </Button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
