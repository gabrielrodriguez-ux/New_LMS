"use client";

import { useState } from "react";
import { AlertTriangle, Download, Filter, CheckCircle2, FileText, Clock, TrendingUp, Search, MoreHorizontal, X, ArrowRight } from "lucide-react";

export default function AdminFundaePage() {
    const [selectedClient, setSelectedClient] = useState("All Clients");
    const [selectedProgram, setSelectedProgram] = useState("All Programs");
    const [showWarning, setShowWarning] = useState(true);

    // Mock Data
    const EXPEDIENTES = [
        { id: "EXP-2025-001", type: "Inicio de Formación", cohort: "ThePowerMBA Sept", client: "Acme Corp", students: 450, status: "Submitted", date: "Sept 15, 2025", progress: 100 },
        { id: "EXP-2025-002", type: "Seguimiento Mensual", cohort: "ThePowerMBA Sept", client: "Acme Corp", students: 448, status: "Validated", date: "Oct 15, 2025", progress: 100 },
        { id: "EXP-2025-003", type: "Fin de Formación", cohort: "Digital Mkt Summer", client: "Global Bank", students: 120, status: "Pending", date: "Oct 20, 2025", progress: 65 },
        { id: "EXP-2025-004", type: "Inicio de Formación", cohort: "Data Science Oct", client: "TechStartups", students: 50, status: "Submitted", date: "Oct 25, 2025", progress: 100 },
        { id: "EXP-2025-005", type: "Fin de Formación", cohort: "Leadership Program", client: "Consulting Inc", students: 200, status: "Rejected", date: "Oct 28, 2025", progress: 100 },
    ];

    const filteredData = EXPEDIENTES.filter(row => {
        if (selectedClient !== "All Clients" && row.client !== selectedClient) return false;
        if (selectedProgram !== "All Programs" && !row.cohort.includes(selectedProgram)) return false;
        return true;
    });

    const stats = {
        total: filteredData.length,
        compliance: Math.round((filteredData.filter(d => d.status === 'Validated').length / filteredData.length) * 100) || 0,
        pending: filteredData.filter(d => d.status === 'Pending').length
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">FUNDAE Compliance</h1>
                        <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-indigo-100">
                            Fiscal Year 2025
                        </span>
                    </div>
                    <p className="text-slate-500 text-sm max-w-xl">
                        Monitor attendance thresholds, validate teaching guides, and generate official XML reports for bonus verification.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm">
                        <FileText className="w-4 h-4" /> Documentation
                    </button>
                    <button className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/20 active:scale-95">
                        <Download className="w-4 h-4" /> Export Global XML
                    </button>
                </div>
            </div>

            {/* Metrics Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group">
                    <div className="relative z-10">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Active Expedientes</p>
                        <p className="text-4xl font-black text-slate-900">{stats.total}</p>
                    </div>
                    <div className="absolute right-0 top-0 w-24 h-24 bg-indigo-50 rounded-bl-[2.5rem] -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
                    <FileText className="w-8 h-8 text-indigo-200 absolute right-6 top-6" />
                </div>

                <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group">
                    <div className="relative z-10">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Validation Rate</p>
                        <p className="text-4xl font-black text-slate-900">{stats.compliance}%</p>
                    </div>
                    <div className="absolute right-0 top-0 w-24 h-24 bg-emerald-50 rounded-bl-[2.5rem] -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
                    <CheckCircle2 className="w-8 h-8 text-emerald-200 absolute right-6 top-6" />
                </div>

                <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group">
                    <div className="relative z-10">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Pending Actions</p>
                        <p className="text-4xl font-black text-slate-900">{stats.pending}</p>
                    </div>
                    <div className="absolute right-0 top-0 w-24 h-24 bg-amber-50 rounded-bl-[2.5rem] -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
                    <Clock className="w-8 h-8 text-amber-200 absolute right-6 top-6" />
                </div>
            </div>

            {/* Warning Banner */}
            {showWarning && (
                <div className="bg-orange-50 border border-orange-100 p-6 rounded-3xl relative animate-in slide-in-from-top-2 duration-500">
                    <div className="flex items-start gap-5">
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm shrink-0">
                            <AlertTriangle className="w-6 h-6 text-orange-500" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold text-lg text-orange-950">Compliance Risk Detected</h3>
                            <p className="text-sm text-orange-800/80 mt-1 leading-relaxed max-w-3xl">
                                System analysis indicates <strong>15 students</strong> are currently below the required 75% attendance threshold for the detailed reporting period ending <strong>Oct 30</strong>. Immediate intervention is recommended to secure full bonification.
                            </p>
                            <button className="mt-4 text-xs font-black bg-white text-orange-600 px-4 py-2 rounded-xl shadow-sm hover:bg-orange-100 transition-colors uppercase tracking-widest">
                                Review Affected Students
                            </button>
                        </div>
                        <button onClick={() => setShowWarning(false)} className="p-2 hover:bg-orange-100 rounded-full text-orange-400 transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            )}

            {/* Main Content Area */}
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                {/* Formatting Toolkit */}
                <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50/30">
                    <div className="flex items-center gap-4">
                        <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
                            <Search className="w-5 h-5 text-slate-400" />
                        </div>
                        <h3 className="font-bold text-slate-700">Audit Log & Expedientes</h3>
                    </div>

                    <div className="flex flex-wrap gap-3 items-center">
                        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-4 py-2.5 shadow-sm">
                            <Filter className="w-4 h-4 text-slate-400" />
                            <select
                                value={selectedClient}
                                onChange={(e) => setSelectedClient(e.target.value)}
                                className="bg-transparent text-xs font-bold text-slate-600 outline-none cursor-pointer min-w-[120px]"
                            >
                                <option>All Clients</option>
                                <option>Acme Corp</option>
                                <option>Global Bank</option>
                                <option>TechStartups</option>
                            </select>
                        </div>

                        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-4 py-2.5 shadow-sm">
                            <TrendingUp className="w-4 h-4 text-slate-400" />
                            <select
                                value={selectedProgram}
                                onChange={(e) => setSelectedProgram(e.target.value)}
                                className="bg-transparent text-xs font-bold text-slate-600 outline-none cursor-pointer min-w-[120px]"
                            >
                                <option>All Programs</option>
                                <option>ThePowerMBA</option>
                                <option>Digital Mkt</option>
                                <option>Data Science</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Data Table */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-100">
                            <tr>
                                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">ID Reference</th>
                                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Action Type</th>
                                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Context</th>
                                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                <th className="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredData.length > 0 ? (
                                filteredData.map((row, i) => (
                                    <tr key={i} className="group hover:bg-slate-50/50 transition-colors">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:shadow-md transition-all">
                                                    <FileText className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-900 font-mono text-xs">{row.id}</p>
                                                    <p className="text-[10px] text-slate-400 font-bold mt-0.5">{row.date}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <p className="font-bold text-slate-700 text-sm">{row.type}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <div className="h-1.5 w-16 bg-slate-100 rounded-full overflow-hidden">
                                                    <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${row.progress}%` }}></div>
                                                </div>
                                                <span className="text-[10px] font-bold text-slate-400">{row.progress}% Complete</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <p className="font-bold text-slate-900 text-sm">{row.cohort}</p>
                                            <p className="text-xs text-slate-500 font-medium">{row.client} • {row.students} Students</p>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${row.status === 'Validated' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                                    row.status === 'Submitted' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                                        row.status === 'Pending' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                                            'bg-rose-50 text-rose-600 border-rose-100'
                                                }`}>
                                                {row.status === 'Validated' && <CheckCircle2 className="w-3 h-3" />}
                                                {row.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">
                                                <MoreHorizontal className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-8 py-12 text-center">
                                        <div className="flex flex-col items-center justify-center">
                                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                                                <Search className="w-8 h-8 text-slate-300" />
                                            </div>
                                            <p className="text-slate-900 font-bold">No expedientes found</p>
                                            <p className="text-slate-400 text-sm mt-1">Try adjusting your filters to see more results.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Footer */}
                <div className="p-6 border-t border-slate-100 flex justify-between items-center bg-slate-50/30">
                    <p className="text-xs font-bold text-slate-400">Showing {filteredData.length} of {EXPEDIENTES.length} results</p>
                    <div className="flex gap-2">
                        <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition-all shadow-sm">Previous</button>
                        <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm">Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
