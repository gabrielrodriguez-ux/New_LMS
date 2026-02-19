"use client";

import { useState } from "react";
import {
    LayoutDashboard,
    Users,
    BookOpen,
    BarChart3,
    Settings,
    LogOut,
    MessageSquare,
    Bell,
    ExternalLink
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function PortalClienteLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    // Simulating the tenant branding
    const tenantBranding = {
        name: "Acme Corp",
        logo: "A",
        primaryColor: "#1e3740",
        secondaryColor: "#a1e6c5"
    };

    const menuItems = [
        { icon: LayoutDashboard, label: "Overview", href: "/portal-cliente" },
        { icon: Users, label: "My Students", href: "/portal-cliente/students" },
        { icon: BookOpen, label: "Course Catalog", href: "/portal-cliente/catalog" },
        { icon: BarChart3, label: "Reports & FUNDAE", href: "/portal-cliente/reports" },
        { icon: MessageSquare, label: "Communications", href: "/portal-cliente/comm" },
        { icon: Settings, label: "Account Settings", href: "/portal-cliente/settings" },
    ];

    return (
        <div className="min-h-screen bg-[#f8fafc] flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0">
                <div className="p-8">
                    <div className="flex items-center gap-3">
                        <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg"
                            style={{ backgroundColor: tenantBranding.primaryColor }}
                        >
                            {tenantBranding.logo}
                        </div>
                        <div>
                            <h1 className="font-bold text-slate-800 tracking-tight">{tenantBranding.name}</h1>
                            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Portal Cliente</p>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 px-4 space-y-1">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all group ${isActive
                                        ? "bg-slate-100 text-[#1e3740]"
                                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                                    }`}
                            >
                                <Icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${isActive ? "text-[#a1e6c5]" : "text-slate-400"}`} />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-6">
                    <div className="bg-slate-900 rounded-2xl p-4 text-white relative overflow-hidden group">
                        <div className="relative z-10">
                            <p className="text-xs text-slate-400 font-medium">Need help?</p>
                            <p className="text-sm font-bold mt-1">Contact your Manager</p>
                            <button className="mt-3 text-[10px] font-bold bg-[#a1e6c5] text-[#1e3740] px-3 py-1.5 rounded-lg hover:brightness-110 transition-all flex items-center gap-1">
                                Go to Support <ExternalLink className="w-3 h-3" />
                            </button>
                        </div>
                        <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-colors"></div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-slate-100 flex items-center gap-3 px-2">
                        <div className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white shadow-sm flex items-center justify-center font-bold text-xs text-slate-600">
                            JD
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-slate-800 truncate">Jane Doe</p>
                            <p className="text-[10px] text-slate-400 truncate">HR Manager</p>
                        </div>
                        <LogOut className="w-4 h-4 text-slate-300 cursor-pointer hover:text-red-500 transition-colors" />
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
                <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-10 sticky top-0 z-10 shrink-0">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                            {menuItems.find(i => i.href === pathname)?.label || "Welcome back"}
                        </h2>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="relative p-2 text-slate-400 hover:text-slate-600 cursor-pointer group transition-colors">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                        </div>
                        <div className="h-8 w-px bg-slate-200"></div>
                        <Link
                            href="/dashboard"
                            className="bg-slate-900 text-white text-xs font-bold px-4 py-2 rounded-full hover:bg-slate-800 transition-all shadow-md active:scale-95"
                        >
                            Student View
                        </Link>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-10 custom-scrollbar">
                    {children}
                </main>
            </div>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #e2e8f0;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #cbd5e1;
                }
            `}</style>
        </div>
    );
}
