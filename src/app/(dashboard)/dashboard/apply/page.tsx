"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { submitMentorApplication } from "@/actions/mentor";
import { Loader2, CheckCircle2 } from "lucide-react";

export default function MentorApplyPage() {
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        bio: "",
        department: "",
        year: "",
        motivation: "",
        gradeReportLink: "",
        nationalIdLink: "",
    });
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await submitMentorApplication(formData);
            setSubmitted(true);
        } catch (error) {
            console.error(error);
            alert("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <div className="flex min-h-[70vh] flex-col items-center justify-center text-center px-4">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="bg-white p-4 rounded-full mb-6"
                >
                    <CheckCircle2 className="h-12 w-12 text-black" />
                </motion.div>
                <h1 className="text-3xl font-bold tracking-tight mb-2">APPLICATION SUBMITTED</h1>
                <p className="text-gray-400 max-w-md mx-auto mb-8">
                    Thank you for applying. Our administrators will review your application
                    and notify you once a decision is made.
                </p>
                <Button onClick={() => router.push("/dashboard")} variant="outline">
                    Return to Dashboard
                </Button>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto px-4 py-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="text-4xl font-bold tracking-tight mb-2 underline decoration-gray-400 underline-offset-8">
                    BECOME A MENTOR
                </h1>
                <p className="text-gray-400 mb-12">
                    Share your experience and guide the next generation of students.
                </p>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="space-y-2">
                        <label className="text-sm font-medium uppercase tracking-widest text-gray-400">
                            Short Bio
                        </label>
                        <textarea
                            required
                            className="w-full bg-black border border-white/10 rounded-lg p-4 text-white focus:outline-none focus:ring-1 focus:ring-white min-h-[100px]"
                            placeholder="Tell us about yourself..."
                            value={formData.bio}
                            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium uppercase tracking-widest text-gray-400">
                                Department
                            </label>
                            <input
                                required
                                type="text"
                                className="w-full bg-black border border-white/10 rounded-lg p-4 text-white focus:outline-none focus:ring-1 focus:ring-white"
                                placeholder="e.g. Computer Science"
                                value={formData.department}
                                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium uppercase tracking-widest text-gray-400">
                                Year of Study
                            </label>
                            <input
                                required
                                type="text"
                                className="w-full bg-black border border-white/10 rounded-lg p-4 text-white focus:outline-none focus:ring-1 focus:ring-white"
                                placeholder="e.g. 3rd Year"
                                value={formData.year}
                                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium uppercase tracking-widest text-gray-400">
                            Why do you want to be a mentor?
                        </label>
                        <textarea
                            required
                            className="w-full bg-black border border-white/10 rounded-lg p-4 text-white focus:outline-none focus:ring-1 focus:ring-white min-h-[150px]"
                            placeholder="Your motivation..."
                            value={formData.motivation}
                            onChange={(e) => setFormData({ ...formData, motivation: e.target.value })}
                        />
                    </div>

                    <div className="space-y-6 pt-4 border-t border-white/10">
                        <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-white">Verification Documents</h3>

                        <div className="space-y-2">
                            <label className="text-[10px] font-medium uppercase tracking-widest text-gray-400">
                                Grade Report PDF (Google Drive Link)
                            </label>
                            <input
                                required
                                type="url"
                                className="w-full bg-black border border-white/10 rounded-lg p-4 text-white focus:outline-none focus:ring-1 focus:ring-white"
                                placeholder="https://drive.google.com/..."
                                value={formData.gradeReportLink}
                                onChange={(e) => setFormData({ ...formData, gradeReportLink: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-medium uppercase tracking-widest text-gray-400">
                                National ID (Google Drive Link)
                            </label>
                            <input
                                required
                                type="url"
                                className="w-full bg-black border border-white/10 rounded-lg p-4 text-white focus:outline-none focus:ring-1 focus:ring-white"
                                placeholder="https://drive.google.com/..."
                                value={formData.nationalIdLink}
                                onChange={(e) => setFormData({ ...formData, nationalIdLink: e.target.value })}
                            />
                        </div>
                    </div>

                    <Button
                        type="submit"
                        className="w-full h-14 bg-white text-black hover:bg-gray-200 text-lg font-bold"
                        disabled={loading}
                    >
                        {loading ? <Loader2 className="animate-spin mr-2" /> : "Submit Application"}
                    </Button>
                </form>
            </motion.div>
        </div>
    );
}
