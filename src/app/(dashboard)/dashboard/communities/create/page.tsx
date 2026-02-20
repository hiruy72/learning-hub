"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { createCommunity } from "@/actions/community";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function CreateCommunityPage() {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        department: "",
        meetLink: "",
    });
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const community = await createCommunity(formData);
            router.push(`/dashboard/communities/${community.id}`);
        } catch (error: any) {
            console.error(error);
            alert(error.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto px-4 py-12">
            <Link
                href="/dashboard/communities"
                className="flex items-center gap-2 text-gray-500 hover:text-white mb-12 uppercase text-[10px] font-bold tracking-[0.3em] transition-colors"
            >
                <ArrowLeft className="h-3 w-3" /> Back
            </Link>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="text-4xl font-bold tracking-tight mb-2 uppercase">Create Community</h1>
                <p className="text-gray-500 mb-12 uppercase text-xs tracking-widest leading-loose">
                    Establish a new department-specific group for mentorship.
                </p>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="space-y-2">
                        <label className="text-sm font-medium uppercase tracking-widest text-gray-400">
                            Community Title
                        </label>
                        <input
                            required
                            className="w-full bg-black border border-white/10 rounded-lg p-4 text-white focus:outline-none focus:ring-1 focus:ring-white"
                            placeholder="e.g. Computer Science Freshers 2026"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium uppercase tracking-widest text-gray-400">
                            Department
                        </label>
                        <input
                            required
                            className="w-full bg-black border border-white/10 rounded-lg p-4 text-white focus:outline-none focus:ring-1 focus:ring-white"
                            placeholder="e.g. Computer Science"
                            value={formData.department}
                            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium uppercase tracking-widest text-gray-400">
                            Description
                        </label>
                        <textarea
                            required
                            className="w-full bg-black border border-white/10 rounded-lg p-4 text-white focus:outline-none focus:ring-1 focus:ring-white min-h-[120px]"
                            placeholder="What is this community about?"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium uppercase tracking-widest text-gray-400">
                            Google Meet Link (Optional)
                        </label>
                        <input
                            className="w-full bg-black border border-white/10 rounded-lg p-4 text-white focus:outline-none focus:ring-1 focus:ring-white"
                            placeholder="https://meet.google.com/..."
                            value={formData.meetLink}
                            onChange={(e) => setFormData({ ...formData, meetLink: e.target.value })}
                        />
                    </div>

                    <Button
                        type="submit"
                        className="w-full h-14 bg-white text-black hover:bg-gray-200 text-lg font-bold uppercase tracking-[0.2em]"
                        disabled={loading}
                    >
                        {loading ? <Loader2 className="animate-spin mr-2" /> : "Establish Community"}
                    </Button>
                </form>
            </motion.div>
        </div>
    );
}
