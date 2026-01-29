"use client";

import Link from "next/link";
import { Search, Bell, Menu, X } from "lucide-react";
import { useState } from "react";
import { usePathname } from "next/navigation";

export default function Navbar() {
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const isActive = (path: string) => pathname === path || pathname?.startsWith(path + "/");

    return (
        <nav className="bg-primary text-white p-4 sticky top-0 z-50 shadow-md">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                {/* Logo & Desktop Nav */}
                <div className="flex items-center gap-8">
                    <Link href="/dashboard" className="text-2xl font-bold flex items-center gap-2">
                        <div className="w-8 h-8 bg-secondary rounded flex items-center justify-center text-primary">P</div>
                        ThePower
                    </Link>
                    <div className="hidden md:flex gap-6 text-sm font-medium">
                        <Link
                            href="/dashboard"
                            className={`hover:text-secondary transition-colors ${isActive('/dashboard') && !isActive('/dashboard/courses') ? 'text-secondary' : 'text-gray-300'}`}
                        >
                            Dashboard
                        </Link>
                        <Link
                            href="/my-courses"
                            className={`hover:text-secondary transition-colors ${isActive('/my-courses') || isActive('/dashboard/courses') ? 'text-secondary' : 'text-gray-300'}`}
                        >
                            My Courses
                        </Link>
                        <Link
                            href="/community"
                            className={`hover:text-secondary transition-colors ${isActive('/community') ? 'text-secondary' : 'text-gray-300'}`}
                        >
                            Community
                        </Link>
                        <Link
                            href="/leaderboard"
                            className={`hover:text-secondary transition-colors ${isActive('/leaderboard') ? 'text-secondary' : 'text-gray-300'}`}
                        >
                            Leaderboard
                        </Link>
                    </div>
                </div>

                {/* Right Side Icons */}
                <div className="flex items-center gap-4 md:gap-6">
                    <div className="relative hidden md:block">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search..."
                            className="bg-primary-light pl-10 pr-4 py-2 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-secondary w-48 lg:w-64 transition-all"
                        />
                    </div>
                    <button className="relative hover:bg-primary-light p-2 rounded-full transition-colors">
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-primary"></span>
                    </button>

                    <Link href="/profile" className="flex items-center gap-3 pl-2 md:pl-6 md:border-l border-primary-light group">
                        <div className="text-right hidden sm:block group-hover:opacity-80 transition-opacity">
                            <p className="text-sm font-semibold">Gabriel R.</p>
                            <p className="text-xs text-secondary">Lvl 12 • 4,250 XP</p>
                        </div>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-primary font-bold transition-all ${isActive('/profile') ? 'bg-secondary ring-2 ring-white' : 'bg-gradient-to-br from-secondary to-accent'}`}>
                            GR
                        </div>
                    </Link>

                    {/* Mobile Menu Button */}
                    <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        {isMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-primary border-t border-primary-light p-4 space-y-4 shadow-lg">
                    <Link href="/dashboard" className="block text-gray-300 hover:text-white" onClick={() => setIsMenuOpen(false)}>Dashboard</Link>
                    <Link href="/my-courses" className="block text-gray-300 hover:text-white" onClick={() => setIsMenuOpen(false)}>My Courses</Link>
                    <Link href="/community" className="block text-gray-300 hover:text-white" onClick={() => setIsMenuOpen(false)}>Community</Link>
                    <Link href="/leaderboard" className="block text-gray-300 hover:text-white" onClick={() => setIsMenuOpen(false)}>Leaderboard</Link>
                    <div className="pt-4 border-t border-primary-light">
                        <input
                            type="text"
                            placeholder="Search..."
                            className="bg-primary-light w-full px-4 py-2 rounded-full text-sm"
                        />
                    </div>
                </div>
            )}
        </nav>
    );
}
