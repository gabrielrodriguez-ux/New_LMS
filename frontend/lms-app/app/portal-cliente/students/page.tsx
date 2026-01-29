"use client";

import {
    Search,
    Filter,
    MoreHorizontal,
    UserPlus,
    TrendingUp,
    Mail,
    Shield,
    Calendar,
    ArrowUpRight,
    Download,
    CheckCircle2,
    Clock
} from "lucide-react";
import { useState } from "react";

const MOCK_STUDENTS = [
    { id: "1", name: "Gabriel Rodriguez", email: "gabriel@acme.com", program: "ThePowerMBA", progress: 78, status: "Active", lastActivity: "2 mins ago", role: "Growth Hacker" },
    { id: "2", name: "Alice Thompson", email: "alice@acme.com", program: "Digital Marketing", progress: 92, status: "Active", lastActivity: "1 hour ago", role: "Frontend Dev" },
    { id: "3", name: "Bob Wilson", email: "bob@acme.com", program: "ThePowerMBA", progress: 100, status: "Completed", lastActivity: "1 day ago", role: "Product Manager" },
    { id: "4", name: "Charlie Davis", email: "charlie@acme.com", program: "Sales Force", progress: 15, status: "Inactive", lastActivity: "2 days ago", role: "Sales Executive" },
    { id: "5", name: "Diana Prince", email: "diana@acme.com", program: "Agile Leadership", progress: 45, status: "Active", lastActivity: "5 mins ago", role: "Operations" },
];

export default function StudentsPage() {
    const [searchTerm, setSearchTerm] = useState("");

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header section with Stats */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">Student Management</h1>
                    <p className="text-slate-500 text-sm mt-1">Monitor individual progress, assign programs and manage access.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm active:scale-95">
                        <Download className="w-4 h-4" /> Export Report
                    </button>
                    <button className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-2xl text-sm font-bold hover:bg-slate-800 transition-all shadow-lg active:scale-95">
                        <UserPlus className="w-4 h-4" /> Invite Students
                    </button>
                </div>
            </div>

            {/* Quick Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                        <Shield className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Seats Used</p>
                        <p className="text-2xl font-black text-slate-900">45 <span className="text-sm font-medium text-slate-300">/ 50</span></p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
                        <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Completions</p>
                        <p className="text-2xl font-black text-slate-900">12</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600">
                        <Clock className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Avg. Time</p>
                        <p className="text-2xl font-black text-slate-900">12.4h</p>
                    </div>
                </div>
            </div>

            {/* Filter & Table Area */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
                {/* Table Header / Filters */}
                <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row gap-4 justify-between items-center">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search by name, email or role..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-slate-200 transition-all outline-none"
                        />
                    </div>
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <select className="flex-1 md:flex-none px-4 py-3 bg-slate-50 rounded-2xl text-sm font-bold text-slate-600 outline-none border-none cursor-pointer">
                            <option>All Programs</option>
                            <option>ThePowerMBA</option>
                            <option>Digital Marketing</option>
                        </select>
                        <button className="p-3 bg-slate-50 rounded-2xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all">
                            <Filter className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Table Content */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Student Info</th>
                                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Program</th>
                                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Progression</th>
                                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                                <th className="px-8 py-5 text-right"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {MOCK_STUDENTS.filter(s =>
                                s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                s.email.toLowerCase().includes(searchTerm.toLowerCase())
                            ).map((student) => (
                                <tr key={student.id} className="hover:bg-slate-50/50 transition-colors group cursor-pointer">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center font-black text-slate-500 shadow-sm border-2 border-white group-hover:scale-110 transition-transform">
                                                {student.name.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-900">{student.name}</p>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    <Mail className="w-3 h-3 text-slate-300" />
                                                    <p className="text-xs text-slate-400 font-medium">{student.email}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div>
                                            <p className="text-sm font-bold text-slate-700">{student.program}</p>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">{student.role}</p>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 min-w-[200px]">
                                        <div className="flex flex-col gap-2">
                                            <div className="flex justify-between items-center text-[10px] font-black uppercase text-slate-400">
                                                <span>Progress</span>
                                                <span className="text-slate-900">{student.progress}%</span>
                                            </div>
                                            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full transition-all duration-1000 ${student.progress === 100 ? 'bg-emerald-500' : 'bg-slate-900'
                                                        }`}
                                                    style={{ width: `${student.progress}%` }}
                                                />
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider shadow-sm ${student.status === 'Active' ? 'bg-emerald-50 text-emerald-600' :
                                                student.status === 'Completed' ? 'bg-blue-50 text-blue-600' :
                                                    'bg-slate-100 text-slate-400'
                                            }`}>
                                            {student.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-2.5 bg-slate-50 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-all">
                                                <TrendingUp className="w-4 h-4" />
                                            </button>
                                            <button className="p-2.5 bg-slate-50 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-all">
                                                <MoreHorizontal className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Placeholder */}
                <div className="p-8 bg-slate-50/30 border-t border-slate-50 flex justify-between items-center">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Showing 5 of 45 students</p>
                    <div className="flex gap-2">
                        <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-400 cursor-not-allowed">Previous</button>
                        <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 hover:bg-slate-50 shadow-sm transition-all">Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
