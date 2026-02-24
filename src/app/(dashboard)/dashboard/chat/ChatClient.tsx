"use client";

import { useState, useEffect, useRef } from "react";
import { User, Role } from "@prisma/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Send,
    Search,
    Users,
    MessageSquare,
    Plus,
    Hash,
    ChevronRight,
    Loader2,
    ArrowLeft,
    Compass
} from "lucide-react";
import {
    getDirectMessages,
    sendDirectMessage,
    getCommunityMessages,
    sendCommunityMessage,
    getOrCreateConversation,
    createCommunity,
    joinCommunity
} from "@/actions/chat";
import { toast } from "sonner";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

type ConversationType = {
    id: string;
    otherUser: any;
    lastMessage: any;
    hasUnread?: boolean | null;
};

type AvailableUserType = {
    id: string;
    name: string | null;
    imageUrl: string | null;
    role: any;
    department: string | null;
};

type CommunityType = {
    id: string;
    title: string;
    description: string;
    _count: { members: number; messages: number };
    mentor: { id: string; name: string | null };
};

interface ChatClientProps {
    currentUser: User;
    conversations: ConversationType[];
    availableUsers: AvailableUserType[];
    communities: CommunityType[];
    availableCommunities: any[];
    initialConversationId?: string;
    initialCommunityId?: string;
}

export function ChatClient({
    currentUser,
    conversations,
    availableUsers,
    communities,
    availableCommunities,
    initialConversationId,
    initialCommunityId
}: ChatClientProps) {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<"direct" | "community" | "discover">(
        initialCommunityId ? "community" : "direct"
    );
    const [activeId, setActiveId] = useState<string | null>(initialConversationId || initialCommunityId || null);
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [showCreateGroup, setShowCreateGroup] = useState(false);
    const [groupData, setGroupData] = useState({ title: "", description: "", department: "" });
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (activeId && activeTab !== "discover") {
            loadMessages();
        } else if (!activeId) {
            setMessages([]);
        }
    }, [activeId, activeTab]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const loadMessages = async () => {
        if (!activeId) return;
        setIsLoading(true);
        try {
            if (activeTab === "direct") {
                const data = await getDirectMessages(activeId);
                setMessages(data);
            } else {
                const data = await getCommunityMessages(activeId);
                setMessages(data);
            }
        } catch (error) {
            toast.error("Failed to load messages");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !activeId) return;

        const content = newMessage;
        setNewMessage("");

        const tempId = Math.random().toString();
        const tempMsg = {
            id: tempId,
            content,
            senderId: currentUser.id,
            createdAt: new Date(),
            sender: { name: currentUser.name, imageUrl: currentUser.imageUrl }
        };

        setMessages(prev => [...prev, tempMsg]);

        try {
            if (activeTab === "direct") {
                await sendDirectMessage({ conversationId: activeId, content });
            } else {
                await sendCommunityMessage({ communityId: activeId, content });
            }
        } catch (error) {
            toast.error("Failed to send message");
            setMessages(prev => prev.filter(m => m.id !== tempId));
            setNewMessage(content);
        }
    };

    const handleStartConversation = async (userId: string) => {
        try {
            const conv = await getOrCreateConversation(userId);
            setActiveTab("direct");
            setActiveId(conv.id);
            setSearchQuery("");
            router.refresh();
        } catch (error) {
            toast.error("Failed to start conversation");
        }
    };

    const handleCreateGroup = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!groupData.title || !groupData.description) return;

        try {
            const group = await createCommunity({
                title: groupData.title,
                description: groupData.description,
                department: groupData.department || currentUser.department || "General",
            });
            toast.success("Group created successfully!");
            setShowCreateGroup(false);
            setGroupData({ title: "", description: "", department: "" });
            setActiveTab("community");
            setActiveId(group.id);
            router.refresh();
        } catch (error) {
            toast.error("Failed to create group");
        }
    };

    const handleJoinGroup = async (communityId: string) => {
        try {
            await joinCommunity(communityId);
            toast.success("Joined group!");
            setActiveTab("community");
            setActiveId(communityId);
            router.refresh();
        } catch (error) {
            toast.error("Failed to join group");
        }
    };

    const filteredConversations = conversations.filter(c =>
        c.otherUser?.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredUsers = availableUsers.filter(u =>
        u.name?.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !conversations.some(c => c.otherUser?.id === u.id)
    );

    const filteredCommunities = communities.filter(c =>
        c.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const activeChatPartner = activeTab === "direct"
        ? conversations.find(c => c.id === activeId)?.otherUser
        : communities.find(c => c.id === activeId);

    return (
        <div className="flex h-[calc(100vh-8rem)] gap-0 border border-white/10 rounded-2xl overflow-hidden bg-black shadow-2xl relative text-white">
            {/* Sidebar */}
            <div className={`w-full md:w-80 flex flex-col border-r border-white/10 bg-zinc-950/50 backdrop-blur-md ${activeId ? 'hidden md:flex' : 'flex'}`}>
                <div className="p-4 space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-black tracking-tight text-white uppercase italic">Messages</h2>
                        {currentUser.role === "MENTOR" && (
                            <Button size="icon" variant="ghost" onClick={() => setShowCreateGroup(true)} className="rounded-full hover:bg-white/10 text-white">
                                <Plus className="w-5 h-5" />
                            </Button>
                        )}
                    </div>

                    <div className="flex p-1 bg-zinc-900/50 rounded-xl border border-white/5">
                        <button
                            onClick={() => { setActiveTab("direct"); setActiveId(null); }}
                            className={`flex-1 flex items-center justify-center gap-2 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${activeTab === "direct" ? 'bg-white text-black shadow-lg' : 'text-zinc-500 hover:text-white'}`}
                        >
                            <MessageSquare className="w-3.5 h-3.5" />
                            Direct
                        </button>
                        <button
                            onClick={() => { setActiveTab("community"); setActiveId(null); }}
                            className={`flex-1 flex items-center justify-center gap-2 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${activeTab === "community" ? 'bg-white text-black shadow-lg' : 'text-zinc-500 hover:text-white'}`}
                        >
                            <Users className="w-3.5 h-3.5" />
                            Groups
                        </button>
                        <button
                            onClick={() => { setActiveTab("discover"); setActiveId(null); }}
                            className={`flex-1 flex items-center justify-center gap-2 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${activeTab === "discover" ? 'bg-white text-black shadow-lg' : 'text-zinc-500 hover:text-white'}`}
                        >
                            <Compass className="w-3.5 h-3.5" />
                            Find
                        </button>
                    </div>

                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                        <Input
                            placeholder="SEARCH CHATS..."
                            className="pl-9 rounded-xl bg-zinc-900 border-none h-10 text-[10px] font-bold tracking-widest uppercase placeholder:text-zinc-600 focus-visible:ring-1 focus-visible:ring-white/20"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto px-2 pb-4 space-y-1">
                    {activeTab === "direct" && (
                        <>
                            {filteredConversations.map((conv) => (
                                <button
                                    key={conv.id}
                                    onClick={() => setActiveId(conv.id)}
                                    className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all group ${activeId === conv.id ? 'bg-white text-black shadow-xl ring-1 ring-white/20' : 'hover:bg-white/5'}`}
                                >
                                    <div className="relative shrink-0">
                                        <div className={`w-12 h-12 rounded-full overflow-hidden bg-zinc-900 flex items-center justify-center ring-2 ${activeId === conv.id ? 'ring-black/10' : 'ring-white/5'}`}>
                                            {conv.otherUser?.imageUrl ? (
                                                <img src={conv.otherUser.imageUrl} alt={conv.otherUser.name || ""} className="w-full h-full object-cover" />
                                            ) : (
                                                <span className={`text-lg font-black ${activeId === conv.id ? 'text-black' : 'text-white'}`}>{conv.otherUser?.name?.[0] || "U"}</span>
                                            )}
                                        </div>
                                        {conv.hasUnread && (
                                            <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-white border-2 border-black rounded-full shadow-lg" />
                                        )}
                                    </div>
                                    <div className="flex-1 text-left min-w-0">
                                        <div className="flex justify-between items-center mb-0.5">
                                            <span className="font-black truncate text-xs uppercase tracking-tight">
                                                {conv.otherUser?.name}
                                            </span>
                                            {conv.lastMessage && (
                                                <span className={`text-[9px] font-bold shrink-0 ${activeId === conv.id ? 'text-black/60' : 'text-zinc-500'}`}>
                                                    {format(new Date(conv.lastMessage.createdAt), "HH:mm")}
                                                </span>
                                            )}
                                        </div>
                                        <p className={`text-[10px] font-medium truncate ${activeId === conv.id ? 'text-black/70' : 'text-zinc-400'}`}>
                                            {conv.lastMessage?.content || "Tap to start chat"}
                                        </p>
                                    </div>
                                </button>
                            ))}

                            {searchQuery && filteredUsers.length > 0 && (
                                <div className="mt-4 pt-4 border-t border-white/5 px-2">
                                    <h3 className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.2em] mb-3 ml-1 text-center">New Connections</h3>
                                    {filteredUsers.map((user) => (
                                        <button
                                            key={user.id}
                                            onClick={() => handleStartConversation(user.id)}
                                            className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-all text-left"
                                        >
                                            <div className="w-10 h-10 rounded-full overflow-hidden bg-zinc-900 border border-white/5 flex items-center justify-center">
                                                {user.imageUrl ? (
                                                    <img src={user.imageUrl} alt={user.name || ""} className="w-full h-full object-cover" />
                                                ) : (
                                                    <span className="text-sm font-black text-white">{user.name?.[0]}</span>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="font-bold text-xs truncate uppercase tracking-tight">{user.name}</div>
                                                <div className="text-[9px] text-zinc-500 uppercase font-black tracking-widest">{user.role} • {user.department || "GEN"}</div>
                                            </div>
                                            <Plus className="w-4 h-4 text-zinc-600" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </>
                    )}

                    {activeTab === "community" && (
                        <>
                            {filteredCommunities.map((community) => (
                                <button
                                    key={community.id}
                                    onClick={() => setActiveId(community.id)}
                                    className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${activeId === community.id ? 'bg-white text-black shadow-xl' : 'hover:bg-white/5'}`}
                                >
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors ${activeId === community.id ? 'bg-black/5 text-black' : 'bg-zinc-900 text-white'}`}>
                                        <Hash className={`w-6 h-6 font-black`} />
                                    </div>
                                    <div className="flex-1 text-left min-w-0">
                                        <div className="font-black truncate text-xs uppercase tracking-tight">{community.title}</div>
                                        <div className={`text-[9px] font-bold uppercase tracking-widest ${activeId === community.id ? 'text-black/60' : 'text-zinc-500'}`}>
                                            {community._count.members} Members • {community.mentor.name}
                                        </div>
                                    </div>
                                </button>
                            ))}
                            {communities.length === 0 && (
                                <div className="text-center p-8 space-y-2">
                                    <Users className="w-8 h-8 text-zinc-800 mx-auto" />
                                    <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.2em]">Zero Groups Joined</p>
                                    <Button variant="outline" size="sm" onClick={() => setActiveTab("discover")} className="rounded-full text-[9px] font-black uppercase border-white/10 hover:bg-white hover:text-black">
                                        Explore Now
                                    </Button>
                                </div>
                            )}
                        </>
                    )}

                    {activeTab === "discover" && (
                        <div className="space-y-4 pt-2">
                            {availableCommunities.map((group) => (
                                <div key={group.id} className="p-4 rounded-2xl bg-zinc-900/50 border border-white/5 space-y-3 transition-all hover:border-white/20">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h3 className="font-black text-xs uppercase tracking-tight">{group.title}</h3>
                                            <p className="text-[10px] text-zinc-500 line-clamp-2 mt-1 font-medium">{group.description}</p>
                                        </div>
                                        <Badge variant="outline" className="text-[8px] uppercase font-black border-white/20 text-zinc-400">{group.department}</Badge>
                                    </div>
                                    <div className="flex items-center justify-between pt-1">
                                        <div className="text-[9px] text-zinc-500 uppercase font-black tracking-widest">
                                            Mentor: <span className="text-white">{group.mentor.name}</span>
                                        </div>
                                        <Button size="sm" onClick={() => handleJoinGroup(group.id)} className="h-7 px-4 text-[9px] font-bold rounded-full bg-white text-black hover:bg-zinc-200 uppercase tracking-widest">
                                            Join
                                        </Button>
                                    </div>
                                </div>
                            ))}
                            {availableCommunities.length === 0 && (
                                <div className="text-center p-8">
                                    <p className="text-[10px] text-zinc-600 font-black uppercase tracking-widest">No New Voids to Fill</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Chat Area */}
            <div className={`flex-1 flex flex-col bg-black min-w-0 ${!activeId ? 'hidden md:flex' : 'flex'}`}>
                {activeId ? (
                    <>
                        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-black/80 backdrop-blur-md sticky top-0 z-10 shadow-2xl">
                            <div className="flex items-center gap-3">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="md:hidden rounded-full text-white"
                                    onClick={() => setActiveId(null)}
                                >
                                    <ArrowLeft className="w-5 h-5" />
                                </Button>
                                <div className="w-10 h-10 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center overflow-hidden">
                                    {activeTab === "direct" ? (
                                        (activeChatPartner as any)?.imageUrl ? (
                                            <img src={(activeChatPartner as any).imageUrl} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="font-black text-white">{(activeChatPartner as any)?.name?.[0]}</span>
                                        )
                                    ) : (
                                        <Hash className="w-5 h-5 text-white" />
                                    )}
                                </div>
                                <div>
                                    <h3 className="font-black text-xs uppercase tracking-widest">
                                        {activeTab === "direct" ? (activeChatPartner as any)?.name : (activeChatPartner as any)?.title}
                                    </h3>
                                    <div className="flex items-center gap-1.5 mt-0.5">
                                        <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                                        <span className="text-[9px] text-zinc-500 font-black uppercase tracking-tighter">Secure Line</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto px-4 py-6 scrollbar-hide" ref={scrollRef}>
                            <div className="space-y-8 max-w-4xl mx-auto">
                                {messages.map((msg, idx) => {
                                    const isMe = msg.senderId === currentUser.id;
                                    const showHeader = idx === 0 || messages[idx - 1].senderId !== msg.senderId;

                                    return (
                                        <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                                            {showHeader && !isMe && (
                                                <div className="flex items-center gap-2 mb-1 px-1">
                                                    <span className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.2em]">{msg.sender.name}</span>
                                                </div>
                                            )}
                                            <div className={`flex gap-3 max-w-[85%] md:max-w-[70%] ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                                                {!isMe && showHeader && (
                                                    <div className="w-6 h-6 rounded-full bg-zinc-800 border border-white/5 overflow-hidden shrink-0 mt-1 self-start">
                                                        {msg.sender.imageUrl ? (
                                                            <img src={msg.sender.imageUrl} alt="" className="w-full h-full object-cover" />
                                                        ) : (
                                                            <span className="text-[8px] font-black flex items-center justify-center h-full text-zinc-400">{msg.sender.name?.[0]}</span>
                                                        )}
                                                    </div>
                                                )}
                                                {!isMe && !showHeader && <div className="w-6 shrink-0" />}

                                                <div className="group relative">
                                                    <div className={`p-4 text-xs font-medium leading-relaxed shadow-lg ${isMe
                                                        ? 'bg-white text-black rounded-2xl rounded-tr-none'
                                                        : 'bg-zinc-900 text-white border border-white/5 rounded-2xl rounded-tl-none'
                                                        }`}>
                                                        {msg.content}
                                                    </div>
                                                    <div className={`absolute top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-[8px] font-black uppercase text-zinc-600 tracking-tighter whitespace-nowrap ${isMe ? 'right-full mr-3 text-right' : 'left-full ml-3'}`}>
                                                        {format(new Date(msg.createdAt), "HH:mm")}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                                {isLoading && messages.length === 0 && (
                                    <div className="flex flex-col items-center justify-center h-full gap-4 text-zinc-500">
                                        <Loader2 className="w-8 h-8 animate-spin text-white" />
                                        <p className="text-[10px] font-black uppercase tracking-[0.3em]">Establishing Void...</p>
                                    </div>
                                )}
                                {!isLoading && messages.length === 0 && (
                                    <div className="flex flex-col items-center justify-center h-48 gap-4 border border-zinc-900 border-dashed rounded-[32px] bg-zinc-950/20">
                                        <div className="p-3 bg-white/5 rounded-full border border-white/10">
                                            <MessageSquare className="w-6 h-6 text-white" />
                                        </div>
                                        <p className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.4em]">Initialize Conversation</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="p-4 bg-black border-t border-white/5">
                            <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto flex items-end gap-3">
                                <div className="flex-1 relative">
                                    <textarea
                                        rows={1}
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                e.preventDefault();
                                                handleSendMessage(e as any);
                                            }
                                        }}
                                        placeholder="WRITE YOUR MESSAGE..."
                                        className="w-full bg-zinc-900/80 border border-white/5 rounded-2xl py-4 px-5 pr-14 text-xs font-medium focus:ring-1 focus:ring-white/20 resize-none max-h-32 transition-all outline-none text-white placeholder:text-zinc-700 placeholder:italic"
                                        style={{ height: 'auto' }}
                                    />
                                    <Button
                                        type="submit"
                                        disabled={!newMessage.trim()}
                                        className="absolute right-2.5 bottom-2.5 w-10 h-10 rounded-xl p-0 bg-white text-black hover:bg-zinc-200 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                                    >
                                        <Send className="w-4 h-4" />
                                    </Button>
                                </div>
                            </form>
                            <p className="text-center text-[8px] text-zinc-700 mt-4 font-black uppercase tracking-[0.3em]">
                                ENTER TO TRANSMIT • END-TO-END SECURE
                            </p>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-8 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_0%,transparent_100%)]">
                        <div className="relative">
                            <div className="absolute inset-0 bg-white/10 blur-[100px] rounded-full" />
                            <div className="w-32 h-32 rounded-[48px] bg-zinc-950 border border-white/10 flex items-center justify-center relative shadow-[0_0_50px_rgba(0,0,0,1)]">
                                <motion.div
                                    animate={{
                                        scale: [1, 1.1, 1],
                                        opacity: [0.3, 0.6, 0.3]
                                    }}
                                    transition={{ duration: 4, repeat: Infinity }}
                                >
                                    <MessageSquare className="w-12 h-12 text-white" />
                                </motion.div>
                            </div>
                        </div>
                        <div className="space-y-4 max-w-sm">
                            <h2 className="text-3xl font-black tracking-tighter text-white uppercase italic">Neural Network</h2>
                            <p className="text-[11px] text-zinc-400 leading-relaxed font-medium uppercase tracking-wider">
                                Enter the encrypted mentorship grid. Connect with specialized nodes to accelerate your learning trajectory.
                            </p>
                        </div>
                        <div className="flex flex-col gap-3 w-full max-w-[220px]">
                            <Button onClick={() => setActiveTab("discover")} variant="ghost" className="rounded-2xl border border-white/10 text-zinc-400 hover:bg-white hover:text-black hover:border-white font-black uppercase text-[10px] tracking-widest h-12">
                                Explore Groups
                            </Button>
                            <Button onClick={() => setActiveTab("direct")} className="rounded-2xl bg-white text-black hover:bg-zinc-200 font-black uppercase text-[10px] tracking-widest h-12 shadow-[0_10px_30px_rgba(255,255,255,0.1)]">
                                Start Stream
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            {/* Create Group Modal */}
            <AnimatePresence>
                {showCreateGroup && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 30 }}
                            className="w-full max-w-lg bg-black border border-white/10 rounded-[40px] shadow-[0_0_50px_rgba(255,255,255,0.05)] overflow-hidden p-10 relative"
                        >
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-1 bg-white/10 rounded-full" />

                            <div className="flex justify-between items-center mb-10">
                                <h3 className="text-3xl font-black tracking-tighter uppercase italic text-white underline decoration-white/20 underline-offset-8">New Grid</h3>
                                <Button variant="ghost" size="icon" onClick={() => setShowCreateGroup(false)} className="rounded-full hover:bg-white/10 text-white">
                                    <Plus className="w-6 h-6 rotate-45" />
                                </Button>
                            </div>
                            <form onSubmit={handleCreateGroup} className="space-y-8">
                                <div className="space-y-3">
                                    <label className="text-[9px] font-black uppercase text-zinc-500 tracking-[0.3em] ml-2">Objective Name</label>
                                    <Input
                                        required
                                        placeholder="QUANTUM COMPUTING SYMPOSIUM"
                                        className="h-14 rounded-2xl bg-zinc-900 border-none text-white font-bold uppercase tracking-widest px-6 focus-visible:ring-1 focus-visible:ring-white/30"
                                        value={groupData.title}
                                        onChange={(e) => setGroupData({ ...groupData, title: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[9px] font-black uppercase text-zinc-500 tracking-[0.3em] ml-2">Mission Protocol</label>
                                    <textarea
                                        required
                                        placeholder="Define the scope of knowledge transfer..."
                                        rows={4}
                                        className="w-full h-32 rounded-2xl bg-zinc-900 border-none p-6 text-sm font-medium focus:ring-1 focus:ring-white/30 outline-none resize-none text-white"
                                        value={groupData.description}
                                        onChange={(e) => setGroupData({ ...groupData, description: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[9px] font-black uppercase text-zinc-500 tracking-[0.3em] ml-2">Sector Integration</label>
                                    <Input
                                        placeholder="PHYSICS FACULTY"
                                        className="h-14 rounded-2xl bg-zinc-900 border-none text-white font-bold uppercase tracking-widest px-6 focus-visible:ring-1 focus-visible:ring-white/30"
                                        value={groupData.department}
                                        onChange={(e) => setGroupData({ ...groupData, department: e.target.value })}
                                    />
                                </div>
                                <Button type="submit" className="w-full h-16 rounded-[24px] text-sm font-black uppercase tracking-[0.4em] bg-white text-black hover:bg-zinc-200 shadow-[0_20px_40px_rgba(255,255,255,0.05)]">
                                    INITIALIZE GRID
                                </Button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
