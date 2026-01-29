"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, BookOpen, FileText, Settings, LogOut, Briefcase, Calendar, Trophy, Shield } from "lucide-react";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    const menuItems = [
        { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
        { icon: Users, label: "Users & Groups", href: "/admin/users" },
        { icon: Shield, label: "Staff", href: "/admin/staff" },
        { icon: Briefcase, label: "Clients & Subs", href: "/admin/clients" }, // New Item
        { icon: BookOpen, label: "Classrooms & Content", href: "/admin/classrooms" },
        { icon: Calendar, label: "Tutoring Sessions", href: "/admin/sessions" },
        { icon: Trophy, label: "Gamification", href: "/admin/gamification" },
        { icon: FileText, label: "FUNDAE Management", href: "/admin/fundae" },
        { icon: Settings, label: "Settings", href: "/admin/settings" },
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-[#1e3740] text-white flex flex-col shrink-0">
                <div className="p-6">
                    <div className="flex items-center gap-2 text-xl font-bold">
                        <div className="w-8 h-8 bg-[#a1e6c5] rounded flex items-center justify-center text-[#1e3740]">P</div>
                        ThePower <span className="text-xs opacity-70 mt-1 uppercase">Admin</span>
                    </div>
                </div>

                <nav className="flex-1 px-4 space-y-2">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive
                                    ? "bg-[#2c4d59] text-[#a1e6c5]"
                                    : "text-gray-300 hover:bg-[#2c4d59]/50 hover:text-white"
                                    }`}
                            >
                                <Icon className="w-5 h-5" />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-[#2c4d59]">
                    <div className="flex items-center gap-3 px-4 py-2">
                        <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-xs font-bold">AD</div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">Admin User</p>
                            <p className="text-xs text-gray-400 truncate">admin@thepower.edu</p>
                        </div>
                        <LogOut className="w-4 h-4 text-gray-400 cursor-pointer hover:text-white" />
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-8 sticky top-0 z-10">
                    <h2 className="font-bold text-gray-800">
                        {menuItems.find(i => i.href === pathname)?.label || "Backoffice"}
                    </h2>
                    <div className="flex gap-4">
                        <button className="text-sm text-gray-600 hover:text-gray-900 font-medium">Help Center</button>
                        <Link href="/dashboard" className="text-sm text-[#1e3740] font-medium hover:underline">Switch to Student View</Link>
                    </div>
                </header>
                <main className="p-8 flex-1 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
