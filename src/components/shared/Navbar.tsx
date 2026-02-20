"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Bell, User, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { NotificationPanel } from "@/components/dashboard/Notifications";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Navbar = () => {
    const pathname = usePathname();
    const router = useRouter();
    const [isNotifOpen, setIsNotifOpen] = useState(false);
    const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null);
    const [loading, setLoading] = useState(true);

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

    const handleLogout = async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        setUser(null);
        router.push("/sign-in");
        router.refresh();
    };

    const navLinks = [
        { name: "Home", href: "/" },
        { name: "Blogs", href: "/blogs" },
    ];

    const dashboardLinks = [
        { name: "Dashboard", href: "/dashboard" },
        { name: "Communities", href: "/dashboard/communities" },
        { name: "Chat", href: "/dashboard/chat" },
    ];

    return (
        <>
            <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-black">
                <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-8">
                        <Link href="/" className="text-xl font-black tracking-tighter text-white">
                            LETS<span className="text-gray-400">LERN</span>
                        </Link>

                        <div className="hidden items-center gap-6 md:flex">
                            {navLinks.map((link) => {
                                if (user && link.name === "Home") return null;
                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className={cn(
                                            "text-[10px] font-bold uppercase tracking-[0.2em] transition-all hover:text-white",
                                            pathname === link.href ? "text-white" : "text-gray-400"
                                        )}
                                    >
                                        {link.name}
                                    </Link>
                                );
                            })}
                            {user && dashboardLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={cn(
                                        "text-[10px] font-bold uppercase tracking-[0.2em] transition-all hover:text-white",
                                        pathname.startsWith(link.href) ? "text-white" : "text-gray-400"
                                    )}
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {!loading && (
                            <>
                                {!user ? (
                                    <>
                                        <Link href="/sign-in">
                                            <Button variant="ghost" className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-white hover:bg-white/5">
                                                Signin
                                            </Button>
                                        </Link>
                                        <Link href="/sign-up">
                                            <Button className="h-10 bg-white text-black text-[10px] font-bold uppercase tracking-widest hover:bg-gray-200">
                                                Register
                                            </Button>
                                        </Link>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            onClick={() => setIsNotifOpen(true)}
                                            className="relative h-10 w-10 flex items-center justify-center rounded-full hover:bg-white/5 transition-colors border border-white/10"
                                        >
                                            <Bell className="h-5 w-5 text-gray-300" />
                                            <span className="absolute top-2 right-2 h-2 w-2 bg-white rounded-full border-2 border-black" />
                                        </button>

                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <button className="h-10 w-10 rounded-full border border-white/10 flex items-center justify-center bg-white/5 hover:bg-white/10 transition-colors">
                                                    <User className="h-5 w-5 text-gray-300" />
                                                </button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-56 bg-zinc-950 border-white/10 text-white">
                                                <DropdownMenuLabel className="uppercase text-[10px] tracking-widest text-gray-400">
                                                    My Account
                                                </DropdownMenuLabel>
                                                <DropdownMenuSeparator className="bg-white/5" />
                                                <div className="p-2">
                                                    <p className="text-sm font-bold truncate">{user.name}</p>
                                                    <p className="text-[10px] text-gray-400 truncate uppercase mt-0.5">{user.email}</p>
                                                </div>
                                                <DropdownMenuSeparator className="bg-white/5" />
                                                <DropdownMenuItem className="focus:bg-white/5 focus:text-white cursor-pointer" asChild>
                                                    <Link href="/dashboard/profile" className="w-full flex items-center uppercase text-[10px] font-bold tracking-widest">
                                                        <User className="mr-2 h-4 w-4" /> Profile
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={handleLogout}
                                                    className="focus:bg-red-500/10 focus:text-red-500 cursor-pointer text-red-500"
                                                >
                                                    <LogOut className="mr-2 h-4 w-4" />
                                                    <span className="uppercase text-[10px] font-bold tracking-widest">Logout</span>
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </nav>

            <NotificationPanel
                isOpen={isNotifOpen}
                onCloseAction={() => setIsNotifOpen(false)}
            />
        </>
    );
};
