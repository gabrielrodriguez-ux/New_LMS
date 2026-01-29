"use client";

import Link from "next/link";
import { Search, Bell, Menu, X, BookOpen, MessageSquare, GraduationCap, LogOut } from "lucide-react";
import { useState } from "react";
import { usePathname } from "next/navigation";

export default function TutorLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Simple state for notifications
    const [notifications, setNotifications] = useState(3);

    const isActive = (path: string) => pathname === path || pathname?.startsWith(path + "/");

    const navLinks = [
        { href: "/tutor/my-courses", label: "My Courses", icon: BookOpen },
        { href: "/tutor/community", label: "Community", icon: MessageSquare },
    ];

    return (
        <div className="min-h-screen bg-[#f8fafc]">
            {/* Tutor Navbar */}
            <nav className="bg-[#1e3740] text-white p-4 sticky top-0 z-50 shadow-md">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-8">
                        <Link href="/tutor/my-courses" className="text-2xl font-bold flex items-center gap-2">
                            <div className="w-8 h-8 bg-[#a1e6c5] rounded flex items-center justify-center text-[#1e3740]">T</div>
                            ThePower <span className="text-xs font-medium bg-[#2c4d59] px-2 py-0.5 rounded uppercase tracking-widest ml-1">Tutor</span>
                        </Link>

                        <div className="hidden md:flex gap-6 text-sm font-bold">
                            {navLinks.map((link) => {
                                const Icon = link.icon;
                                const active = isActive(link.href);
                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className={`flex items-center gap-2 hover:text-[#a1e6c5] transition-all group ${active ? 'text-[#a1e6c5]' : 'text-slate-300'}`}
                                    >
                                        <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${active ? 'text-[#a1e6c5]' : 'text-slate-400'}`} />
                                        {link.label}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    <div className="flex items-center gap-4 md:gap-6">
                        <div className="relative hidden md:block">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search students or questions..."
                                className="bg-[#2c4d59] pl-10 pr-4 py-2 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#a1e6c5] w-48 lg:w-64 transition-all"
                            />
                        </div>

                        <div className="relative group">
                            <button className="relative hover:bg-[#2c4d59] p-2.5 rounded-xl transition-colors">
                                <Bell className="w-5 h-5" />
                                {notifications > 0 && (
                                    <span className="absolute top-2 right-2 w-4 h-4 bg-red-500 rounded-full border-2 border-[#1e3740] text-[8px] flex items-center justify-center font-bold">
                                        {notifications}
                                    </span>
                                )}
                            </button>
                            {/* Simple notification dropdown preview */}
                            <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-100 hidden group-hover:block transition-all animate-in fade-in slide-in-from-top-2">
                                <div className="p-4 border-b border-slate-50">
                                    <p className="text-xs font-black text-slate-900 uppercase tracking-widest">Recent Student Messages</p>
                                </div>
                                <div className="p-2 space-y-1 max-h-80 overflow-y-auto">
                                    {[1, 2, 3].map(n => (
                                        <div key={n} className="p-3 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer group">
                                            <p className="text-sm font-bold text-slate-800">New message from Gabriel R.</p>
                                            <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">"Help with the Business Strategy module..."</p>
                                        </div>
                                    ))}
                                </div>
                                <Link href="/tutor/community" className="block p-3 text-center text-xs font-bold text-[#1e3740] bg-[#a1e6c5]/20 hover:bg-[#a1e6c5]/30 transition-colors rounded-b-2xl">
                                    View all notifications
                                </Link>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 pl-2 md:pl-6 md:border-l border-[#2c4d59]">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-bold">Gabriel Rodriguez</p>
                                <p className="text-[10px] text-[#a1e6c5] uppercase font-black tracking-widest">Senior Tutor</p>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#a1e6c5] to-[#76c7c0] flex items-center justify-center text-[#1e3740] font-black shadow-lg">
                                GR
                            </div>
                            <Link href="/tutor" className="p-2 hover:bg-[#2c4d59] rounded-xl text-slate-400 hover:text-white transition-colors">
                                <LogOut className="w-4 h-4" />
                            </Link>
                        </div>

                        <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                            {isMenuOpen ? <X /> : <Menu />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden absolute top-full left-0 w-full bg-[#1e3740] border-t border-[#2c4d59] p-4 space-y-4 shadow-lg animate-in slide-in-from-top-4 transition-all">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`block p-3 rounded-xl font-bold ${isActive(link.href) ? 'bg-[#2c4d59] text-[#a1e6c5]' : 'text-slate-300'}`}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>
                )}
            </nav>

            {/* Content Area */}
            <main className="max-w-7xl mx-auto p-8 lg:p-12">
                {children}
            </main>
        </div>
    );
}
