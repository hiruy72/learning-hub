"use client";

import { useState, useEffect, useRef } from "react";
import { User } from "@prisma/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Search, Users, MessageSquare, Plus } from "lucide-react";
import { 
    getDirectMessages, 
    sendDirectMessage, 
    getCommunityMessages, 
    sendCommunityMessage,
    getOrCreateConversation
} from "@/actions/chat";
import { toast } from "sonner";
import { format } from "date-fns";
import { useRouter } from "next/navigation";

type ConversationType = any; // Replace with actual type from getUserConversations
type AvailableUserType = any; // Replace with actual type from getAvailableUsers
type CommunityType = any; // Replace with actual type from getUserJoinedCommunities

interface ChatClientProps {
    currentUser: User;
    conversations: ConversationType[];
    availableUsers: AvailableUserType[];
    communities: CommunityType[];
    initialConversationId?: string;
    initialCommunityId?: string;
}

export function ChatClient({
    currentUser,
    conversations: initialConversations,
    availableUsers,
    communities,
    initialConversationId,
    initialCommunityId
}: ChatClientProps) {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<"direct" | "community">(initialCommunityId ? "community" : "direct");
    const [activeId, setActiveId] = useState<string | null>(initialConversationId || initialCommunityId || null);
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (activeId) {
            loadMessages();
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

        try {
            if (activeTab === "direct") {
                const msg = await sendDirectMessage({ conversationId: activeId, content });
                setMessages(prev => [...prev, msg]);
            } else {
                const msg = await sendCommunityMessage({ communityId: activeId, content });
                setMessages(prev => [...prev, msg]);
            }
        } catch (error) {
            toast.error("Failed to send message");
            setNewMessage(content); // Restore message on failure
        }
    };

    const startNewConversation = async (userId: string) => {
        try {
            const conv = await getOrCreateConversation(userId);
            setActiveTab("direct");
            setActiveId(conv.id);
            router.refresh();
        } catch (error) {
            toast.error("Failed to start conversation");
        }
    };

    const filteredUsers = availableUsers.filter((u: any) => 
        u.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex h-[calc(100vh-12rem)] gap-4">
            {/* Sidebar */}
            <Card className="w-80 flex flex-col">
                <CardHeader className="p-4 pb-2">
                    <div className="flex gap-2 mb-4">
                        <Button 
                            variant={activeTab === "direct" ? "default" : "outline"} 
                            className="flex-1"
                            onClick={() => setActiveTab("direct")}
                        >
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Direct
                        </Button>
                        <Button 
                            variant={activeTab === "community" ? "default" : "outline"} 
                            className="flex-1"
                            onClick={() => setActiveTab("community")}
                        >
                            <Users className="w-4 h-4 mr-2" />
                            Groups
                        </Button>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input 
                            placeholder="Search..." 
                            className="pl-8"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </CardHeader>
                <CardContent className="flex-1 p-0 overflow-hidden flex flex-col">
                    <div className="flex-1 overflow-y-auto">
                        {activeTab === "direct" ? (
                            <div className="p-2 space-y-1">
                                {initialConversations.map((conv: any) => (
                                    <button
                                        key={conv.id}
                                        onClick={() => setActiveId(conv.id)}
                                        className={`w-full flex items-center gap-3 p-2 rounded-lg hover:bg-accent transition-colors ${activeId === conv.id ? 'bg-accent' : ''}`}
                                    >
                                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                                            {conv.otherUser?.imageUrl ? (
                                                <img src={conv.otherUser.imageUrl} alt={conv.otherUser.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="text-sm font-medium">{conv.otherUser?.name?.[0] || "U"}</span>
                                            )}
                                        </div>
                                        <div className="flex-1 text-left overflow-hidden">
                                            <div className="font-medium truncate">{conv.otherUser?.name}</div>
                                            <div className="text-xs text-muted-foreground truncate">
                                                {conv.lastMessage?.content || "No messages yet"}
                                            </div>
                                        </div>
                                        {conv.hasUnread && (
                                            <div className="w-2 h-2 bg-primary rounded-full"></div>
                                        )}
                                    </button>
                                ))}
                                
                                {searchQuery && (
                                    <div className="mt-4">
                                        <div className="text-xs font-semibold text-muted-foreground px-2 mb-2 uppercase">New Conversation</div>
                                        {filteredUsers.map((user: any) => (
                                            <button
                                                key={user.id}
                                                onClick={() => startNewConversation(user.id)}
                                                className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-accent transition-colors"
                                            >
                                                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                                                    {user.imageUrl ? (
                                                        <img src={user.imageUrl} alt={user.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <span className="text-sm font-medium">{user.name?.[0] || "U"}</span>
                                                    )}
                                                </div>
                                                <div className="flex-1 text-left">
                                                    <div className="font-medium">{user.name}</div>
                                                    <div className="text-xs text-muted-foreground">{user.role}</div>
                                                </div>
                                                <Plus className="w-4 h-4 text-muted-foreground" />
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="p-2 space-y-1">
                                {communities.map((community: any) => (
                                    <button
                                        key={community.id}
                                        onClick={() => setActiveId(community.id)}
                                        className={`w-full flex items-center gap-3 p-2 rounded-lg hover:bg-accent transition-colors ${activeId === community.id ? 'bg-accent' : ''}`}
                                    >
                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                            {community.name[0]}
                                        </div>
                                        <div className="flex-1 text-left overflow-hidden">
                                            <div className="font-medium truncate">{community.name}</div>
                                            <div className="text-xs text-muted-foreground">
                                                {community._count.members} members
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Chat Area */}
            <Card className="flex-1 flex flex-col">
                {activeId ? (
                    <>
                        <CardHeader className="border-b p-4">
                            <CardTitle className="text-lg">
                                {activeTab === "direct" 
                                    ? initialConversations.find((c: any) => c.id === activeId)?.otherUser?.name || "Chat"
                                    : communities.find((c: any) => c.id === activeId)?.name || "Community Chat"
                                }
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1 p-4 flex flex-col overflow-hidden">
                            <div className="flex-1 pr-4 overflow-y-auto" ref={scrollRef}>
                                <div className="space-y-4">
                                    {messages.map((msg: any) => {
                                        const isMe = msg.senderId === currentUser.id;
                                        return (
                                            <div key={msg.id} className={`flex gap-3 ${isMe ? 'flex-row-reverse' : ''}`}>
                                                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center overflow-hidden shrink-0">
                                                    {msg.sender?.imageUrl ? (
                                                        <img src={msg.sender.imageUrl} alt={msg.sender.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <span className="text-xs font-medium">{msg.sender?.name?.[0] || "U"}</span>
                                                    )}
                                                </div>
                                                <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[70%]`}>
                                                    <div className="flex items-baseline gap-2 mb-1">
                                                        <span className="text-sm font-medium">{msg.sender?.name}</span>
                                                        <span className="text-xs text-muted-foreground">
                                                            {format(new Date(msg.createdAt), "HH:mm")}
                                                        </span>
                                                    </div>
                                                    <div className={`p-3 rounded-lg ${isMe ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                                                        {msg.content}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    {isLoading && messages.length === 0 && (
                                        <div className="text-center text-muted-foreground py-4">Loading messages...</div>
                                    )}
                                    {!isLoading && messages.length === 0 && (
                                        <div className="text-center text-muted-foreground py-4">No messages yet. Start the conversation!</div>
                                    )}
                                </div>
                            </div>
                            <form onSubmit={handleSendMessage} className="mt-4 flex gap-2">
                                <Input
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Type a message..."
                                    className="flex-1"
                                />
                                <Button type="submit" disabled={!newMessage.trim()}>
                                    <Send className="w-4 h-4" />
                                </Button>
                            </form>
                        </CardContent>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-muted-foreground flex-col gap-4">
                        <MessageSquare className="w-12 h-12 opacity-20" />
                        <p>Select a conversation or start a new one</p>
                    </div>
                )}
            </Card>
        </div>
    );
}
