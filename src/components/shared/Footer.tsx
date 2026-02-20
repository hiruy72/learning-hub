"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { GraduationCap, Github, Twitter, Linkedin, Mail } from "lucide-react";

export const Footer = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const pathname = usePathname();

    useEffect(() => {
        const checkUser = async () => {
            try {
                const res = await fetch("/api/auth/me");
                const data = await res.json();
                setUser(data.user);
            } catch (error) {
                console.error("Failed to fetch user", error);
            } finally {
                setLoading(false);
            }
        };
        checkUser();
    }, [pathname]);

    if (loading || user) return null;

    return (
        <footer className="bg-black border-t border-white/5 pt-24 pb-12">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
                    <div className="col-span-1 md:col-span-2">
                        <Link href="/" className="text-2xl font-black tracking-tighter text-white mb-6 block">
                            LETS<span className="text-gray-400">LERN</span>
                        </Link>
                        <p className="text-gray-400 text-sm max-w-sm leading-relaxed mb-8">
                            The official mentorship ecosystem for Addis Ababa University students.
                            Bridging the gap between freshman curiosity and senior expertise across all campuses.
                        </p>
                        <div className="flex gap-4">
                            {[
                                { icon: Github, href: "#" },
                                { icon: Twitter, href: "#" },
                                { icon: Linkedin, href: "#" },
                                { icon: Mail, href: "#" }
                            ].map((social, i) => (
                                <Link
                                    key={i}
                                    href={social.href}
                                    className="h-10 w-10 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-white transition-all"
                                >
                                    <social.icon size={18} />
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-white mb-8">Platform</h4>
                        <ul className="space-y-4">
                            {["Home", "Blogs", "Communities", "Chat", "Resources"].map((item) => (
                                <li key={item}>
                                    <Link href="#" className="text-gray-400 text-sm hover:text-white transition-colors">
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-white mb-8">AAU Ecosystem</h4>
                        <ul className="space-y-4">
                            {["5-Kilo (AAiT)", "6-Kilo (Main)", "4-Kilo (CNCS)", "Black Lion", "Digital Library"].map((item) => (
                                <li key={item}>
                                    <Link href="#" className="text-gray-400 text-sm hover:text-white transition-colors">
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/5 pt-12 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        <p className="text-[10px] font-mono tracking-widest text-gray-500 uppercase">
                            © 2026 AAU MENTORSHIP ECOSYSTEM. HARMONY IN EXCELLENCE.
                        </p>
                    </div>
                    <div className="flex gap-12 text-[10px] font-mono tracking-widest text-gray-500 uppercase">
                        <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
                        <Link href="#" className="hover:text-white transition-colors">Status: Operational</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};
