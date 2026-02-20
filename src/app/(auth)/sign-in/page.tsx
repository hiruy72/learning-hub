"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GraduationCap, ArrowRight, Loader2 } from "lucide-react";

export default function SignInPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Login failed");
            }

            router.push("/dashboard");
            router.refresh();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4 text-white relative overflow-hidden">
            {/* Masterpiece Background Accents */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/[0.02] blur-[120px] rounded-full pointer-events-none" />

            <div className="w-full max-w-[450px] space-y-12 bg-zinc-950/40 backdrop-blur-xl border border-white/5 p-12 rounded-[40px] relative z-10 shadow-[0_0_100px_rgba(0,0,0,1)]">
                <div className="text-center">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-white border border-white mb-8 shadow-[0_0_30px_rgba(255,255,255,0.1)]"
                    >
                        <GraduationCap className="h-10 w-10 text-black" />
                    </motion.div>
                    <h1 className="text-4xl font-black tracking-tighter uppercase mb-4 leading-none">Welcome</h1>
                    <div className="flex items-center justify-center gap-4">
                        <div className="h-px w-8 bg-white/10" />
                        <p className="text-gray-500 uppercase text-[9px] tracking-[0.4em] font-bold">
                            Elite Entry
                        </p>
                        <div className="h-px w-8 bg-white/10" />
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-red-500/5 border border-red-500/20 text-red-500 text-[10px] uppercase tracking-[0.2em] p-5 rounded-2xl text-center font-bold"
                        >
                            {error}
                        </motion.div>
                    )}

                    <div className="space-y-6">
                        <div className="space-y-3 group">
                            <label className="text-[9px] font-black text-gray-500 uppercase tracking-[0.3em] ml-1 transition-colors group-focus-within:text-white">
                                Identifier
                            </label>
                            <Input
                                type="email"
                                placeholder="EMAIL@UNIVERSITY.EDU"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="bg-white/5 border-white/5 h-16 rounded-2xl focus:border-white/20 transition-all text-xs text-white placeholder:text-gray-700 font-medium px-6"
                                required
                            />
                        </div>
                        <div className="space-y-3 group">
                            <label className="text-[9px] font-black text-gray-500 uppercase tracking-[0.3em] ml-1 transition-colors group-focus-within:text-white">
                                Secret
                            </label>
                            <Input
                                type="password"
                                placeholder="••••••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="bg-white/5 border-white/5 h-16 rounded-2xl focus:border-white/20 transition-all text-xs text-white placeholder:text-gray-700 font-medium px-6"
                                required
                            />
                        </div>
                    </div>

                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-white text-black hover:bg-gray-200 h-16 font-black uppercase tracking-[0.4em] text-[10px] transition-all rounded-none active:scale-[0.98]"
                    >
                        {loading ? (
                            <Loader2 className="h-4 w-4 animate-spin text-black" />
                        ) : (
                            <div className="flex items-center">
                                ACCESS HUB <ArrowRight className="ml-3 h-3 w-3" />
                            </div>
                        )}
                    </Button>
                </form>

                <div className="text-center pt-8 border-t border-white/5">
                    <p className="text-gray-600 text-[9px] uppercase tracking-[0.3em] font-medium">
                        New Entity?{" "}
                        <Link href="/sign-up" className="text-white hover:text-gray-300 transition-colors font-black ml-2 underline underline-offset-4">
                            Register
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
