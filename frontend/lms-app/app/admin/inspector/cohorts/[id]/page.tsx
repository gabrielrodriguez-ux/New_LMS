"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { ArrowLeft, User, Clock, CheckCircle2, AlertTriangle, FileText, Download, GraduationCap } from 'lucide-react';
import Link from 'next/link';

export default function CohortDetailsPage({ params }: { params: { id: string } }) {
    const { id } = params;
    const [cohort, setCohort] = useState<any>(null);
    const [students, setStudents] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            // 1. Fetch Cohort Details
            const { data: cohortData } = await supabase
                .from('cohorts')
                .select('*, course:courses(title, hours)')
                .eq('id', id)
                .single();
            setCohort(cohortData);

            // 2. Fetch Students (Enrollments)
            // Mocking some data structure as we might not have full enrollments populated yet
            const { data: enrollments, error } = await supabase
                .from('enrollments')
                .select(`
                    id, 
                    status, 
                    progress_pct, 
                    last_accessed_at,
                    diploma_downloaded,
                    fundae_questionnaire_completed,
                    user:users(first_name, last_name, avatar_url)
                `)
                .eq('cohort_id', id);

            console.log("Inspector Enrollments Fetch:", { enrollments, error });

            if (enrollments && enrollments.length > 0) {
                setStudents(enrollments);
            } else if (id === 'fb80723e-5c9b-47db-86c1-f6a24ab72eea') {
                // FALLBACK: If Supabase fetch fails for Demo Cohort, use Hardcoded Data
                console.warn("Using Fallback Mock Data for Demo Cohort");
                setStudents([
                    {
                        id: 'mock-1',
                        status: 'in_progress',
                        progress_pct: 65,
                        last_accessed_at: new Date().toISOString(),
                        user: { first_name: 'Roberto', last_name: 'Demo', avatar_url: null },
                        diploma_downloaded: false,
                        fundae_questionnaire_completed: false
                    },
                    {
                        id: 'mock-2',
                        status: 'completed',
                        progress_pct: 100,
                        last_accessed_at: new Date(Date.now() - 86400000).toISOString(),
                        user: { first_name: 'Lucía', last_name: 'Demo', avatar_url: null },
                        diploma_downloaded: true,
                        fundae_questionnaire_completed: true
                    },
                    {
                        id: 'mock-3',
                        status: 'in_progress',
                        progress_pct: 30,
                        last_accessed_at: new Date(Date.now() - 172800000).toISOString(),
                        user: { first_name: 'Andrés', last_name: 'Demo', avatar_url: null },
                        diploma_downloaded: false,
                        fundae_questionnaire_completed: false
                    },
                    {
                        id: 'mock-4',
                        status: 'in_progress',
                        progress_pct: 88,
                        last_accessed_at: new Date().toISOString(),
                        user: { first_name: 'Carlos', last_name: 'Demo', avatar_url: null },
                        diploma_downloaded: false,
                        fundae_questionnaire_completed: true
                    }
                ]);
            }
            if (error) console.error("Error fetching enrollments:", error);

            setIsLoading(false);
        };

        fetchData();
    }, [id]);

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
            {/* Header */}
            <div>
                <Link
                    href="/admin/inspector"
                    aria-label="Back to Inspector Dashboard"
                    className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-800 mb-4 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-slate-300 rounded"
                >
                    <ArrowLeft className="w-4 h-4" /> Back to Dashboard
                </Link>

                <div className="flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">
                            {cohort?.name || 'Loading...'}
                        </h1>
                        <p className="text-slate-500 font-medium text-lg">
                            {cohort?.course?.title}
                        </p>
                    </div>
                    <div className="text-right flex items-center gap-3">
                        <div className="px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-xl">
                            <span className="text-xs font-black text-indigo-400 uppercase tracking-widest block">Duration</span>
                            <span className="font-bold text-indigo-900">{cohort?.course?.hours || 0} Hours</span>
                        </div>

                        {/* Download Tutor CV Button */}
                        <button
                            onClick={() => {
                                // Mock CV download - in production, fetch actual CV file URL from database
                                const cvContent = `TUTOR CV - ${cohort?.name}\n\nName: María González\nTitle: Senior Business Strategy Expert\nYears of Experience: 15 years\n\nEducation:\n- MBA, IESE Business School\n- Bachelor in Economics, Universidad Complutense Madrid\n\nExpertise:\n- Business Strategy & Consulting\n- Market Analysis & Competitive Intelligence\n- Global Expansion Planning\n\nCertifications:\n- Fundae Certified Instructor\n- PMP Project Management Professional\n\nPrevious Companies:\n- McKinsey & Company (Senior Consultant)\n- Deloitte (Strategy Manager)\n- Inditex (Strategic Planning Director)`;

                                const blob = new Blob([cvContent], { type: 'text/plain' });
                                const url = window.URL.createObjectURL(blob);
                                const link = document.createElement("a");
                                link.setAttribute("href", url);
                                link.setAttribute("download", `CV_Tutor_${cohort?.name}_${new Date().toISOString().split('T')[0]}.txt`);
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                                window.URL.revokeObjectURL(url);
                            }}
                            aria-label="Download tutor CV"
                            className="px-4 py-2 bg-emerald-600 text-white rounded-xl shadow-md hover:bg-emerald-700 transition-all flex items-center gap-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                        >
                            <GraduationCap className="w-4 h-4" />
                            <span className="text-xs font-bold uppercase tracking-widest">Tutor CV</span>
                        </button>

                        {/* Download Teaching Guide Button */}
                        <button
                            onClick={() => {
                                // Mock Teaching Guide download - in production, fetch from course metadata
                                const guideContent = `TEACHING GUIDE\n${cohort?.course?.title}\n\nProgram Overview:\nThis comprehensive program covers fundamental business strategy concepts and practical applications for modern enterprises.\n\nLearning Objectives:\n1. Understand core business strategy frameworks\n2. Analyze competitive markets effectively\n3. Develop strategic expansion plans\n\nTeaching Methodology:\n- Interactive case studies\n- Group discussions\n- Practical exercises\n- Real-world simulations\n\nAssessment Criteria:\n- Participation: 20%\n- Assignments: 30%\n- Group Project: 25%\n- Final Exam: 25%\n\nRequired Materials:\n- Course slides (available in LMS)\n- Harvard Business Review cases\n- Recommended reading list\n\nSession Structure:\n- Week 1-2: Fundamentals & Frameworks\n- Week 3-4: Market Analysis\n- Week 5-6: Competitive Strategy\n- Week 7-8: Implementation & Review`;

                                const blob = new Blob([guideContent], { type: 'text/plain' });
                                const url = window.URL.createObjectURL(blob);
                                const link = document.createElement("a");
                                link.setAttribute("href", url);
                                link.setAttribute("download", `Teaching_Guide_${cohort?.course?.title?.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.txt`);
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                                window.URL.revokeObjectURL(url);
                            }}
                            aria-label="Download teaching guide"
                            className="px-4 py-2 bg-purple-600 text-white rounded-xl shadow-md hover:bg-purple-700 transition-all flex items-center gap-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                        >
                            <Download className="w-4 h-4" />
                            <span className="text-xs font-bold uppercase tracking-widest">Teaching Guide</span>
                        </button>

                        <button
                            onClick={() => {
                                // Mock Export Logic
                                const headers = "Student,Email,Progress,Status,Last Access,Tests Passed,Sessions Count,Messages Sent\n";
                                const rows = students.map(s => {
                                    const mockEmail = `${s.user?.first_name?.toLowerCase()}.${s.user?.last_name?.split(' ')[0].toLowerCase()}@demo.com`;
                                    return `${s.user?.first_name} ${s.user?.last_name},${mockEmail},${s.progress_pct}%,${s.status},${s.last_accessed_at},${Math.floor(Math.random() * 5)},${Math.floor(Math.random() * 20)},${Math.floor(Math.random() * 10)}`
                                }).join("\n");
                                const csvContent = "data:text/csv;charset=utf-8," + headers + rows;
                                const encodedUri = encodeURI(csvContent);
                                const link = document.createElement("a");
                                link.setAttribute("href", encodedUri);
                                link.setAttribute("download", `FUNDAE_Report_${cohort?.name}_${new Date().toISOString().split('T')[0]}.csv`);
                                document.body.appendChild(link);
                                link.click();
                            }}
                            aria-label="Download FUNDAE report"
                            className="px-4 py-2 bg-slate-900 text-white rounded-xl shadow-md hover:bg-slate-800 transition-all flex items-center gap-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-700"
                        >
                            <FileText className="w-4 h-4" />
                            <span className="text-xs font-bold uppercase tracking-widest">FUNDAE Report</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Students Table */}
            {/* DEBUG Info removed for production */}

            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-slate-100 bg-slate-50/50">
                                <th className="p-6 text-xs font-black text-slate-400 uppercase tracking-widest">Student</th>
                                <th className="p-6 text-xs font-black text-slate-400 uppercase tracking-widest">Status</th>
                                <th className="p-6 text-xs font-black text-slate-400 uppercase tracking-widest">Progress</th>
                                <th className="p-6 text-xs font-black text-slate-400 uppercase tracking-widest text-center">Diploma</th>
                                <th className="p-6 text-xs font-black text-slate-400 uppercase tracking-widest text-center">Quest. Fundae</th>
                                <th className="p-6 text-xs font-black text-slate-400 uppercase tracking-widest">Last Access</th>
                                <th className="p-6 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} className="p-12 text-center font-bold text-slate-400">Loading student data...</td>
                                </tr>
                            ) : students.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-12 text-center font-bold text-slate-400">No students enrolled yet.</td>
                                </tr>
                            ) : (
                                students.map((student: any) => (
                                    <tr key={student.id} className="group hover:bg-slate-50/80 transition-colors">
                                        <td className="p-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden">
                                                    {student.user?.avatar_url ? (
                                                        <img src={student.user.avatar_url} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <User className="w-5 h-5 text-slate-400" />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-900">{student.user?.first_name} {student.user?.last_name}</p>
                                                    <p className="text-xs font-medium text-slate-500">
                                                        {student.user?.first_name?.toLowerCase()}.{student.user?.last_name?.split(' ')[0].toLowerCase()}@demo.com
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${student.status === 'completed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                                student.status === 'in_progress' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                                    'bg-slate-100 text-slate-500 border-slate-200'
                                                }`}>
                                                {student.status === 'completed' && <CheckCircle2 className="w-3 h-3" />}
                                                {student.status === 'in_progress' && <Clock className="w-3 h-3" />}
                                                {student.status?.replace('_', ' ').toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="p-6">
                                            <div className="flex items-center gap-3">
                                                <div className="flex-1 h-2 bg-slate-100 rounded-full w-24 overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full ${student.progress_pct >= 100 ? 'bg-emerald-500' : 'bg-indigo-500'
                                                            }`}
                                                        style={{ width: `${student.progress_pct}%` }}
                                                    ></div>
                                                </div>
                                                <span className="text-xs font-bold text-slate-700">{student.progress_pct}%</span>
                                            </div>
                                        </td>
                                        <td className="p-6 text-center">
                                            {student.diploma_downloaded ? (
                                                <div className="inline-flex p-1 bg-emerald-100 text-emerald-600 rounded-full">
                                                    <CheckCircle2 className="w-4 h-4" />
                                                </div>
                                            ) : (
                                                <div className="inline-flex p-1 bg-slate-100 text-slate-300 rounded-full">
                                                    <div className="w-4 h-4 rounded-full border-2 border-slate-300"></div>
                                                </div>
                                            )}
                                        </td>
                                        <td className="p-6 text-center">
                                            {student.fundae_questionnaire_completed ? (
                                                <div className="inline-flex p-1 bg-emerald-100 text-emerald-600 rounded-full">
                                                    <CheckCircle2 className="w-4 h-4" />
                                                </div>
                                            ) : (
                                                <div className="inline-flex p-1 bg-slate-100 text-slate-300 rounded-full">
                                                    <div className="w-4 h-4 rounded-full border-2 border-slate-300"></div>
                                                </div>
                                            )}
                                        </td>
                                        <td className="p-6 text-sm font-bold text-slate-500">
                                            {student.last_accessed_at ? new Date(student.last_accessed_at).toLocaleDateString() : 'Never'}
                                        </td>
                                        <td className="p-6 text-right">
                                            <button className="p-2 hover:bg-white hover:shadow-md rounded-lg border border-transparent hover:border-slate-100 transition-all text-slate-400 hover:text-indigo-600">
                                                <FileText className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
