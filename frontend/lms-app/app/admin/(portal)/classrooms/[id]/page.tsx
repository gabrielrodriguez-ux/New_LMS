"use client";

import { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Layers, AlignLeft, FileText, Sparkles, Trash2, GripVertical, ChevronDown, ChevronRight, Video, FileQuestion, BookOpen, Edit, Save, Upload, CheckCircle2, BarChart3, Database, History, Download, Clock, FileSpreadsheet } from 'lucide-react';
import Link from 'next/link';
import { apiClient } from '@/utils/api-client';
import { useRouter } from 'next/navigation';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
    useDroppable,
    DragOverEvent,
    DragStartEvent,
    DragOverlay,
    defaultDropAnimationSideEffects,
    DropAnimation,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function SortableContentItem({ content, onDelete, onEdit }: any) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: content.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 100 : 'auto',
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors group/item bg-white"
        >
            <div className="flex items-center gap-3">
                <div {...listeners} className="cursor-grab active:cursor-grabbing p-1 -ml-1 hover:bg-gray-100 rounded">
                    <GripVertical className="w-3.5 h-3.5 text-gray-300" />
                </div>
                {content.type === 'video' && <Video className="w-4 h-4 text-blue-400" />}
                {content.type === 'quiz' && <FileQuestion className="w-4 h-4 text-amber-500" />}
                {content.type === 'text' && <FileText className="w-4 h-4 text-gray-400" />}
                <span className="text-sm font-medium text-gray-700">{content.title}</span>
                {content.is_ai_generated && (
                    <span className="px-1.5 py-0.5 bg-purple-100 text-purple-600 text-[9px] font-bold rounded uppercase tracking-wider flex items-center gap-1">
                        <Sparkles className="w-2 h-2" /> AI
                    </span>
                )}
            </div>
            <div className="opacity-0 group-hover/item:opacity-100 transition-opacity flex items-center gap-2">
                <button
                    onClick={(e) => { e.stopPropagation(); onEdit(content); }}
                    className="p-1.5 hover:bg-indigo-50 text-gray-300 hover:text-indigo-500 rounded-lg transition-colors"
                >
                    <Edit className="w-3 h-3" />
                </button>
                <button
                    onClick={(e) => { e.stopPropagation(); onDelete(content.id); }}
                    className="p-1.5 hover:bg-red-50 text-gray-300 hover:text-red-500 rounded-lg transition-colors"
                >
                    <Trash2 className="w-3 h-3" />
                </button>
            </div>
        </div>
    );
}

function DroppableUnit({ unit, mIdx, uIdx, openContentModal, handleDeleteContent, handleEditContent }: any) {
    const { setNodeRef } = useDroppable({
        id: unit.id,
        data: {
            type: 'Unit',
            unit,
        },
    });

    return (
        <div
            ref={setNodeRef}
            className="bg-white border border-gray-200 rounded-2xl p-4 ml-6 relative transition-colors hover:border-indigo-300"
        >
            <div className="absolute -left-6 top-8 w-6 h-px bg-gray-200"></div>
            <div className="absolute -left-6 top-[-10px] bottom-8 w-px bg-gray-200"></div>

            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <AlignLeft className="w-4 h-4 text-gray-400" />
                    <span className="text-xs font-black text-gray-400 uppercase tracking-widest">UNIT {mIdx + 1}.{uIdx + 1}</span>
                    <h4 className="font-bold text-gray-700">{unit.title}</h4>
                </div>
                <button onClick={() => openContentModal(unit.id)} className="p-1 px-3 bg-gray-100 rounded-lg text-[10px] font-bold text-gray-600 hover:bg-gray-200 transition-colors uppercase tracking-widest flex items-center gap-1">
                    <Plus className="w-3 h-3" /> Content
                </button>
            </div>

            <div className="space-y-1 pl-4 border-l-2 border-gray-100 ml-2 min-h-[40px]">
                <SortableContext items={unit.contents?.map((c: any) => c.id) || []} strategy={verticalListSortingStrategy}>
                    {unit.contents?.map((content: any) => (
                        <SortableContentItem
                            key={content.id}
                            content={content}
                            onDelete={handleDeleteContent}
                            onEdit={handleEditContent}
                        />
                    ))}
                    {(!unit.contents || unit.contents.length === 0) && (
                        <div className="text-xs text-center text-gray-400 border-2 border-dashed border-gray-100 rounded-lg p-4 bg-gray-50/50">
                            Drop content here
                        </div>
                    )}
                </SortableContext>
            </div>
        </div>
    );
}

export default function CourseEditorPage({ params }: { params: { id: string } }) {
    const { id } = params;
    const router = useRouter();
    const [course, setCourse] = useState<any>(null);
    const [modules, setModules] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Modal States
    const [isModuleModalOpen, setIsModuleModalOpen] = useState(false);
    const [isUnitModalOpen, setIsUnitModalOpen] = useState(false);
    const [isContentModalOpen, setIsContentModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    // Selection State for Creations/Edits
    const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
    const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null);
    const [editingItem, setEditingItem] = useState<any>(null);

    // Forms
    const [newItemTitle, setNewItemTitle] = useState("");
    const [newItemUrl, setNewItemUrl] = useState("");
    const [newItemBody, setNewItemBody] = useState("");
    const [uploading, setUploading] = useState(false);
    const [contentType, setContentType] = useState("video"); // video, text, quiz
    const [isAiGenerated, setIsAiGenerated] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Version Control & Export
    const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
    const [history, setHistory] = useState([
        { version: 3, date: new Date().toISOString(), author: 'Gabriel R.', notes: 'Manual correction of Module 1' },
        { version: 2, date: new Date(Date.now() - 86400000).toISOString(), author: 'System', notes: 'Bulk Import: initial_load.zip' },
        { version: 1, date: new Date(Date.now() - 172800000).toISOString(), author: 'System', notes: 'Course Created' }
    ]);

    const handleExportExcel = async () => {
        try {
            const { exportCourseToExcel } = await import('@/utils/excel-exporter');
            exportCourseToExcel(course, modules);
        } catch (e) {
            console.error("Export failed", e);
            alert("Failed to export Excel");
        }
    };

    const handleRestoreVersion = async (ver: any) => {
        if (!confirm(`Are you sure you want to restore version v${ver.version}? Current unsaved changes will be lost.`)) return;

        setIsSaving(true);
        try {
            // Simulate backend restoration process
            await new Promise(resolve => setTimeout(resolve, 1000));

            // In a real implementation: await apiClient.post('CATALOG', `/api/courses/${course.id}/restore`, { version: ver.version });

            // Refresh data
            fetchData();

            // Add entry to history
            setHistory(prev => [{
                version: prev.length + 1,
                date: new Date().toISOString(),
                author: 'Gabriel R.',
                notes: `Restored from v${ver.version}`
            }, ...prev]);

            setIsHistoryModalOpen(false);
        } catch (e) {
            console.error("Restore failed", e);
        } finally {
            setIsSaving(false);
        }
    };

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    useEffect(() => {
        fetchData();
    }, [id]);

    const fetchData = async () => {
        console.log(`[Page] Fetching data for course ${id}...`);
        setLoading(true);
        setError(null);
        try {
            const courseData = await apiClient.get('CATALOG', `/api/courses/${id}`);
            console.log(`[Page] Course data received:`, courseData);

            if (!courseData) {
                // If null (404/500 swallowed by apiClient), assume failure for now
                console.warn("[Page] Course data is null");
            } else {
                setCourse(courseData);
            }

            const structureData = await apiClient.get('CATALOG', `/api/courses/${id}/structure`);
            console.log(`[Page] Structure data received:`, structureData);

            if (structureData) {
                setModules(structureData.modules?.map((m: any) => ({ ...m, isOpen: true, units: m.units?.map((u: any) => ({ ...u, isOpen: true })) || [] })) || []);
            } else {
                setModules([]);
            }
        } catch (err: any) {
            console.error("[Page] FetchData Error:", err);
            setError(err.message || "Failed to load course data");
        } finally {
            console.log(`[Page] FetchData finished. Setting loading=false`);
            setLoading(false);
        }
    };

    if (error) {
        return (
            <div className="flex flex-col h-screen items-center justify-center space-y-4">
                <div className="text-red-500 font-bold">Error Loading Course</div>
                <div className="text-sm bg-gray-100 p-4 rounded text-gray-700 font-mono">{error}</div>
                <button onClick={fetchData} className="px-4 py-2 bg-indigo-600 text-white rounded">Retry</button>
                <Link href="/admin/classrooms" className="text-indigo-600 hover:underline">Back to Classrooms</Link>
            </div>
        );
    }

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over) return;

        const activeId = active.id.toString();
        const overId = over.id.toString();

        // Find source module and unit
        let sourceModule: any;
        let sourceUnit: any;
        let activeItem: any;

        for (const mod of modules) {
            for (const unit of mod.units || []) {
                const item = unit.contents?.find((c: any) => c.id === activeId);
                if (item) {
                    sourceModule = mod;
                    sourceUnit = unit;
                    activeItem = item;
                    break;
                }
            }
            if (activeItem) break;
        }

        if (!sourceUnit || !activeItem) return;

        // Find target unit
        let targetUnit: any;

        // Case 1: Dropped over another item
        for (const mod of modules) {
            for (const unit of mod.units || []) {
                if (unit.contents?.some((c: any) => c.id === overId)) {
                    targetUnit = unit;
                    break;
                }
                // Case 2: Dropped over a unit directly (empty or not)
                if (unit.id === overId) {
                    targetUnit = unit;
                    break;
                }
            }
            if (targetUnit) break;
        }

        if (!targetUnit) return;

        // Clone modules logic
        const newModules = JSON.parse(JSON.stringify(modules));
        const sourceUnitClone = newModules.flatMap((m: any) => m.units).find((u: any) => u.id === sourceUnit.id);
        const targetUnitClone = newModules.flatMap((m: any) => m.units).find((u: any) => u.id === targetUnit.id);

        if (sourceUnit.id === targetUnit.id) {
            // Same unit reorder
            const oldIndex = sourceUnitClone.contents.findIndex((c: any) => c.id === activeId);
            const newIndex = targetUnitClone.contents.findIndex((c: any) => c.id === overId);

            if (oldIndex !== newIndex && newIndex !== -1) {
                sourceUnitClone.contents = arrayMove(sourceUnitClone.contents, oldIndex, newIndex);
                // Update order indexes
                sourceUnitClone.contents.forEach((c: any, idx: number) => c.order_index = idx);
                setModules(newModules);

                // Persist
                setIsSaving(true);
                try {
                    await apiClient.put('CATALOG', `/api/courses/contents/${activeId}`, {
                        orderIndex: newIndex
                    });
                } catch (e) { console.error(e); fetchData(); }
                finally { setIsSaving(false); }
            }
        } else {
            // Move to different unit
            const oldIndex = sourceUnitClone.contents.findIndex((c: any) => c.id === activeId);
            const itemToMove = sourceUnitClone.contents[oldIndex];

            // Remove from source
            sourceUnitClone.contents.splice(oldIndex, 1);

            // Add to target
            let newIndex;
            if (overId === targetUnit.id) {
                // Dropped on unit container -> add to end
                newIndex = targetUnitClone.contents.length;
            } else {
                // Dropped on item -> insert before/after based on implementation, usually replace index
                newIndex = targetUnitClone.contents.findIndex((c: any) => c.id === overId);
                if (newIndex === -1) newIndex = targetUnitClone.contents.length;
            }

            targetUnitClone.contents.splice(newIndex, 0, itemToMove);

            // Update indexes both units
            sourceUnitClone.contents.forEach((c: any, idx: number) => c.order_index = idx);
            targetUnitClone.contents.forEach((c: any, idx: number) => c.order_index = idx);

            setModules(newModules);

            // Persist
            setIsSaving(true);
            try {
                await apiClient.put('CATALOG', `/api/courses/contents/${activeId}`, {
                    unitId: targetUnit.id,
                    orderIndex: newIndex
                });
            } catch (e) { console.error(e); fetchData(); }
            finally { setIsSaving(false); }
        }
    };

    // --- Actions ---

    const handleCreateModule = async () => {
        if (!newItemTitle) return;
        const res = await apiClient.post('CATALOG', `/api/courses/${id}/modules`, {
            title: newItemTitle,
            orderIndex: modules.length
        });
        if (res) {
            setNewItemTitle("");
            setIsModuleModalOpen(false);
            fetchData();
        }
    };

    const handleCreateUnit = async () => {
        if (!newItemTitle || !selectedModuleId) return;
        const module = modules.find(m => m.id === selectedModuleId);
        const res = await apiClient.post('CATALOG', `/api/courses/modules/${selectedModuleId}/units`, {
            title: newItemTitle,
            orderIndex: module?.units?.length || 0
        });
        if (res) {
            setNewItemTitle("");
            setIsUnitModalOpen(false);
            fetchData();
        }
    };

    const handleCreateContent = async () => {
        if (!newItemTitle || !selectedUnitId) return;
        let currentCount = 0;
        modules.forEach(m => m.units?.forEach((u: any) => {
            if (u.id === selectedUnitId) currentCount = u.contents?.length || 0;
        }));

        const res = await apiClient.post('CATALOG', `/api/courses/units/${selectedUnitId}/contents`, {
            title: newItemTitle,
            type: contentType,
            contentUrl: newItemUrl,
            isAiGenerated: isAiGenerated,
            orderIndex: currentCount
        });

        if (res) {
            setNewItemTitle("");
            setIsContentModalOpen(false);
            if (isAiGenerated && res.id) {
                router.push(`/admin/classrooms/${id}/studio?contentId=${res.id}`);
            } else {
                fetchData();
            }
        }
    };

    const handleDeleteContent = async (contentId: string) => {
        if (!confirm("Are you sure you want to delete this content item?")) return;
        const res = await apiClient.delete('CATALOG', `/api/courses/contents/${contentId}`);
        if (res) fetchData();
    };

    const handleEditContent = (content: any) => {
        if (content.is_ai_generated) {
            router.push(`/admin/classrooms/${id}/studio?contentId=${content.id}`);
            return;
        }
        setEditingItem(content);
        setNewItemTitle(content.title || "");
        setNewItemUrl(content.content_url || "");
        setNewItemBody(content.body || "");
        setIsEditModalOpen(true);
    };

    const handleSaveEdit = async () => {
        if (!newItemTitle || !editingItem) return;
        const res = await apiClient.put('CATALOG', `/api/courses/contents/${editingItem.id}`, {
            title: newItemTitle,
            contentUrl: newItemUrl,
            body: newItemBody
        });
        if (res) {
            setIsEditModalOpen(false);
            setEditingItem(null);
            fetchData();
        }
    };

    // --- UI Helpers ---

    const handleFileUpload = async (file: File) => {
        if (!file) return;
        setUploading(true);
        try {
            const { supabase } = await import('@/lib/supabase');
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
            const filePath = `course-content/${fileName}`;

            const { data, error } = await supabase.storage
                .from('content') // Assuming 'content' bucket exists
                .upload(filePath, file);

            if (error) throw error;

            const { data: { publicUrl } } = supabase.storage
                .from('content')
                .getPublicUrl(filePath);

            setNewItemUrl(publicUrl);
        } catch (error) {
            console.error('Error uploading file:', error);
            // alert('Failed to upload file. Please check if the storage bucket exists.');
        } finally {
            setUploading(false);
        }
    };

    const openUnitModal = (modId: string) => { setSelectedModuleId(modId); setNewItemTitle(""); setIsUnitModalOpen(true); };
    const openContentModal = (unitId: string) => { setSelectedUnitId(unitId); setNewItemTitle(""); setContentType("video"); setIsAiGenerated(false); setIsContentModalOpen(true); };

    // --- Import Actions ---

    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [importProgress, setImportProgress] = useState<{ total: number, current: number, fileName: string, log: string[] } | null>(null);
    const [importResult, setImportResult] = useState<{ success: boolean, errors: string[] } | null>(null);

    const handleImportZip = async (file: File) => {
        if (!file) return;
        setImportProgress({ total: 0, current: 0, fileName: 'Starting...', log: [] });

        try {
            // Dynamic import to avoid SSR issues with JSZip potentially
            const { importCourseFromZip } = await import('@/utils/course-importer');

            const result = await importCourseFromZip(file, id, (progress) => {
                setImportProgress({
                    total: progress.totalFiles,
                    current: progress.processedFiles,
                    fileName: progress.currentFile,
                    log: progress.log
                });
            });

            setImportResult(result);
            if (result.success) {
                // Add to history
                setHistory(prev => [{
                    version: prev.length + 1,
                    date: new Date().toISOString(),
                    author: 'Gabriel R.',
                    notes: `Bulk Import: ${file.name}`
                }, ...prev]);

                fetchData(); // Reload structure
            }
        } catch (error) {
            console.error("Import failed", error);
            setImportResult({ success: false, errors: ["Unexpected import error"] });
        }
    };

    const handleMockImport = async () => {
        setImportProgress({ total: 0, current: 0, fileName: 'Initializing Demo...', log: [] });

        try {
            const { importMockCourse } = await import('@/utils/course-importer');
            const result = await importMockCourse(id, (progress) => {
                setImportProgress({
                    total: progress.totalFiles,
                    current: progress.processedFiles,
                    fileName: progress.currentFile,
                    log: progress.log
                });
            });
            setImportResult(result);
            if (result.success) {
                fetchData();
            }
        } catch (error) {
            console.error("Mock Import failed", error);
            setImportResult({ success: false, errors: ["Mock import failed"] });
        }
    };

    if (loading) return <div className="flex h-screen items-center justify-center"><div className="w-8 h-8 border-4 border-indigo-600 rounded-full animate-spin border-t-transparent"></div></div>;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-slate-900">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between sticky top-0 z-20">
                <div className="flex items-center gap-4">
                    <Link href="/admin/classrooms" className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                        <ArrowLeft className="w-5 h-5 text-gray-500" />
                    </Link>
                    <div>
                        <h1 className="text-xl font-black tracking-tight">{course?.title}</h1>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Course Curriculum Editor</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => setIsImportModalOpen(true)}
                        className="px-4 py-2 bg-white border border-gray-200 text-gray-600 text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-gray-50 transition-all shadow-sm flex items-center gap-2"
                    >
                        <Upload className="w-4 h-4" /> Import Zip
                    </button>
                    <button
                        onClick={() => setIsHistoryModalOpen(true)}
                        className="px-4 py-2 bg-white border border-gray-200 text-gray-600 text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-gray-50 transition-all shadow-sm flex items-center gap-2"
                    >
                        <History className="w-4 h-4" /> History
                    </button>
                    <button
                        onClick={handleExportExcel}
                        className="px-4 py-2 bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-emerald-100 transition-all shadow-sm flex items-center gap-2"
                    >
                        <FileSpreadsheet className="w-4 h-4" /> Export Excel
                    </button>
                    <button
                        onClick={() => { setNewItemTitle(""); setIsModuleModalOpen(true); }}
                        className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" /> New Module
                    </button>
                </div>
            </div>

            {/* Canvas */}
            <div className="flex-1 p-8 max-w-5xl mx-auto w-full space-y-8 pb-32">
                {modules.length === 0 && (
                    <div className="text-center py-20 bg-white rounded-[2rem] border-2 border-dashed border-gray-200">
                        <Layers className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-gray-400">Structure Empty</h3>
                        <p className="text-sm text-gray-400 mb-6">Start by creating the first learning module or import a course structure.</p>
                        <div className="flex justify-center gap-4">
                            <button onClick={() => setIsModuleModalOpen(true)} className="px-6 py-3 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 uppercase tracking-widest shadow-sm">
                                Create Module
                            </button>
                            <button onClick={() => setIsImportModalOpen(true)} className="px-6 py-3 bg-indigo-50 border border-indigo-100 rounded-xl text-sm font-bold text-indigo-600 hover:bg-indigo-100 uppercase tracking-widest shadow-sm">
                                Import Zip
                            </button>
                        </div>
                    </div>
                )}

                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    {modules.map((module, mIdx) => (
                        <div key={module.id} className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-6 bg-gray-50/50 border-b border-gray-100 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center border border-gray-200 font-black text-gray-300 text-xs">
                                        {String(mIdx + 1).padStart(2, '0')}
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-800">{module.title}</h3>
                                </div>
                                <button onClick={() => openUnitModal(module.id)} className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-indigo-600 hover:border-indigo-200 transition-all flex items-center gap-1">
                                    <Plus className="w-3 h-3" /> Add Unit
                                </button>
                            </div>

                            <div className="p-2 space-y-2">
                                {module.units?.map((unit: any, uIdx: number) => (
                                    <DroppableUnit
                                        key={unit.id}
                                        unit={unit}
                                        mIdx={mIdx}
                                        uIdx={uIdx}
                                        openContentModal={openContentModal}
                                        handleDeleteContent={handleDeleteContent}
                                        handleEditContent={handleEditContent}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </DndContext>
            </div>

            {isSaving && (
                <div className="fixed bottom-8 right-8 bg-slate-900 text-white px-4 py-2 rounded-full shadow-2xl flex items-center gap-2 animate-bounce z-50">
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></div>
                    <span className="text-[10px] font-bold uppercase tracking-widest">Saving curriculum structure...</span>
                </div>
            )}

            {/* Import Modal */}
            {isImportModalOpen && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white rounded-3xl p-8 w-full max-w-lg shadow-2xl">
                        <h3 className="text-lg font-black text-gray-800 mb-2">Bulk Import Course</h3>
                        <p className="text-sm text-gray-500 mb-6">Upload a ZIP file to automatically generate the course structure.</p>

                        {!importProgress && !importResult && (
                            <div className="space-y-4">
                                <div className="p-8 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl text-center">
                                    <label className="cursor-pointer block">
                                        <Upload className="w-10 h-10 text-indigo-400 mx-auto mb-3" />
                                        <span className="text-sm font-bold text-gray-600 block">Click to select ZIP file</span>
                                        <span className="text-xs text-gray-400 block mt-1">.zip files only</span>
                                        <input
                                            type="file"
                                            accept=".zip"
                                            className="hidden"
                                            onChange={(e) => e.target.files?.[0] && handleImportZip(e.target.files[0])}
                                        />
                                    </label>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="h-px bg-gray-200 flex-1"></div>
                                    <span className="text-xs font-bold text-gray-400 uppercase">OR</span>
                                    <div className="h-px bg-gray-200 flex-1"></div>
                                </div>
                                <button
                                    onClick={handleMockImport}
                                    className="w-full py-3 bg-indigo-50 border border-indigo-100 rounded-xl text-indigo-600 text-xs font-bold uppercase tracking-widest hover:bg-indigo-100 transition-colors flex items-center justify-center gap-2"
                                >
                                    <Database className="w-4 h-4" /> Generate Demo Content
                                </button>
                            </div>
                        )}

                        {importProgress && !importResult && (
                            <div className="space-y-4">
                                <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-gray-500">
                                    <span>Importing...</span>
                                    <span>{importProgress.current} / {importProgress.total} files</span>
                                </div>
                                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-indigo-600 transition-all duration-300 ease-out"
                                        style={{ width: `${importProgress.total > 0 ? (importProgress.current / importProgress.total) * 100 : 0}%` }}
                                    ></div>
                                </div>
                                <p className="text-xs text-gray-500 truncate font-mono bg-gray-50 p-2 rounded">
                                    Processing: {importProgress.fileName}
                                </p>
                                <div className="max-h-32 overflow-y-auto text-[10px] font-mono text-gray-400 space-y-1">
                                    {importProgress.log.slice(-5).map((l, i) => <div key={i}>{l}</div>)}
                                </div>
                            </div>
                        )}

                        {importResult && (
                            <div className="space-y-4">
                                {importResult.success ? (
                                    <div className="p-4 bg-emerald-50 text-emerald-700 rounded-xl flex items-center gap-3">
                                        <CheckCircle2 className="w-6 h-6" />
                                        <div>
                                            <p className="font-bold">Import Successful!</p>
                                            <p className="text-xs">The course structure has been created.</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="p-4 bg-red-50 text-red-700 rounded-xl">
                                        <p className="font-bold mb-1">Import Failed with Errors:</p>
                                        <ul className="text-xs list-disc pl-4 space-y-1">
                                            {importResult.errors.map((err, i) => <li key={i}>{err}</li>)}
                                        </ul>
                                    </div>
                                )}
                                <div className="flex justify-end pt-4">
                                    <button
                                        onClick={() => { setIsImportModalOpen(false); setImportResult(null); setImportProgress(null); }}
                                        className="px-6 py-2 bg-slate-900 text-white text-sm font-bold rounded-xl"
                                    >
                                        {importResult.success ? 'Done' : 'Close'}
                                    </button>
                                </div>
                            </div>
                        )}

                        {!importProgress && !importResult && (
                            <div className="flex justify-end gap-2 mt-6">
                                <button onClick={() => setIsImportModalOpen(false)} className="px-4 py-2 text-sm font-bold text-gray-500 hover:bg-gray-100 rounded-lg">Cancel</button>
                            </div>
                        )}
                    </div>
                </div>
            )}


            {/* Modals */}
            {isEditModalOpen && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white rounded-3xl p-8 w-full max-w-2xl shadow-2xl overflow-y-auto max-h-[90vh]">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-black text-gray-800">Edit {editingItem?.type === 'video' ? 'Video Lesson' : editingItem?.type === 'text' ? 'Document' : 'Content'}</h3>
                            {editingItem?.is_ai_generated && (
                                <Link
                                    href={`/admin/classrooms/${id}/studio?contentId=${editingItem.id}`}
                                    className="px-3 py-1.5 bg-purple-100 text-purple-600 text-[10px] font-bold uppercase rounded-lg hover:bg-purple-200 transition-colors flex items-center gap-1"
                                >
                                    <Sparkles className="w-3 h-3" /> Open in Studio
                                </Link>
                            )}
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 block mb-1">Title</label>
                                <input
                                    autoFocus
                                    className="w-full bg-gray-50 rounded-xl px-4 py-3 font-bold text-gray-700 outline-none focus:ring-2 focus:ring-indigo-500/20"
                                    value={newItemTitle}
                                    onChange={(e) => setNewItemTitle(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 block mb-1">Upload Material</label>
                                <div className="mt-1 flex items-center gap-4">
                                    <label className="flex-1 cursor-pointer">
                                        <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl p-4 text-center hover:bg-gray-100 transition-colors">
                                            <Upload className="w-6 h-6 text-gray-300 mx-auto mb-2" />
                                            <p className="text-xs font-bold text-gray-500">{uploading ? 'Uploading...' : 'Click to upload PDF, Video or Doc'}</p>
                                        </div>
                                        <input
                                            type="file"
                                            className="hidden"
                                            onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                                            disabled={uploading}
                                        />
                                    </label>
                                </div>
                            </div>

                            {newItemUrl && (
                                <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                        <span className="text-xs font-bold text-emerald-700 truncate max-w-[200px]">{newItemUrl}</span>
                                    </div>
                                    <button onClick={() => setNewItemUrl("")} className="text-[10px] font-bold text-emerald-600 hover:text-emerald-800 uppercase">Remove</button>
                                </div>
                            )}

                            {editingItem?.type === 'video' && (
                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 block mb-1">Video (Manual Link)</label>
                                    <input
                                        className="w-full bg-gray-50 rounded-xl px-4 py-3 font-medium text-gray-700 outline-none focus:ring-2 focus:ring-indigo-500/20"
                                        placeholder="Or paste video URL..."
                                        value={newItemUrl}
                                        onChange={(e) => setNewItemUrl(e.target.value)}
                                    />
                                </div>
                            )}

                            {(editingItem?.type === 'text' || editingItem?.type === 'video') && (
                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 block mb-1">
                                        {editingItem?.type === 'video' ? 'Transcription / Notes' : 'Content Body (Markdown)'}
                                    </label>
                                    <textarea
                                        rows={8}
                                        className="w-full bg-gray-50 rounded-xl px-4 py-3 font-medium text-gray-700 outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none font-mono text-sm"
                                        placeholder="Enter content here..."
                                        value={newItemBody}
                                        onChange={(e) => setNewItemBody(e.target.value)}
                                    />
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end gap-2 mt-8">
                            <button onClick={() => setIsEditModalOpen(false)} className="px-4 py-2 text-sm font-bold text-gray-500 hover:bg-gray-100 rounded-lg">Cancel</button>
                            <button onClick={handleSaveEdit} className="px-6 py-2 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 flex items-center gap-2">
                                <Save className="w-4 h-4" /> Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {isModuleModalOpen && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl">
                        <h3 className="text-lg font-black text-gray-800 mb-4">Create New Module</h3>
                        <input
                            autoFocus
                            className="w-full bg-gray-50 rounded-xl px-4 py-3 font-bold text-gray-700 outline-none focus:ring-2 focus:ring-indigo-500/20 mb-6"
                            placeholder="Module Title..."
                            value={newItemTitle}
                            onChange={(e) => setNewItemTitle(e.target.value)}
                        />
                        <div className="flex justify-end gap-2">
                            <button onClick={() => setIsModuleModalOpen(false)} className="px-4 py-2 text-sm font-bold text-gray-500 hover:bg-gray-100 rounded-lg">Cancel</button>
                            <button onClick={handleCreateModule} className="px-6 py-2 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700">Create Section</button>
                        </div>
                    </div>
                </div>
            )}

            {isUnitModalOpen && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl">
                        <h3 className="text-lg font-black text-gray-800 mb-4">Add Unit to Module</h3>
                        <input
                            autoFocus
                            className="w-full bg-gray-50 rounded-xl px-4 py-3 font-bold text-gray-700 outline-none focus:ring-2 focus:ring-indigo-500/20 mb-6"
                            placeholder="Unit Title..."
                            value={newItemTitle}
                            onChange={(e) => setNewItemTitle(e.target.value)}
                        />
                        <div className="flex justify-end gap-2">
                            <button onClick={() => setIsUnitModalOpen(false)} className="px-4 py-2 text-sm font-bold text-gray-500 hover:bg-gray-100 rounded-lg">Cancel</button>
                            <button onClick={handleCreateUnit} className="px-6 py-2 bg-black text-white text-sm font-bold rounded-xl hover:bg-gray-800">Add Unit</button>
                        </div>
                    </div>
                </div>
            )}

            {isContentModalOpen && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white rounded-3xl p-8 w-full max-w-lg shadow-2xl">
                        <h3 className="text-lg font-black text-gray-800 mb-6">Create Learning Content</h3>
                        <div className="space-y-4 mb-8">
                            {!isAiGenerated && (
                                <div className="p-4 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl">
                                    <label className="cursor-pointer block text-center">
                                        <Upload className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                                        <p className="text-xs font-bold text-gray-500">{uploading ? 'Uploading...' : 'Upload for your manual content'}</p>
                                        <p className="text-[10px] text-gray-400 uppercase mt-1">PDF, MP4, MP3, DOCX</p>
                                        <input
                                            type="file"
                                            className="hidden"
                                            onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                                            disabled={uploading}
                                        />
                                    </label>
                                </div>
                            )}

                            {newItemUrl && !isAiGenerated && (
                                <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                                        <span className="text-[10px] font-bold text-emerald-700 truncate max-w-[250px]">{newItemUrl}</span>
                                    </div>
                                    <button onClick={() => setNewItemUrl("")} className="text-[10px] font-bold text-emerald-600 hover:text-emerald-800 uppercase">Remove</button>
                                </div>
                            )}

                            <div>
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 block mb-1">Content Title</label>
                                <input
                                    autoFocus
                                    className="w-full bg-gray-50 rounded-xl px-4 py-3 font-bold text-gray-700 outline-none focus:ring-2 focus:ring-indigo-500/20"
                                    placeholder="e.g. Introduction Video"
                                    value={newItemTitle}
                                    onChange={(e) => setNewItemTitle(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 block mb-2">Content Type</label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button onClick={() => setContentType('video')} className={`p-3 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${contentType === 'video' ? 'border-indigo-600 bg-indigo-50 text-indigo-600' : 'border-gray-100 text-gray-500'}`}><Video className="w-5 h-5" /><span className="text-xs font-bold">Video Lesson</span></button>
                                    <button onClick={() => setContentType('quiz')} className={`p-3 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${contentType === 'quiz' ? 'border-indigo-600 bg-indigo-50 text-indigo-600' : 'border-gray-100 text-gray-500'}`}><FileQuestion className="w-5 h-5" /><span className="text-xs font-bold">Quiz / Exam</span></button>
                                    <button onClick={() => setContentType('text')} className={`p-3 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${contentType === 'text' ? 'border-indigo-600 bg-indigo-50 text-indigo-600' : 'border-gray-100 text-gray-500'}`}><FileText className="w-5 h-5" /><span className="text-xs font-bold">Document</span></button>
                                    <button onClick={() => setContentType('nps')} className={`p-3 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${contentType === 'nps' ? 'border-indigo-600 bg-indigo-50 text-indigo-600' : 'border-gray-100 text-gray-500'}`}><BarChart3 className="w-5 h-5" /><span className="text-xs font-bold">NPS Survey</span></button>
                                </div>
                            </div>
                            <div className="bg-purple-50 rounded-2xl p-4 border border-purple-100 flex items-center justify-between cursor-pointer" onClick={() => setIsAiGenerated(!isAiGenerated)}>
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${isAiGenerated ? 'bg-purple-500 text-white' : 'bg-white text-purple-300'}`}><Sparkles className="w-5 h-5" /></div>
                                    <div><p className="font-bold text-purple-900 text-sm">Generate with AI</p><p className="text-xs text-purple-600">Autogenerate content using Gemini</p></div>
                                </div>
                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${isAiGenerated ? 'border-purple-600 bg-purple-600' : 'border-purple-200 bg-white'}`}>{isAiGenerated && <div className="w-2 h-2 bg-white rounded-full" />}</div>
                            </div>
                        </div>
                        <div className="flex justify-end gap-2">
                            <button onClick={() => setIsContentModalOpen(false)} className="px-4 py-2 text-sm font-bold text-gray-500 hover:bg-gray-100 rounded-lg">Cancel</button>
                            <button onClick={handleCreateContent} className="px-6 py-2 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-slate-700 shadow-lg shadow-slate-200">{isAiGenerated ? 'Create & Open Studio' : 'Create Content'}</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Version History Modal */}
            {isHistoryModalOpen && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white rounded-3xl p-8 w-full max-w-2xl shadow-2xl max-h-[80vh] flex flex-col">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h3 className="text-lg font-black text-gray-800">Syllabus Version History</h3>
                                <p className="text-sm text-gray-500">Track changes and imports.</p>
                            </div>
                            <button onClick={() => setIsHistoryModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                                <Trash2 className="w-5 h-5 text-gray-400 rotate-45" /> {/* Using Trash icon rotated as Close X for quickness or import X */}
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                            {history.map((ver) => (
                                <div key={ver.version} className="flex gap-4 p-4 border border-gray-100 rounded-xl bg-gray-50 hover:bg-white hover:shadow-md transition-all">
                                    <div className="flex flex-col items-center gap-1 min-w-[60px]">
                                        <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-lg">
                                            v{ver.version}
                                        </div>
                                        <div className="h-full w-px bg-gray-200 my-1"></div>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start mb-1">
                                            <h4 className="font-bold text-gray-800">{ver.notes}</h4>
                                            <span className="text-xs font-mono text-gray-400 bg-white px-2 py-1 rounded border border-gray-100">
                                                {new Date(ver.date).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-500 mb-3">Changed by <span className="font-semibold text-gray-700">{ver.author}</span> • {new Date(ver.date).toLocaleTimeString()}</p>

                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleRestoreVersion(ver)}
                                                className="px-3 py-1 bg-white border border-gray-200 rounded-lg text-[10px] font-bold uppercase tracking-widest text-indigo-600 hover:border-indigo-300 transition-colors"
                                            >
                                                Restore This Version
                                            </button>
                                            <button
                                                onClick={handleExportExcel}
                                                className="px-3 py-1 bg-white border border-gray-200 rounded-lg text-[10px] font-bold uppercase tracking-widest text-emerald-600 hover:text-emerald-800 hover:border-emerald-200 flex items-center gap-1"
                                            >
                                                <FileSpreadsheet className="w-3 h-3" /> Download Excel
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-end pt-6 border-t border-gray-100 mt-4">
                            <button
                                onClick={() => setIsHistoryModalOpen(false)}
                                className="px-6 py-2 bg-slate-900 text-white text-sm font-bold rounded-xl"
                            >
                                Close History
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
