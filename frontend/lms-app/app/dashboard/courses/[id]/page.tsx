"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Play, CheckCircle, Circle, FileText, Download, ChevronDown, ChevronUp, MessageSquare, Mic, BookOpen, ChevronRight, ChevronLeft, Volume2, Maximize, Layers, AlignLeft, Menu, X } from "lucide-react";
import { apiClient } from "@/utils/api-client";
import DiscussionTab from "@/components/DiscussionTab";
import ResourcesTab from "@/components/ResourcesTab";
import NPSSurveyPlayer from "@/components/NPSSurveyPlayer";

// Types for 3-Level Hierarchy
type Content = {
    id: string; // UUID
    title: string;
    type: "video" | "quiz" | "text" | "scorm" | "nps";
    contentUrl?: string;
    duration?: string;
    completed: boolean;
};

type Unit = {
    id: string;
    title: string;
    contents: Content[];
    isOpen?: boolean;
};

type Module = {
    id: string;
    title: string;
    units: Unit[];
    completedCount: number;
    totalCount: number;
    isOpen?: boolean;
};

export default function CoursePlayerPage({ params }: { params: { id: string } }) {
    const [activeTab, setActiveTab] = useState("notes");
    const [modules, setModules] = useState<Module[]>([]);
    const [currentContentId, setCurrentContentId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [noteContent, setNoteContent] = useState("");
    const [isSaved, setIsSaved] = useState(false);
    const [progress, setProgress] = useState<any[]>([]);
    const [showSidebar, setShowSidebar] = useState(false);
    const [error, setError] = useState<{ type: 'invalid_id' | 'not_found' | 'server_error'; message: string } | null>(null);

    useEffect(() => {
        fetchCourseData();
    }, [params.id]);

    const fetchCourseData = async () => {
        try {
            setLoading(true);
            setError(null);

            // Validate UUID format
            const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
            if (!uuidRegex.test(params.id)) {
                setError({
                    type: 'invalid_id',
                    message: 'The course ID provided is not valid. Please check the URL and try again.'
                });
                setLoading(false);
                return;
            }

            // 1. Fetch Hierarchy
            const structureRes = await apiClient.get('CATALOG', `/api/courses/${params.id}/structure`);

            // 2. Fetch Progress (mocked userId)
            const progressRes = await apiClient.get('PROGRESS', `/api/progress?courseId=${params.id}&userId=00000000-0000-0000-0000-000000000000`);

            if (structureRes?.modules && structureRes.modules.length > 0) {
                // Transform API data to UI state
                const mappedModules: Module[] = structureRes.modules.map((m: any) => ({
                    id: m.id,
                    title: m.title,
                    completedCount: 0, // calc later
                    totalCount: 0, // calc later
                    isOpen: true,
                    units: m.units.map((u: any) => ({
                        id: u.id,
                        title: u.title,
                        isOpen: true,
                        contents: u.contents.map((c: any) => ({
                            id: c.id,
                            title: c.title,
                            type: c.type,
                            contentUrl: c.content_url,
                            completed: progressRes?.some((p: any) => p.moduleId === c.id && p.status === 'completed') || false
                        }))
                    }))
                }));

                // Calculate counts
                mappedModules.forEach(m => {
                    let mTotal = 0;
                    let mCompleted = 0;
                    m.units.forEach(u => {
                        mTotal += u.contents.length;
                        mCompleted += u.contents.filter(c => c.completed).length;
                    });
                    m.totalCount = mTotal;
                    m.completedCount = mCompleted;
                });

                setModules(mappedModules);

                // Set initial content
                if (mappedModules.length > 0 && mappedModules[0].units.length > 0 && mappedModules[0].units[0].contents.length > 0) {
                    setCurrentContentId(mappedModules[0].units[0].contents[0].id);
                }
            } else {
                // No modules found - course might not exist
                setError({
                    type: 'not_found',
                    message: 'This course could not be found or has no content yet.'
                });
            }
        } catch (error: any) {
            console.error("Failed to load course", error);

            // Handle specific error cases
            if (error?.message?.includes('404') || error?.message?.includes('not found')) {
                setError({
                    type: 'not_found',
                    message: 'This course does not exist or has been removed.'
                });
            } else {
                setError({
                    type: 'server_error',
                    message: 'An error occurred while loading the course. Please try again later.'
                });
            }
        } finally {
            setLoading(false);
        }
    };

    const toggleModule = (moduleId: string) => {
        setModules(modules.map(m =>
            m.id === moduleId ? { ...m, isOpen: !m.isOpen } : m
        ));
    };

    // Toggle Unit inside a Module
    /* const toggleUnit = (unitId: string) => {
         // Deep update needed if we want unit folding
    } */

    const handleContentComplete = async (contentId: string) => {
        // Optimistic update
        setModules(prev => prev.map(m => ({
            ...m,
            units: m.units.map(u => ({
                ...u,
                contents: u.contents.map(c => c.id === contentId ? { ...c, completed: true } : c)
            }))
        })));

        await apiClient.post('PROGRESS', '/api/progress', {
            userId: '00000000-0000-0000-0000-000000000000',
            courseId: params.id,
            moduleId: contentId, // In new schema, progress tracks content_id
            status: 'completed'
        });
    };

    const handleSaveNote = () => {
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2000);
    };

    // Navigation helpers
    const getAllContents = (): { content: Content; moduleId: string; unitId: string }[] => {
        const allContents: { content: Content; moduleId: string; unitId: string }[] = [];
        modules.forEach(module => {
            module.units.forEach(unit => {
                unit.contents.forEach(content => {
                    allContents.push({ content, moduleId: module.id, unitId: unit.id });
                });
            });
        });
        return allContents;
    };

    const getCurrentIndex = () => {
        const allContents = getAllContents();
        return allContents.findIndex(item => item.content.id === currentContentId);
    };

    const handlePreviousLesson = () => {
        const allContents = getAllContents();
        const currentIndex = getCurrentIndex();
        if (currentIndex > 0) {
            setCurrentContentId(allContents[currentIndex - 1].content.id);
        }
    };

    const handleNextLesson = () => {
        const allContents = getAllContents();
        const currentIndex = getCurrentIndex();
        if (currentIndex < allContents.length - 1) {
            setCurrentContentId(allContents[currentIndex + 1].content.id);
            // Auto-mark as completed when advancing
            if (currentContentId) {
                handleContentComplete(currentContentId);
            }
        }
    };

    const hasPrevious = getCurrentIndex() > 0;
    const hasNext = getCurrentIndex() < getAllContents().length - 1;

    if (loading) return <div className="h-screen flex items-center justify-center bg-gray-50"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;

    // Error State UI
    if (error) {
        return (
            <div className="h-screen flex items-center justify-center bg-gray-50">
                <div className="max-w-md w-full mx-4">
                    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
                        <div className="flex flex-col items-center text-center">
                            {/* Error Icon */}
                            <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${error.type === 'invalid_id' ? 'bg-yellow-100' :
                                error.type === 'not_found' ? 'bg-red-100' : 'bg-orange-100'
                                }`}>
                                <svg className={`w-8 h-8 ${error.type === 'invalid_id' ? 'text-yellow-600' :
                                    error.type === 'not_found' ? 'text-red-600' : 'text-orange-600'
                                    }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>

                            {/* Error Title */}
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                {error.type === 'invalid_id' && 'Invalid Course ID'}
                                {error.type === 'not_found' && 'Course Not Found'}
                                {error.type === 'server_error' && 'Something Went Wrong'}
                            </h2>

                            {/* Error Message */}
                            <p className="text-gray-600 mb-6 leading-relaxed">
                                {error.message}
                            </p>

                            {/* Action Buttons */}
                            <div className="flex gap-3 w-full">
                                <Link
                                    href="/dashboard"
                                    className="flex-1 px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-light transition-colors text-center"
                                >
                                    Go to Dashboard
                                </Link>
                                {error.type === 'server_error' && (
                                    <button
                                        onClick={() => window.location.reload()}
                                        className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
                                    >
                                        Retry
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen flex flex-col bg-white">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 px-3 sm:px-4 py-3 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2 sm:gap-4">
                    <Link href="/dashboard" className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600">
                        <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                    </Link>
                    <div className="flex items-center gap-2">
                        <span className="hidden sm:inline bg-primary text-white text-xs font-bold px-2 py-1 rounded">COURSE</span>
                        <h1 className="text-xs sm:text-sm font-bold text-gray-800 truncate max-w-[150px] sm:max-w-none">Course Viewer</h1>
                    </div>
                </div>
                <button
                    onClick={() => setShowSidebar(!showSidebar)}
                    className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    aria-label="Toggle syllabus"
                >
                    {showSidebar ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
            </header>

            {/* Main Layout */}
            <div className="flex-1 flex overflow-hidden">

                {/* Left Column (Video & Tabs) */}
                <div className="flex-1 flex flex-col overflow-y-auto">
                    {/* Content Player Area */}
                    {(() => {
                        // Find current content
                        let currentContent: Content | undefined = undefined;
                        modules.forEach(module => {
                            module.units.forEach(unit => {
                                const found = unit.contents.find(c => c.id === currentContentId);
                                if (found) currentContent = found;
                            });
                        });

                        // Render based on content type
                        if (currentContent && currentContent.type === 'nps') {
                            return (
                                <NPSSurveyPlayer
                                    contentId={currentContent.id}
                                    onComplete={(score, comment) => {
                                        console.log('NPS Response:', { score, comment });
                                        if (currentContentId) {
                                            handleContentComplete(currentContentId);
                                        }
                                    }}
                                />
                            );
                        }

                        // Default: Video player placeholder
                        return (
                            <div className="bg-black aspect-video w-full relative group flex items-center justify-center">
                                <p className="text-white text-sm">Media Player Placeholder for {currentContentId}</p>
                            </div>
                        );
                    })()}


                    {/* Tabs Navigation */}
                    <div className="border-b border-gray-200 overflow-x-auto">
                        <div className="flex gap-4 sm:gap-8 px-4 sm:px-6 min-w-max">
                            {['notes', 'transcript', 'resources', 'discussion'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`py-3 sm:py-4 text-xs sm:text-sm font-semibold border-b-2 transition-colors capitalize whitespace-nowrap ${activeTab === tab
                                        ? "border-secondary-dark text-primary"
                                        : "border-transparent text-gray-500 hover:text-gray-800"
                                        }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Tab Content */}
                    <div className="p-4 sm:p-6 flex-1 bg-gray-50/50">
                        {activeTab === 'notes' && (
                            <div className="max-w-3xl">
                                <h3 className="font-bold text-gray-800 mb-4">My Notes</h3>
                                <div className="bg-white p-2 rounded-xl border border-gray-200 shadow-sm">
                                    <textarea
                                        value={noteContent}
                                        onChange={(e) => setNoteContent(e.target.value)}
                                        placeholder="Take notes..."
                                        className="w-full h-40 p-4 resize-none outline-none text-gray-700 placeholder:text-gray-400"
                                    ></textarea>
                                    <div className="flex justify-between items-center px-4 py-2 border-t border-gray-100 bg-gray-50 rounded-b-lg">
                                        <span className="text-xs text-gray-500">
                                            {isSaved ? <span className="text-green-600 font-bold flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Saved!</span> : "Unsaved changes"}
                                        </span>
                                        <button onClick={handleSaveNote} className="px-4 py-1.5 bg-primary text-white text-xs font-bold rounded-md hover:bg-primary-light">Save</button>
                                    </div>
                                </div>
                            </div>
                        )}
                        {activeTab === 'transcript' && (
                            <div className="max-w-3xl">
                                <h3 className="font-bold text-gray-800 mb-4">Video Transcript</h3>
                                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
                                    <p className="text-sm text-gray-600 leading-relaxed">
                                        <span className="text-gray-400 font-mono text-xs mr-3">00:00</span>
                                        Welcome to this module on Business Strategy. In this lesson, we'll explore the fundamentals of market analysis.
                                    </p>
                                    <p className="text-sm text-gray-600 leading-relaxed">
                                        <span className="text-gray-400 font-mono text-xs mr-3">00:15</span>
                                        Market analysis is a critical component of strategic planning. It helps organizations understand their competitive landscape.
                                    </p>
                                    <p className="text-sm text-gray-600 leading-relaxed">
                                        <span className="text-gray-400 font-mono text-xs mr-3">00:32</span>
                                        We'll cover three main topics: competitor analysis, market segmentation, and trend identification.
                                    </p>
                                    <div className="pt-4 border-t border-gray-100">
                                        <p className="text-xs text-gray-400 italic">Transcript generated automatically. May contain errors.</p>
                                    </div>
                                </div>
                            </div>
                        )}
                        {activeTab === 'discussion' && <DiscussionTab courseId={params.id} />}
                        {activeTab === 'resources' && <ResourcesTab />}
                    </div>
                </div>

                {/* Right Sidebar (Syllabus Tree) - Mobile overlay + Desktop fixed */}
                <>
                    {/* Mobile overlay backdrop */}
                    {showSidebar && (
                        <div
                            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                            onClick={() => setShowSidebar(false)}
                        />
                    )}

                    {/* Sidebar */}
                    <div className={`
                        fixed lg:relative inset-y-0 right-0 z-50 lg:z-10
                        w-80 sm:w-96 bg-white border-l border-gray-200 flex flex-col shrink-0 shadow-xl shadow-gray-200/50
                        transform transition-transform duration-300 ease-in-out
                        ${showSidebar ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
                    `}>
                        <div className="p-4 sm:p-6 border-b border-gray-200 bg-gray-50/30 flex items-center justify-between">
                            <h2 className="font-bold text-base sm:text-lg text-gray-900">Syllabus</h2>
                            <button
                                onClick={() => setShowSidebar(false)}
                                className="lg:hidden p-1.5 hover:bg-gray-200 rounded-lg"
                                aria-label="Close syllabus"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto custom-scrollbar">
                            {modules.map((module) => (
                                <div key={module.id} className="border-b border-gray-100 last:border-0">
                                    {/* Level 1: Module */}
                                    <button
                                        onClick={() => toggleModule(module.id)}
                                        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors group sticky top-0 bg-white z-10"
                                    >
                                        <div className="text-left flex items-center gap-3">
                                            <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
                                                <Layers className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-gray-800 text-sm group-hover:text-primary transition-colors">{module.title}</h3>
                                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{module.units.length} UNITS</p>
                                            </div>
                                        </div>
                                        {module.isOpen ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                                    </button>

                                    {/* Level 2 & 3: Units & Contents */}
                                    {module.isOpen && (
                                        <div className="bg-gray-50/50 pb-2">
                                            {module.units.map((unit) => (
                                                <div key={unit.id} className="pl-6 pr-4 py-2">
                                                    <div className="flex items-center gap-2 mb-2 px-2">
                                                        <AlignLeft className="w-3 h-3 text-gray-400" />
                                                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">{unit.title}</span>
                                                    </div>

                                                    <div className="space-y-1 pl-3 border-l-2 border-gray-200 ml-1.5">
                                                        {unit.contents.map((content) => (
                                                            <div
                                                                key={content.id}
                                                                onClick={() => setCurrentContentId(content.id)}
                                                                className={`px-3 py-2.5 rounded-lg flex items-start gap-3 cursor-pointer transition-all ${currentContentId === content.id
                                                                    ? "bg-white shadow-sm border border-gray-200"
                                                                    : "hover:bg-gray-100 hover:ml-1"
                                                                    }`}
                                                            >
                                                                <div className="mt-0.5 shrink-0">
                                                                    {content.completed ? (
                                                                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                                                                    ) : (
                                                                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${currentContentId === content.id ? "border-secondary" : "border-gray-300"}`}>
                                                                            {currentContentId === content.id && <div className="w-1.5 h-1.5 bg-secondary rounded-full" />}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <p className={`text-xs font-medium truncate ${currentContentId === content.id ? "text-gray-900" : "text-gray-600"}`}>
                                                                        {content.title}
                                                                    </p>
                                                                    <div className="flex items-center gap-2 mt-1">
                                                                        {content.type === 'video' && <Play className="w-3 h-3 text-gray-400" />}
                                                                        {content.type === 'quiz' && <FileText className="w-3 h-3 text-gray-400" />}
                                                                        <span className="text-[10px] text-gray-400">{content.duration || '5m'}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Lesson Navigation Controls - Fixed at bottom */}
                        <div className="border-t border-gray-200 bg-white p-4 space-y-3">
                            <button
                                onClick={() => currentContentId && handleContentComplete(currentContentId)}
                                className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold text-emerald-700 bg-emerald-50 rounded-xl hover:bg-emerald-100 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                aria-label="Mark lesson as complete"
                            >
                                <CheckCircle className="w-5 h-5" />
                                Mark as Complete
                            </button>

                            <div className="grid grid-cols-2 gap-2">
                                <button
                                    onClick={handlePreviousLesson}
                                    disabled={!hasPrevious}
                                    aria-label="Previous lesson"
                                    className="flex items-center justify-center gap-1 px-3 py-2 text-xs font-semibold text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer focus:outline-none focus:ring-2 focus:ring-gray-300"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                    Previous
                                </button>

                                <button
                                    onClick={handleNextLesson}
                                    disabled={!hasNext}
                                    aria-label="Next lesson"
                                    className="flex items-center justify-center gap-1 px-3 py-2 text-xs font-semibold text-white bg-primary rounded-lg hover:bg-primary-light transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary"
                                >
                                    Next
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </>

            </div>
        </div>
    );
}
