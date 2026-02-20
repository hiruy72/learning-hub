"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
    Search,
    Send,
    User,
    MoreVertical,
    Phone,
    Video,
    Circle
} from "lucide-react";
import Image from "next/image";

export default function ChatPage() {
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState<any[]>([
        { id: 1, text: "Hey! How is the exam preparation going?", sender: "other", time: "10:30 AM" },
        { id: 2, text: "It's going well, just stuck on the networking part.", sender: "me", time: "10:32 AM" },
        { id: 3, text: "I can help you with that tonight in the community meet!", sender: "other", time: "10:35 AM" },
    ]);

    const contacts = [
        { id: 1, name: "Mentor Alex", role: "MENTOR", lastMsg: "See you at 8 PM!", online: true, image: null },
        { id: 2, name: "Sarah Jenkins", role: "MENTEE", lastMsg: "Thanks for the notes!", online: false, image: null },
        { id: 3, name: "Prof. Thompson", role: "ADMIN", lastMsg: "Application approved.", online: true, image: null },
    ];

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim()) return;

        const newMsg = {
            id: Date.now(),
            text: message,
            sender: "me",
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages([...messages, newMsg]);
        setMessage("");
    };

    return (
        <div className="flex h-[calc(100vh-4rem)] border-t border-white/10 overflow-hidden bg-black">
            {/* Sidebar: Contacts */}
            <div className="w-full md:w-80 border-r border-white/10 flex flex-col hidden md:flex">
                <div className="p-6">
                    <h2 className="text-xl font-bold uppercase mb-4 tracking-tighter">Messages</h2>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search contacts..."
                            className="w-full bg-black border border-white/10 rounded-none py-3 pl-10 pr-4 text-xs uppercase tracking-widest focus:ring-1 focus:ring-white"
                        />
                    </div>
                </div>

                <div className="flex-grow overflow-y-auto">
                    {contacts.map((contact) => (
                        <button
                            key={contact.id}
                            onClick={() => setSelectedUser(contact)}
                            className={`w-full p-6 flex items-center gap-4 transition-all hover:bg-white/5 border-l-2 ${selectedUser?.id === contact.id ? 'border-white bg-white/5' : 'border-transparent'
                                }`}
                        >
                            <div className="relative">
                                <div className="h-12 w-12 rounded-none bg-black flex items-center justify-center text-gray-400 font-bold uppercase border border-white/10">
                                    {contact.name.charAt(0)}
                                </div>
                                {contact.online && (
                                    <Circle className="absolute bottom-0 right-0 h-3 w-3 fill-green-500 text-green-500 border-2 border-black rounded-none" />
                                )}
                            </div>
                            <div className="flex-grow text-left">
                                <div className="flex justify-between items-start">
                                    <h3 className="text-sm font-bold uppercase tracking-tight">{contact.name}</h3>
                                    <span className="text-[10px] text-gray-400 font-bold">{contact.role}</span>
                                </div>
                                <p className="text-xs text-gray-400 line-clamp-1 uppercase tracking-widest mt-1">
                                    {contact.lastMsg}
                                </p>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex-grow flex flex-col relative">
                {selectedUser ? (
                    <>
                        {/* Chat Header */}
                        <div className="h-20 border-b border-white/10 flex items-center justify-between px-8 bg-black/50 backdrop-blur-md">
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 rounded-none bg-black flex items-center justify-center text-sm font-bold border border-white/10">
                                    {selectedUser.name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="font-bold uppercase text-sm tracking-widest">{selectedUser.name}</h3>
                                    <p className="text-[10px] text-green-500 font-bold uppercase tracking-[0.2em]">
                                        {selectedUser.online ? "Online Now" : "Away"}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-6 text-gray-400">
                                <Phone className="h-5 w-5 hover:text-white cursor-pointer transition-colors" />
                                <Video className="h-5 w-5 hover:text-white cursor-pointer transition-colors" />
                                <MoreVertical className="h-5 w-5 hover:text-white cursor-pointer transition-colors" />
                            </div>
                        </div>

                        {/* Messages Display */}
                        <div className="flex-grow overflow-y-auto p-8 flex flex-col gap-6 custom-scrollbar">
                            <div className="text-center my-8">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] bg-black border border-white/10 px-4 py-1 rounded-none">
                                    Today
                                </span>
                            </div>

                            {messages.map((msg) => (
                                <motion.div
                                    key={msg.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex flex-col ${msg.sender === "me" ? 'items-end' : 'items-start'}`}
                                >
                                    <div className={`max-w-[80%] p-4 rounded-none text-sm ${msg.sender === "me"
                                        ? 'bg-white text-black'
                                        : 'bg-black text-white border border-white/10'
                                        }`}>
                                        {msg.text}
                                    </div>
                                    <span className="text-[10px] text-gray-400 font-bold uppercase mt-2 tracking-widest">
                                        {msg.time}
                                    </span>
                                </motion.div>
                            ))}
                        </div>

                        {/* Message Input */}
                        <div className="p-8 border-t border-white/10">
                            <form onSubmit={handleSendMessage} className="flex items-center gap-4 bg-zinc-950 border border-white/10 rounded-none p-2 pl-6">
                                <input
                                    type="text"
                                    placeholder="Type a message..."
                                    className="flex-grow bg-transparent border-none text-white focus:ring-0 uppercase text-xs tracking-widest h-12"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                />
                                <Button
                                    type="submit"
                                    className="h-12 w-12 rounded-none bg-white text-black hover:bg-gray-200"
                                >
                                    <Send className="h-5 w-5" />
                                </Button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="flex-grow flex flex-col items-center justify-center text-center p-12">
                        <div className="h-24 w-24 bg-black border border-white/10 rounded-none flex items-center justify-center mb-6">
                            <Send className="h-10 w-10 text-gray-400" />
                        </div>
                        <h2 className="text-2xl font-bold uppercase mb-2">Your Inbox</h2>
                        <p className="text-gray-400 uppercase text-xs tracking-widest max-w-xs leading-loose">
                            Select a contact from the sidebar to start a secure conversation.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
