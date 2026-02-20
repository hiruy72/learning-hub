"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { uploadResource } from "@/actions/resource";
import { Loader2, ArrowLeft, Upload, Link as LinkIcon, FileText, StickyNote } from "lucide-react";
import Link from "next/link";

export default function ResourceUploadPage() {
    const [loading, setLoading] = useState(false);
    const [resourceType, setResourceType] = useState("PDF");
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        link: "",
        communityId: "", // In a real app, this would be passed via query param or selected
    });
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await uploadResource({
                ...formData,
                type: resourceType
            });
            router.back();
        } catch (error: any) {
            console.error(error);
            alert(error.message || "Failed to upload resource. Ensure you are a mentor.");
        } finally {
            setLoading(false);
        }
    };

    const types = [
        { id: "PDF", icon: FileText, label: "PDF Document" },
        { id: "LINK", icon: LinkIcon, label: "Web Link" },
        { id: "NOTE", icon: StickyNote, label: "Study Note" },
    ];

    return (
        <div className="max-w-2xl mx-auto px-4 py-12">
            <Link
                href="/dashboard/resources"
                className="flex items-center gap-2 text-gray-500 hover:text-white mb-12 uppercase text-[10px] font-bold tracking-[0.3em] transition-colors"
            >
                <ArrowLeft className="h-3 w-3" /> Back
            </Link>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className="flex items-center gap-4 mb-2">
                    <Upload className="h-8 w-8 text-white" />
                    <h1 className="text-4xl font-bold tracking-tight uppercase">Upload Resource</h1>
                </div>
                <p className="text-gray-500 mb-12 uppercase text-xs tracking-widest">
                    Provide valuable materials to your students and peers.
                </p>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="space-y-4">
                        <label className="text-sm font-medium uppercase tracking-widest text-gray-400">
                            Select Resource Type
                        </label>
                        <div className="grid grid-cols-3 gap-4">
                            {types.map((type) => (
                                <button
                                    key={type.id}
                                    type="button"
                                    onClick={() => setResourceType(type.id)}
                                    className={`flex flex-col items-center justify-center p-6 rounded-2xl border transition-all ${resourceType === type.id
                                            ? "bg-white text-black border-white"
                                            : "bg-zinc-950 text-gray-500 border-white/10 hover:border-white/30"
                                        }`}
                                >
                                    <type.icon className="h-6 w-6 mb-2" />
                                    <span className="text-[10px] font-bold uppercase tracking-tighter">{type.id}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium uppercase tracking-widest text-gray-400">
                            Title
                        </label>
                        <input
                            required
                            className="w-full bg-black border border-white/10 rounded-lg p-4 text-white focus:outline-none focus:ring-1 focus:ring-white"
                            placeholder="e.g. Week 4 - Calculus Part 1"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium uppercase tracking-widest text-gray-400">
                            Description (Optional)
                        </label>
                        <textarea
                            className="w-full bg-black border border-white/10 rounded-lg p-4 text-white focus:outline-none focus:ring-1 focus:ring-white min-h-[100px]"
                            placeholder="Brief summary of the content..."
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium uppercase tracking-widest text-gray-400">
                            {resourceType === "LINK" ? "URL Link" : "Resource Link / File URL"}
                        </label>
                        <div className="relative">
                            <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                            <input
                                required
                                type="url"
                                className="w-full bg-black border border-white/10 rounded-lg p-4 pl-12 text-white focus:outline-none focus:ring-1 focus:ring-white"
                                placeholder="https://..."
                                value={formData.link}
                                onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium uppercase tracking-widest text-gray-400">
                            Community ID (Target)
                        </label>
                        <input
                            required
                            className="w-full bg-black border border-white/10 rounded-lg p-4 text-white focus:outline-none focus:ring-1 focus:ring-white"
                            placeholder="Enter context community ID..."
                            value={formData.communityId}
                            onChange={(e) => setFormData({ ...formData, communityId: e.target.value })}
                        />
                    </div>

                    <Button
                        type="submit"
                        className="w-full h-14 bg-white text-black hover:bg-gray-200 text-lg font-bold uppercase tracking-[0.2em]"
                        disabled={loading}
                    >
                        {loading ? <Loader2 className="animate-spin mr-2" /> : "Publish Resource"}
                    </Button>
                </form>
            </motion.div>
        </div>
    );
}
