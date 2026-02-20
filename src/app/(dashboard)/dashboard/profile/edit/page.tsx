"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { updateUserProfile, syncUser } from "@/actions/user";
import { Loader2, ArrowLeft, Camera, User, Mail, Shield, BookOpen, GraduationCap } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function ProfileEditPage() {
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [formData, setFormData] = useState({
        name: "",
        bio: "",
        department: "",
        year: "",
        imageUrl: "",
    });
    const router = useRouter();

    useEffect(() => {
        async function loadUser() {
            try {
                const user = await syncUser();
                if (user) {
                    setFormData({
                        name: user.name || "",
                        bio: user.bio || "",
                        department: user.department || "",
                        year: user.year || "",
                        imageUrl: user.imageUrl || "",
                    });
                }
            } catch (error) {
                console.error(error);
            } finally {
                setFetching(false);
            }
        }
        loadUser();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await updateUserProfile(formData);
            router.push("/dashboard/profile");
        } catch (error: any) {
            console.error(error);
            alert(error.message || "Failed to update profile.");
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div className="flex h-[70vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-white" />
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto px-4 py-12">
            <Link
                href="/dashboard/profile"
                className="flex items-center gap-2 text-gray-400 hover:text-white mb-12 uppercase text-[10px] font-bold tracking-[0.3em] transition-colors"
            >
                <ArrowLeft className="h-3 w-3" /> Back to Profile
            </Link>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h1 className="text-4xl font-bold tracking-tight uppercase mb-2">Edit Profile</h1>
                <p className="text-gray-400 mb-12 uppercase text-xs tracking-widest">
                    Update your personal information and profile photo.
                </p>

                <form onSubmit={handleSubmit} className="space-y-12">
                    {/* Photo Upload Section */}
                    <div className="flex flex-col items-center gap-6 p-8 bg-black border border-white/10 rounded-none">
                        <div className="relative group">
                            {formData.imageUrl ? (
                                <Image
                                    src={formData.imageUrl}
                                    alt="Profile"
                                    width={120}
                                    height={120}
                                    className="rounded-none grayscale border-2 border-white/20"
                                />
                            ) : (
                                <div className="h-[120px] w-[120px] rounded-none bg-zinc-950 border-2 border-dashed border-white/10 flex items-center justify-center text-gray-500">
                                    <User className="h-12 w-12" />
                                </div>
                            )}
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                <Camera className="h-6 w-6 text-white" />
                            </div>
                        </div>
                        <div className="w-full space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                                Profile Photo URL
                            </label>
                            <input
                                type="url"
                                className="w-full bg-black border border-white/10 rounded-none p-4 text-white focus:outline-none focus:ring-1 focus:ring-white text-xs"
                                placeholder="https://example.com/photo.jpg"
                                value={formData.imageUrl}
                                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                            />
                            <p className="text-[9px] text-gray-500 uppercase tracking-tighter">
                                For now, please provide a direct link to an image.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="text-sm font-medium uppercase tracking-widest text-gray-400">
                                Full Name
                            </label>
                            <input
                                required
                                className="w-full bg-black border border-white/10 rounded-none p-4 text-white focus:outline-none focus:ring-1 focus:ring-white"
                                placeholder="Your Name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium uppercase tracking-widest text-gray-400">
                                Department
                            </label>
                            <input
                                className="w-full bg-black border border-white/10 rounded-none p-4 text-white focus:outline-none focus:ring-1 focus:ring-white"
                                placeholder="e.g. Mechanical Engineering"
                                value={formData.department}
                                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium uppercase tracking-widest text-gray-400">
                                Year / Semester
                            </label>
                            <input
                                className="w-full bg-black border border-white/10 rounded-none p-4 text-white focus:outline-none focus:ring-1 focus:ring-white"
                                placeholder="e.g. Year 2, Sem 1"
                                value={formData.year}
                                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium uppercase tracking-widest text-gray-400">
                            Bio
                        </label>
                        <textarea
                            className="w-full bg-black border border-white/10 rounded-none p-4 text-white focus:outline-none focus:ring-1 focus:ring-white min-h-[120px]"
                            placeholder="Tell others about yourself..."
                            value={formData.bio}
                            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        />
                    </div>

                    <Button
                        type="submit"
                        className="w-full h-16 bg-white text-black hover:bg-gray-200 text-lg font-bold uppercase tracking-[0.3em] rounded-none"
                        disabled={loading}
                    >
                        {loading ? <Loader2 className="animate-spin mr-2" /> : "Save Changes"}
                    </Button>
                </form>
            </motion.div>
        </div>
    );
}
