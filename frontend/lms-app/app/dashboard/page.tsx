"use client";

import Navbar from "@/components/Navbar";
import { Trophy, PlayCircle, BookOpen, Clock, Star, Users } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
    return (
        <div className="min-h-screen bg-surface-muted">

            <Navbar />

            {/* Main Content */}
            <main className="max-w-7xl mx-auto p-6 md:p-8 space-y-10">

                {/* Welcome Section */}
                <section className="space-y-4">
                    <h1 className="text-3xl font-bold">Welcome back, Gabriel!</h1>
                    <p className="text-gray-600">You're on a 5-day streak. Keep it up!</p>
                </section>

                {/* Continue Learning + Stats Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Active Course Card (Large) */}
                    <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-6">
                            <div>
                                <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full uppercase tracking-wide">In Progress</span>
                                <h2 className="text-2xl font-bold mt-3">ThePowerMBA - Business Strategy</h2>
                                <p className="text-gray-500 mt-1">Module 4: Market Analysis</p>
                            </div>
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                                <PlayCircle className="w-8 h-8" />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between text-sm font-medium">
                                <span className="text-gray-600">Course Progress</span>
                                <span className="text-primary">65%</span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-3">
                                <div className="bg-gradient-to-r from-primary to-primary-light h-3 rounded-full" style={{ width: '65%' }}></div>
                            </div>
                            <div className="pt-4 flex gap-4">
                                <Link
                                    href="/dashboard/courses/eb15e6a0-3214-4ab4-95b4-2c832dec2639"
                                    aria-label="Continue learning Business Strategy course"
                                    className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-light transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                                >
                                    Continue Learning
                                </Link>
                                <button
                                    aria-label="View course syllabus"
                                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300"
                                >
                                    View Syllabus
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Gamification Stats */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <h3 className="font-bold flex items-center gap-2 mb-4">
                                <Trophy className="w-5 h-5 text-yellow-500" />
                                Ranking Semanal
                            </h3>
                            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-100 mb-2">
                                <div className="flex items-center gap-3">
                                    <span className="font-bold text-yellow-700 text-lg">#3</span>
                                    <div className="w-8 h-8 bg-yellow-200 rounded-full flex items-center justify-center text-yellow-700 text-xs font-bold">GR</div>
                                    <span className="font-medium text-sm">Gabriel R.</span>
                                </div>
                                <span className="font-bold text-sm">450 XP</span>
                            </div>
                            <div className="space-y-2 mt-4 text-sm">
                                <div className="flex justify-between items-center text-gray-500">
                                    <span>1. Sarah J.</span>
                                    <span>520 XP</span>
                                </div>
                                <div className="flex justify-between items-center text-gray-500">
                                    <span>2. Mike T.</span>
                                    <span>480 XP</span>
                                </div>
                                <div className="border-t pt-2 mt-2 text-center">
                                    <Link
                                        href="/leaderboard"
                                        className="text-primary font-medium hover:underline text-xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary rounded"
                                        aria-label="View full leaderboard rankings"
                                    >
                                        View Full Leaderboard
                                    </Link>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-secondary to-accent p-6 rounded-2xl text-primary relative overflow-hidden">
                            <div className="relative z-10">
                                <h3 className="font-bold mb-1">Daily Challenge</h3>
                                <p className="text-sm opacity-90 mb-4">Complete 1 Quiz today</p>
                                <div className="flex items-center gap-2 text-2xl font-bold">
                                    0 / 1 <span className="text-sm font-normal opacity-75 self-end mb-1">completed</span>
                                </div>
                                <div className="w-full bg-white/30 h-1.5 rounded-full mt-2">
                                    <div className="bg-primary w-0 h-1.5 rounded-full"></div>
                                </div>
                            </div>
                            <Star className="absolute -bottom-4 -right-4 w-24 h-24 text-white opacity-20 rotate-12" />
                        </div>
                    </div>
                </div>

                {/* Recommended Courses */}
                <section>
                    <h2 className="text-xl font-bold mb-6">Recommended for you</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group border border-gray-100">
                                <div className="h-40 bg-gray-200 relative">
                                    <div className="absolute inset-0 bg-gray-800/10 group-hover:bg-gray-800/0 transition-colors" />
                                    {/* Placeholder for course image */}
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        <BookOpen className="w-8 h-8" />
                                    </div>
                                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-bold shadow-sm">
                                        4.8 ★
                                    </div>
                                </div>
                                <div className="p-4">
                                    <div className="text-xs text-secondary-dark font-semibold uppercase tracking-wider mb-2">Marketing</div>
                                    <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">Digital Marketing Mastery 2026</h3>
                                    <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> 12h</span>
                                        <span className="flex items-center gap-1"><Users className="w-3 h-3" /> 1.2k</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-medium bg-gray-100 px-2 py-1 rounded">Intermediate</span>
                                        <button
                                            aria-label="Preview course"
                                            className="text-primary hover:text-secondary-dark transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary rounded"
                                        >
                                            <PlayCircle className="w-6 h-6" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </main>
        </div>
    );
}
