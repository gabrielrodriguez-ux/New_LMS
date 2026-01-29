"use client";

import { useState, useEffect } from 'react';
import { ArrowLeft, Sparkles, BrainCircuit } from 'lucide-react';
import Link from 'next/link';
import SourceManager from '@/components/studio/SourceManager';
import GeneratorControls from '@/components/studio/GeneratorControls';
import { apiClient } from '@/utils/api-client';

import { useSearchParams } from 'next/navigation';

export default function ContentStudioPage({ params }: { params: { id: string } }) {
    const { id } = params;
    const searchParams = useSearchParams();
    const contentId = searchParams.get('contentId');
    const [course, setCourse] = useState<any>(null);

    useEffect(() => {
        // Fetch course details to display title
        const fetchCourse = async () => {
            const data = await apiClient.get('CATALOG', `/api/courses/${id}`);
            if (data) setCourse(data);
        };
        fetchCourse();
    }, [id]);

    return (
        <div className="h-[calc(100vh-2rem)] flex flex-col space-y-6 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex justify-between items-center shrink-0">
                <div className="flex items-center gap-4">
                    <Link
                        href="/admin/classrooms"
                        className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center hover:bg-slate-50 transition-all shadow-sm"
                    >
                        <ArrowLeft className="w-5 h-5 text-slate-400" />
                    </Link>
                    <div>
                        <div className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-purple-500" />
                            <h1 className="text-2xl font-black text-slate-900 tracking-tight">AI Content Studio</h1>
                        </div>
                        <p className="text-slate-500 text-xs mt-0.5 font-medium">
                            Generating content for <span className="font-bold text-slate-700">{course?.title || 'Loading...'}</span>
                        </p>
                    </div>
                </div>

                <div className="px-4 py-2 bg-purple-50 rounded-xl border border-purple-100 flex items-center gap-2">
                    <BrainCircuit className="w-4 h-4 text-purple-600" />
                    <span className="text-[10px] font-black text-purple-700 uppercase tracking-widest">Powered by Google Gemini</span>
                </div>
            </div>

            {/* Split View */}
            <div className="flex-1 grid grid-cols-12 gap-6 min-h-0">
                {/* Left Panel: Sources */}
                <div className="col-span-4 h-full">
                    <SourceManager />
                </div>

                {/* Right Panel: Generator */}
                <div className="col-span-8 h-full">
                    <GeneratorControls />
                </div>
            </div>
        </div>
    );
}
