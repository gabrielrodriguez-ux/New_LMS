"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Shield, Calendar, Users, ChevronRight, BarChart3, TrendingUp, AlertCircle, PlayCircle } from 'lucide-react';
import Link from 'next/link';

export default function InspectorDashboardPage() {
    const [cohorts, setCohorts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCohorts = async () => {
            setIsLoading(true);
            // DEMO MODE: Hardcoding Inspector ID for Elena (mocking session)
            const demoInspectorId = 'd027975b-b305-410c-907a-b3fc01b9dabe';
            console.log("Fetching cohorts for inspector:", demoInspectorId);

            // 1. Get Assigned Cohort IDs
            const { data: assignments } = await supabase
                .from('inspector_assignments')
                .select('cohort_id')
                .eq('inspector_id', demoInspectorId);

            const assignedCohortIds = assignments?.map(a => a.cohort_id) || [];

            // 2. Fetch Cohorts details
            if (assignedCohortIds.length > 0) {
                const { data, error } = await supabase
                    .from('cohorts')
                    .select(`
                        id, 
                        name, 
                        start_date, 
                        end_date,
                        course:courses(title),
                        enrollments(count)
                    `)
                    .in('id', assignedCohortIds)
                    .order('start_date', { ascending: false });

                if (data) setCohorts(data);
                if (error) console.error("Error loading cohorts:", error);
            } else {
                console.log("No assignments found for demo user");
            }

            setIsLoading(false);
        };

        fetchCohorts();
    }, []);

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-indigo-50 rounded-lg border border-indigo-100">
                            <Shield className="w-6 h-6 text-indigo-600" />
                        </div>
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Inspector Dashboard</h1>
                    </div>
                    <p className="text-slate-500 font-medium">Monitoring academic compliance and cohort progress.</p>
                </div>
                <div className="flex gap-3">
                    <Link
                        href="/dashboard"
                        className="px-4 py-2 bg-white border border-slate-200 rounded-xl shadow-sm flex items-center gap-2 hover:bg-slate-50 transition-all cursor-pointer"
                    >
                        <PlayCircle className="w-4 h-4 text-indigo-600" />
                        <span className="text-xs font-bold text-slate-600">Acceso al Aula</span>
                    </Link>
                </div>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-blue-50 rounded-lg">
                            <Users className="w-5 h-5 text-blue-600" />
                        </div>
                        <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Active Students</span>
                    </div>
                    <p className="text-3xl font-black text-slate-900">1,248</p>
                    <div className="flex items-center gap-2 mt-2 text-emerald-600 text-xs font-bold">
                        <TrendingUp className="w-3 h-3" /> +12% vs last month
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-purple-50 rounded-lg">
                            <Calendar className="w-5 h-5 text-purple-600" />
                        </div>
                        <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Active Cohorts</span>
                    </div>
                    <p className="text-3xl font-black text-slate-900">{cohorts.length}</p>
                    <div className="flex items-center gap-2 mt-2 text-slate-400 text-xs font-bold">
                        Across 5 programs
                    </div>
                </div>
            </div>

            {/* Cohorts List */}
            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <h3 className="font-bold text-slate-800">Active Promotions</h3>
                    <button className="text-xs font-bold text-indigo-600 hover:text-indigo-700">View History</button>
                </div>

                <div className="divide-y divide-slate-100">
                    {isLoading ? (
                        <div className="p-12 text-center text-slate-400 text-sm font-bold">Loading cohorts data...</div>
                    ) : cohorts.length === 0 ? (
                        <div className="p-12 text-center text-slate-400 text-sm font-bold">No active cohorts found.</div>
                    ) : (
                        cohorts.map((cohort) => (
                            <div key={cohort.id} className="p-6 hover:bg-slate-50 transition-colors group">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center font-black text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                            {cohort.name.substring(0, 2).toUpperCase()}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900 text-lg group-hover:text-indigo-600 transition-colors">{cohort.name}</h4>
                                            <p className="text-sm font-medium text-slate-500">{cohort.course?.title}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-8">
                                        <div className="text-right">
                                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Period</p>
                                            <p className="text-sm font-bold text-slate-700">{cohort.start_date || 'TBD'} - {cohort.end_date || 'TBD'}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Students</p>
                                            <p className="text-sm font-bold text-slate-700">{cohort.enrollments[0]?.count || 0}</p>
                                        </div>
                                        <Link
                                            href={`/admin/inspector/cohorts/${cohort.id}`}
                                            className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center hover:bg-indigo-50 hover:border-indigo-200 transition-all"
                                        >
                                            <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-indigo-600" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
