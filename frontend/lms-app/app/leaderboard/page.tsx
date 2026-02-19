"use client";

import Navbar from "@/components/Navbar";
import Link from "next/link";
import { Trophy, Medal, Star, Shield, TrendingUp, Zap, Target, Award, Flame, Crown, Rocket, Heart, BookOpen } from "lucide-react";

export default function LeaderboardPage() {
    const leaderboard = [
        { rank: 1, name: "Sarah Jenkins", xp: 5200, level: 14, avatar: "SJ" },
        { rank: 2, name: "Mike Thompson", xp: 4950, level: 13, avatar: "MT" },
        { rank: 3, name: "Gabriel Rodriguez", xp: 4250, level: 12, avatar: "GR", isUser: true },
        { rank: 4, name: "Elena Gomez", xp: 4100, level: 12, avatar: "EG" },
        { rank: 5, name: "David Chen", xp: 3800, level: 11, avatar: "DC" },
        { rank: 6, name: "Anna Smith", xp: 3500, level: 10, avatar: "AS" },
        { rank: 7, name: "James Wilson", xp: 3200, level: 10, avatar: "JW" },
    ];

    return (
        <div className="min-h-screen bg-surface-muted">
            <Navbar />

            <main className="max-w-6xl mx-auto p-4 sm:p-6 md:p-8">
                <div className="text-center mb-6 sm:mb-10">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-4 flex items-center justify-center gap-2 sm:gap-3">
                        <Trophy className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 text-yellow-500" />
                        Global Leaderboard
                    </h1>
                    <p className="text-sm sm:text-base text-gray-600">Compete with your peers and earn XP to climb the ranks!</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">

                    {/* Main Leaderboard Table */}
                    <div className="lg:col-span-2 bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 overflow-hidden order-2 lg:order-1">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h2 className="font-bold text-lg">Weekly Ranking</h2>
                            <div className="flex gap-2 text-sm">
                                <button
                                    aria-label="Filter: Global leaderboard"
                                    className="px-3 py-1 bg-white border rounded shadow-sm font-medium text-primary cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary"
                                >
                                    Global
                                </button>
                                <button
                                    aria-label="Filter: Department leaderboard"
                                    className="px-3 py-1 text-gray-500 hover:text-primary cursor-pointer focus:outline-none focus:ring-2 focus:ring-gray-300 rounded"
                                >
                                    Department
                                </button>
                                <button
                                    aria-label="Filter: Team leaderboard"
                                    className="px-3 py-1 text-gray-500 hover:text-primary cursor-pointer focus:outline-none focus:ring-2 focus:ring-gray-300 rounded"
                                >
                                    Team
                                </button>
                            </div>
                        </div>

                        <div className="divide-y divide-gray-100">
                            {leaderboard.map((user) => (
                                <div key={user.rank} className={`flex items-center p-4 hover:bg-gray-50 transition-colors ${user.isUser ? 'bg-blue-50/50' : ''}`}>
                                    <div className="w-12 text-center font-bold text-gray-500 text-lg flex justify-center">
                                        {user.rank === 1 && <Trophy className="w-5 h-5 text-yellow-500" />}
                                        {user.rank === 2 && <Medal className="w-5 h-5 text-gray-400" />}
                                        {user.rank === 3 && <Medal className="w-5 h-5 text-amber-600" />}
                                        {user.rank > 3 && user.rank}
                                    </div>
                                    <div className="flex items-center flex-1 gap-4 ml-2">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${user.isUser ? 'bg-secondary text-primary' : 'bg-gray-200 text-gray-600'}`}>
                                            {user.avatar}
                                        </div>
                                        <div>
                                            <p className={`font-bold ${user.isUser ? 'text-primary' : 'text-gray-800'}`}>
                                                {user.name} {user.isUser && '(You)'}
                                            </p>
                                            <p className="text-xs text-gray-500">Level {user.level}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-primary">{user.xp.toLocaleString()} XP</p>
                                        <p className="text-xs text-green-600 flex items-center justify-end gap-1">
                                            <TrendingUp className="w-3 h-3" /> +150 this week
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Sidebar Stats */}
                    <div className="space-y-4 sm:space-y-6 order-1 lg:order-2">
                        {/* My Stats */}
                        <div className="bg-gradient-to-br from-primary to-primary-light text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
                            <div className="relative z-10">
                                <h3 className="font-bold opacity-90 mb-6">My Performance</h3>
                                <div className="flex justify-between items-end mb-2">
                                    <span className="text-4xl font-bold">Lvl 12</span>
                                    <span className="text-secondary font-bold">4,250 XP</span>
                                </div>
                                <div className="w-full bg-white/20 h-2 rounded-full mb-1">
                                    <div className="bg-secondary h-2 rounded-full" style={{ width: '75%' }}></div>
                                </div>
                                <p className="text-xs text-center opacity-70">750 XP to Level 13</p>
                            </div>
                        </div>

                        {/* Badges */}
                        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold flex items-center gap-2 text-sm sm:text-base">
                                    <Medal className="w-4 h-4 sm:w-5 sm:h-5 text-secondary-dark" />
                                    Recent Badges
                                </h3>
                                <Link
                                    href="/profile#badges"
                                    aria-label="View all badges"
                                    className="text-xs text-primary font-medium hover:underline cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary rounded"
                                >
                                    View All
                                </Link>
                            </div>

                            <div className="grid grid-cols-4 gap-2">
                                {[
                                    { icon: Flame, color: 'text-orange-500', unlocked: true },
                                    { icon: Zap, color: 'text-yellow-500', unlocked: true },
                                    { icon: Target, color: 'text-blue-500', unlocked: true },
                                    { icon: Crown, color: 'text-purple-500', unlocked: true },
                                    { icon: Rocket, color: 'text-emerald-500', unlocked: true },
                                    { icon: Heart, color: 'text-gray-300', unlocked: false },
                                    { icon: BookOpen, color: 'text-gray-300', unlocked: false },
                                    { icon: Award, color: 'text-gray-300', unlocked: false },
                                ].map((badge, i) => (
                                    <div
                                        key={i}
                                        className={`aspect-square rounded-lg flex items-center justify-center border group cursor-pointer transition-all ${badge.unlocked
                                                ? 'bg-gradient-to-br from-gray-50 to-white border-gray-200 hover:border-secondary hover:shadow-md hover:scale-105'
                                                : 'bg-gray-50 border-gray-100 opacity-50'
                                            }`}
                                        title={badge.unlocked ? 'Badge unlocked!' : 'Locked'}
                                    >
                                        <badge.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${badge.color}`} />
                                    </div>
                                ))}
                            </div>
                            <p className="text-[10px] sm:text-xs text-center text-gray-500 mt-3 sm:mt-4">12 / 30 Badges unlocked</p>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}
