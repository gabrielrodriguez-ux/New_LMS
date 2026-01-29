"use client";

import {
    FileText,
    Download,
    ShieldCheck,
    AlertCircle,
    Clock,
    CheckCircle2,
    Filter,
    Search,
    ChevronRight,
    ExternalLink,
    PieChart,
    BarChart
} from "lucide-react";
import { useState } from "react";

const COMPLIANCE_RECORDS = [
    { id: "EXP-2025-001", course: "ThePowerMBA Global Strategy", students: 120, avgAttendance: 82, status: "Validated", date: "2025-01-15", score: 98 },
    { id: "EXP-2025-002", course: "Digital Marketing Rockstars", students: 85, avgAttendance: 71, status: "At Risk", date: "2025-01-20", score: 65 },
    { id: "EXP-2025-003", course: "Agile Leadership", students: 45, avgAttendance: 95, status: "Submitted", date: "2025-01-22", score: 100 },
];

export default function FundaeReportsPage() {
    const [activeTab, setActiveTab] = useState("expedients");

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header section */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">FUNDAE & Reporting</h1>
                    <p className="text-slate-500 text-sm mt-1">Monitor compliance, generate expedients, and export audit-ready reports.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm active:scale-95">
                        <Download className="w-4 h-4" /> Export All (XML/PDF)
                    </button>
                    <button className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-2xl text-sm font-bold hover:bg-slate-800 transition-all shadow-lg active:scale-95">
                        <ShieldCheck className="w-4 h-4" /> Validate Status
                    </button>
                </div>
            </div>

            {/* Compliance Overview Dashboard */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Compliance Score</p>
                        <div className="flex flex-col items-center justify-center py-4">
                            <div className="relative w-32 h-32 flex items-center justify-center">
                                <svg className="w-full h-full transform -rotate-90">
                                    <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-50" />
                                    <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray="364" strokeDashoffset="44" className="text-emerald-500 transition-all duration-1000 ease-out" />
                                </svg>
                                <span className="absolute text-3xl font-black text-slate-900">88%</span>
                            </div>
                            <p className="text-xs font-bold text-emerald-500 mt-4 uppercase tracking-wider">Health: Great</p>
                        </div>
                    </div>

                    <div className="bg-slate-900 rounded-[2rem] p-6 text-white shadow-xl relative overflow-hidden group">
                        <div className="relative z-10">
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-4">Quick Audit</p>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-medium text-slate-300">Min. Attendance</span>
                                    <span className="text-xs font-bold">75.0%</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-medium text-slate-300">Min. Hours</span>
                                    <span className="text-xs font-bold">12.0h</span>
                                </div>
                                <div className="pt-4 mt-4 border-t border-white/10">
                                    <p className="text-[10px] text-slate-400 leading-relaxed italic">System validates activity every 10 minutes according to SEPE standards.</p>
                                </div>
                            </div>
                        </div>
                        <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-colors"></div>
                    </div>
                </div>

                {/* Expedients Table */}
                <div className="lg:col-span-3 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
                    <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                        <div className="flex gap-8">
                            {["expedients", "certificates", "audit_log"].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`text-sm font-bold pb-2 transition-all relative ${activeTab === tab ? "text-slate-900" : "text-slate-400 hover:text-slate-600"
                                        }`}
                                >
                                    {tab.split('_').join(' ').toUpperCase()}
                                    {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#a1e6c5] rounded-full"></div>}
                                </button>
                            ))}
                        </div>
                        <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-xl">
                            <button className="p-2 bg-white shadow-sm rounded-lg text-slate-600">
                                <Filter className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-50/50">
                                    <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Expedient ID</th>
                                    <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Course Name</th>
                                    <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Avg. Progress</th>
                                    <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                                    <th className="px-8 py-5 text-right"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {COMPLIANCE_RECORDS.map((record) => (
                                    <tr key={record.id} className="hover:bg-slate-50/50 transition-colors group cursor-pointer">
                                        <td className="px-8 py-6">
                                            <div>
                                                <p className="text-sm font-black text-slate-900">{record.id}</p>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">{record.date}</p>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                                                    <FileText className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-slate-700">{record.course}</p>
                                                    <p className="text-xs text-slate-400">{record.students} students enrolled</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col items-center gap-1">
                                                <span className={`text-sm font-black ${record.avgAttendance < 75 ? 'text-red-500' : 'text-slate-900'}`}>
                                                    {record.avgAttendance}%
                                                </span>
                                                <div className="w-24 h-1 bg-slate-100 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full ${record.avgAttendance < 75 ? 'bg-red-500' : 'bg-emerald-500'}`}
                                                        style={{ width: `${record.avgAttendance}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider ${record.status === 'Validated' ? 'bg-emerald-50 text-emerald-600' :
                                                    record.status === 'Submitted' ? 'bg-blue-50 text-blue-600' :
                                                        'bg-amber-50 text-amber-600'
                                                }`}>
                                                {record.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <button className="p-2.5 hover:bg-slate-100 rounded-xl transition-all opacity-0 group-hover:opacity-100">
                                                <Download className="w-4 h-4 text-slate-400 hover:text-slate-900" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="p-8 bg-slate-50/30 border-t border-slate-50">
                        <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-widest">
                            <p>Compliance automated by ThePower Backoffice Engine v2.4</p>
                            <div className="flex items-center gap-4">
                                <span className="flex items-center gap-1 text-emerald-500"><CheckCircle2 className="w-3 h-3" /> SEPE API Connected</span>
                                <span className="flex items-center gap-1"><AlertCircle className="w-3 h-3" /> 2 Issues Found</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Section: Audit Log & Documentation */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm space-y-6">
                    <div className="flex justify-between items-center">
                        <h3 className="font-bold text-slate-900 flex items-center gap-2">
                            <Clock className="w-5 h-5 text-slate-400" /> Recent Audit Entries
                        </h3>
                        <button className="text-xs font-bold text-indigo-600 hover:underline">View History</button>
                    </div>
                    <div className="space-y-4">
                        {[
                            { action: "Expedient Generated", user: "Jane Doe", time: "10 mins ago", target: "EXP-2025-003" },
                            { action: "Manual Validation", user: "Gabriel R.", time: "1 hour ago", target: "EXP-2025-001" },
                            { action: "XML Exported", user: "Backend System", time: "2 hours ago", target: "All Q1 Data" }
                        ].map((log, i) => (
                            <div key={i} className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0 hover:bg-slate-50 rounded-xl px-2 transition-colors cursor-pointer">
                                <div className="flex items-center gap-4">
                                    <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-800">{log.action}</p>
                                        <p className="text-xs text-slate-400">{log.user} • {log.target}</p>
                                    </div>
                                </div>
                                <span className="text-[10px] font-bold text-slate-400">{log.time}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-indigo-600 rounded-3xl p-8 text-white relative overflow-hidden flex flex-col justify-center">
                    <div className="relative z-10 text-center space-y-4">
                        <h3 className="text-2xl font-black tracking-tight">Need a Certified Report?</h3>
                        <p className="text-indigo-100 text-sm max-w-xs mx-auto">Generate a single PDF with all active students' certificates and attendance logs.</p>
                        <button className="bg-white text-indigo-600 px-8 py-3 rounded-2xl font-black text-sm hover:bg-indigo-50 transition-all shadow-xl shadow-indigo-900/20 active:scale-95">
                            Generate Full Audit PDF
                        </button>
                    </div>
                    {/* SVG Absract Background */}
                    <div className="absolute inset-0 opacity-10 pointer-events-none">
                        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                            <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    );
}
