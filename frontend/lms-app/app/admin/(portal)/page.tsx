"use client";

import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { Users, FileText, CheckCircle, TrendingUp, AlertTriangle, FileBarChart } from "lucide-react";

export default function AdminDashboard() {
    const supabase = createClient();
    const [stats, setStats] = useState({
        totalUsers: 0,
        activeSubscriptions: 0,
        completionRate: 68, // Hardcoded for now until progress calc logic
        fundaeRisk: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchStats() {
            try {
                // Parallel fetching
                const [usersRes, subsRes, fundaeRes] = await Promise.all([
                    supabase.from('users').select('*', { count: 'exact', head: true }),
                    supabase.from('subscriptions').select('*', { count: 'exact', head: true }).eq('status', 'active'),
                    supabase.from('fundae_expedients').select('*', { count: 'exact', head: true }).eq('status', 'draft') // Mock "at risk" logic
                ]);

                setStats({
                    totalUsers: usersRes.count || 0,
                    activeSubscriptions: subsRes.count || 0,
                    completionRate: 68,
                    fundaeRisk: 15 // Mock until we have real tracking data
                });
            } catch (error) {
                console.error("Error fetching stats:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchStats();
    }, []);

    if (loading) return <div className="p-8 text-center text-gray-500">Loading dashboard data...</div>;

    return (
        <div className="space-y-8">
            <h1 className="text-2xl font-bold text-gray-900">Program Overview (Realtime)</h1>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: "Registered Users", value: stats.totalUsers, sub: "Across all clients", icon: Users, color: "bg-blue-100 text-blue-600" },
                    { label: "Active Contracts", value: stats.activeSubscriptions, sub: "B2B Subscriptions", icon: FileBarChart, color: "bg-green-100 text-green-600" },
                    { label: "FUNDAE at Risk", value: stats.fundaeRisk, sub: "Requires attention", icon: AlertTriangle, color: "bg-orange-100 text-orange-600" },
                    { label: "Avg. Engagement", value: "8.4", sub: "High Activity", icon: TrendingUp, color: "bg-purple-100 text-purple-600" },
                ].map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                        <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center`}>
                                    <Icon className="w-6 h-6" />
                                </div>
                            </div>
                            <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                            <div className="text-sm text-gray-500 font-medium">{stat.label}</div>
                            <div className="text-xs text-gray-400 mt-2">{stat.sub}</div>
                        </div>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* FUNDAE Monitor Placeholder */}
                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-lg text-gray-800">FUNDAE Real-time Monitor</h3>
                        <button className="text-sm text-primary hover:underline">View Detailed Report</button>
                    </div>

                    <div className="p-8 text-center bg-gray-50 rounded-lg border border-dashed border-gray-200">
                        <p className="text-gray-500">Connect to 'fundae_expedients' table to verify real compliance data.</p>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="font-bold text-lg text-gray-800 mb-6">Quick Actions</h3>
                    <div className="space-y-3">
                        <button className="w-full py-3 px-4 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-light transition-colors flex items-center justify-center gap-2">
                            <Users className="w-4 h-4" /> Upload New Users (CSV)
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
