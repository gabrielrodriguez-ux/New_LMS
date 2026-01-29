"use client";

import Navbar from "@/components/Navbar";
import { Trophy, PlayCircle, BookOpen, Clock, Star, Users } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
    return (
        <div className="min-h-screen bg-surface-muted">

            <Navbar />

            {/* Main Content */}
            <main className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8 md:space-y-10">

                {/* Welcome Section */}
                <section className="space-y-2 sm:space-y-4">
                    <h1 className="text-2xl sm:text-3xl font-bold">Welcome back, Gabriel!</h1>
                    <p className="text-sm sm:text-base text-gray-600">You're on a 5-day streak. Keep it up! 🔥</p>
                </section>

                {/* Continue Learning + Stats Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">

                    {/* Active Course Card (Large) */}
                    <div className="lg:col-span-2 bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-4 sm:mb-6 gap-3">
                            <div>
                                <span className="px-2 sm:px-3 py-1 bg-blue-50 text-blue-700 text-[10px] sm:text-xs font-semibold rounded-full uppercase tracking-wide">In Progress</span>
                                <h2 className="text-xl sm:text-2xl font-bold mt-2 sm:mt-3">ThePowerMBA - Business Strategy</h2>
                                <p className="text-sm sm:text-base text-gray-500 mt-1">Module 4: Market Analysis</p>
                            </div>
                            <div className="hidden sm:flex w-14 h-14 sm:w-16 sm:h-16 bg-blue-100 rounded-full items-center justify-center text-blue-600 shrink-0">
                                <PlayCircle className="w-6 h-6 sm:w-8 sm:h-8" />
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
                            <div className="pt-3 sm:pt-4 flex flex-col sm:flex-row gap-3 sm:gap-4">
                                <Link
                                    href="/dashboard/courses/eb15e6a0-3214-4ab4-95b4-2c832dec2639"
                                    aria-label="Continue learning Business Strategy course"
                                    className="w-full sm:w-auto px-5 sm:px-6 py-2.5 sm:py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-light transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary text-center text-sm sm:text-base"
                                >
                                    Continue Learning
                                </Link>
                                <button
                                    aria-label="View course syllabus"
                                    className="w-full sm:w-auto px-5 sm:px-6 py-2.5 sm:py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 text-sm sm:text-base"
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
                    <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6">Recommended for you</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                        {[
                            { id: 1, title: 'Digital Marketing Mastery 2026', category: 'Marketing', gradient: 'from-purple-500 to-pink-500' },
                            { id: 2, title: 'Data Science Fundamentals', category: 'Technology', gradient: 'from-blue-500 to-cyan-500' },
                            { id: 3, title: 'Leadership Excellence', category: 'Management', gradient: 'from-emerald-500 to-teal-500' },
                            { id: 4, title: 'Financial Analysis Pro', category: 'Finance', gradient: 'from-orange-500 to-red-500' }
                        ].map((course) => (
                            <div key={course.id} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group border border-gray-100">
                                <div className={`h-32 sm:h-40 bg-gradient-to-br ${course.gradient} relative flex items-center justify-center p-8`}>
                                    <BookOpen className="w-10 h-10 sm:w-12 sm:h-12 text-white/80 group-hover:scale-110 transition-transform" />
                                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-bold shadow-sm">
                                        4.8 ★
                                    </div>
                                </div>
                                <div className="p-3 sm:p-4">
                                    <div className="text-[10px] sm:text-xs text-secondary-dark font-semibold uppercase tracking-wider mb-1 sm:mb-2">{course.category}</div>
                                    <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 text-sm sm:text-base leading-tight">{course.title}</h3>
                                    <div className="flex items-center gap-3 sm:gap-4 text-[10px] sm:text-xs text-gray-500 mb-3 sm:mb-4">
                                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> 12h</span>
                                        <span className="flex items-center gap-1"><Users className="w-3 h-3" /> 1.2k</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] sm:text-xs font-medium bg-gray-100 px-2 py-1 rounded">Intermediate</span>
                                        <button
                                            aria-label="Preview course"
                                            className="text-primary hover:text-secondary-dark transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary rounded p-1"
                                        >
                                            <PlayCircle className="w-5 h-5 sm:w-6 sm:h-6" />
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
