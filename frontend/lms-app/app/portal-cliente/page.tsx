"use client";

import {
    Users,
    TrendingUp,
    BookOpen,
    Clock,
    ChevronRight,
    Calendar,
    UserCheck,
    AlertCircle,
    ArrowUpRight,
    BarChart3
} from "lucide-react";

export default function PortalClienteDashboard() {
    const stats = [
        { label: "Active Students", value: "482", sub: "+12% this month", icon: Users, color: "bg-blue-50 text-blue-600" },
        { label: "Avg. Progression", value: "64%", sub: "+5% vs last week", icon: TrendingUp, color: "bg-emerald-50 text-emerald-600" },
        { label: "Hours Logged", value: "1,240h", sub: "12.5h / student", icon: Clock, color: "bg-purple-50 text-purple-600" },
        { label: "Completion Rate", value: "89%", sub: "Top 5% in industry", icon: UserCheck, color: "bg-amber-50 text-amber-600" },
    ];

    const alerts = [
        { title: "FUNDAE Compliance", message: "3 students are under the 75% attendance threshold for the current period.", priority: "high" },
        { title: "New Course Available", message: "'Generative AI for Marketing' has been added to your catalog.", priority: "info" }
    ];

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-2xl ${stat.icon}`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                            <div className="p-1 px-2 bg-slate-50 rounded-lg text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                <ArrowUpRight className="w-4 h-4" />
                            </div>
                        </div>
                        <h4 className="text-slate-500 text-sm font-semibold">{stat.label}</h4>
                        <div className="flex items-baseline gap-2 mt-1">
                            <p className="text-3xl font-black text-slate-900 tracking-tight">{stat.value}</p>
                            <span className="text-[10px] font-bold text-emerald-500 uppercase">{stat.sub}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Program Progress */}
                <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
                    <div className="p-8 border-b border-slate-50 flex justify-between items-center">
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 tracking-tight">Active Programs</h3>
                            <p className="text-sm text-slate-400">Progression rates across your current cohorts.</p>
                        </div>
                        <button
                            aria-label="View all active programs"
                            className="text-sm font-bold text-indigo-600 hover:bg-indigo-50 px-4 py-2 rounded-xl transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            View All
                        </button>
                    </div>
                    <div className="p-8 flex-1 space-y-8">
                        {[
                            { name: "ThePowerMBA - Global Strategy", batch: "Cohort Jan 25", progress: 78, students: 120, trend: "up" },
                            { name: "Digital Marketing Rockstars", batch: "Cohort Nov 24", progress: 42, students: 85, trend: "down" },
                            { name: "Data Science for Managers", batch: "Cohort Feb 25", progress: 12, students: 45, trend: "up" }
                        ].map((prog, i) => (
                            <div key={i} className="space-y-3 group cursor-pointer">
                                <div className="flex justify-between items-end">
                                    <div>
                                        <h5 className="font-bold text-slate-800 group-hover:text-slate-900 transition-colors">{prog.name}</h5>
                                        <p className="text-xs text-slate-400 font-medium">{prog.batch} • {prog.students} Students</p>
                                    </div>
                                    <span className="text-sm font-black text-slate-900">{prog.progress}%</span>
                                </div>
                                <div className="h-2.5 w-full bg-slate-50 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-slate-900 rounded-full transition-all duration-1000 ease-out flex justify-end"
                                        style={{ width: `${prog.progress}%` }}
                                    >
                                        <div className="w-1 h-full bg-white/20"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Critical Alerts & Quick Actions */}
                <div className="space-y-8">
                    {/* Alerts Section */}
                    <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 text-[#a1e6c5] mb-6">
                                <AlertCircle className="w-5 h-5" />
                                <span className="text-xs font-bold uppercase tracking-widest">Action Required</span>
                            </div>
                            <div className="space-y-6">
                                {alerts.map((alert, i) => (
                                    <div key={i} className="space-y-1">
                                        <h5 className="font-bold text-sm leading-tight">{alert.title}</h5>
                                        <p className="text-xs text-slate-400 leading-relaxed">{alert.message}</p>
                                        <button
                                            aria-label="Resolve alert"
                                            className="text-[10px] font-bold text-[#a1e6c5] mt-2 flex items-center gap-1 hover:gap-2 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#a1e6c5] rounded"
                                        >
                                            Resolve Now <ChevronRight className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                        {/* Abstract Background Element */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                    </div>

                    {/* Quick Action Cards */}
                    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 space-y-6">
                        <h4 className="font-bold text-slate-900 text-sm uppercase tracking-widest">Quick Actions</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                aria-label="Assign seats to students"
                                className="flex flex-col items-center gap-2 p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-all group cursor-pointer focus:outline-none focus:ring-2 focus:ring-slate-300"
                            >
                                <div className="bg-white p-2 rounded-xl shadow-sm group-hover:scale-110 transition-transform">
                                    <Users className="w-5 h-5 text-slate-600" />
                                </div>
                                <span className="text-[10px] font-bold text-slate-600">Assign Seats</span>
                            </button>
                            <button
                                aria-label="Export report as PDF"
                                className="flex flex-col items-center gap-2 p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-all group cursor-pointer focus:outline-none focus:ring-2 focus:ring-slate-300"
                            >
                                <div className="bg-white p-2 rounded-xl shadow-sm group-hover:scale-110 transition-transform">
                                    <BarChart3 className="w-5 h-5 text-slate-600" />
                                </div>
                                <span className="text-[10px] font-bold text-slate-600">Export PDF</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Activity Table */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-slate-50 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-slate-900 tracking-tight">Recent Student Activity</h3>
                    <div className="flex gap-2">
                        <div
                            role="button"
                            aria-label="Filter by date"
                            tabIndex={0}
                            className="bg-slate-50 p-2 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-300"
                        >
                            <Calendar className="w-4 h-4 text-slate-400" />
                        </div>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Student</th>
                                <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Program</th>
                                <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                                <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Last Activity</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {[
                                { name: "Alice Thompson", email: "alice@acme.com", prog: "Business Strategy", status: "Active", time: "2 mins ago" },
                                { name: "Bob Wilson", email: "bob@acme.com", prog: "Marketing Dev", status: "Completed", time: "1 hour ago" },
                                { name: "Charlie Davis", email: "charlie@acme.com", prog: "Sales Force", status: "Inactive", time: "2 days ago" },
                            ].map((row, i) => (
                                <tr key={i} className="hover:bg-slate-50/50 transition-colors group cursor-pointer">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500 text-xs border-2 border-white shadow-sm">
                                                {row.name.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-800">{row.name}</p>
                                                <p className="text-xs text-slate-400">{row.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className="text-sm font-medium text-slate-600">{row.prog}</span>
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${row.status === 'Active' ? 'bg-emerald-50 text-emerald-600' :
                                            row.status === 'Completed' ? 'bg-blue-50 text-blue-600' :
                                                'bg-slate-100 text-slate-400'
                                            }`}>
                                            {row.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 text-sm text-slate-400 font-medium">
                                        {row.time}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
