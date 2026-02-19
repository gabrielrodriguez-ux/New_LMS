"use client";

import { useState } from 'react';
import { Upload, FileText, Trash2, CheckCircle2, Loader2, Music, Video, File } from 'lucide-react';

interface Source {
    id: string;
    name: string;
    type: 'pdf' | 'doc' | 'txt' | 'audio';
    size: string;
    uploadDate: Date;
    status: 'processing' | 'ready' | 'error';
}

export default function SourceManager() {
    const [isDragging, setIsDragging] = useState(false);
    const [sources, setSources] = useState<Source[]>([
        {
            id: '1',
            name: 'Business_Strategy_Syllabus.pdf',
            type: 'pdf',
            size: '2.4 MB',
            uploadDate: new Date(),
            status: 'ready'
        },
        {
            id: '2',
            name: 'Lecture_Notes_Week1.txt',
            type: 'txt',
            size: '15 KB',
            uploadDate: new Date(),
            status: 'ready'
        }
    ]);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        // Mock upload handling
        const files = Array.from(e.dataTransfer.files);
        if (files.length > 0) {
            const newSource: Source = {
                id: Math.random().toString(36).substr(2, 9),
                name: files[0].name,
                type: 'pdf', // Mock type
                size: (files[0].size / 1024 / 1024).toFixed(2) + ' MB',
                uploadDate: new Date(),
                status: 'processing'
            };
            setSources([newSource, ...sources]);

            // Simulate processing
            setTimeout(() => {
                setSources(prev => prev.map(s => s.id === newSource.id ? { ...s, status: 'ready' } : s));
            }, 2000);
        }
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'pdf': return <FileText className="w-5 h-5 text-rose-500" />;
            case 'audio': return <Music className="w-5 h-5 text-purple-500" />;
            case 'video': return <Video className="w-5 h-5 text-sky-500" />;
            default: return <File className="w-5 h-5 text-slate-400" />;
        }
    };

    return (
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm h-full flex flex-col overflow-hidden">
            <div className="p-6 border-b border-slate-50 bg-slate-50/30">
                <h3 className="text-lg font-black text-slate-800">Knowledge Sources</h3>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
                    Upload materials to train the AI
                </p>
            </div>

            <div className="flex-1 p-6 overflow-y-auto custom-scrollbar space-y-4">
                {/* Upload Zone */}
                <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`border-3 border-dashed rounded-3xl p-8 flex flex-col items-center justify-center text-center transition-all ${isDragging
                            ? 'border-primary bg-primary/5 scale-[1.02]'
                            : 'border-slate-200 hover:border-primary/50 hover:bg-slate-50'
                        }`}
                >
                    <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-3">
                        <Upload className={`w-6 h-6 ${isDragging ? 'text-primary' : 'text-slate-400'}`} />
                    </div>
                    <p className="text-xs font-bold text-slate-600">Drag & Drop files here</p>
                    <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest">PDF, DOCX, TXT, MP3</p>
                </div>

                {/* File List */}
                <div className="space-y-3">
                    {sources.map(source => (
                        <div key={source.id} className="group flex items-center gap-4 p-4 bg-white border border-slate-100 rounded-2xl hover:shadow-md hover:border-slate-200 transition-all">
                            <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center shrink-0">
                                {getIcon(source.type)}
                            </div>

                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold text-slate-700 truncate">{source.name}</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{source.size}</span>
                                    {source.status === 'processing' && (
                                        <span className="flex items-center gap-1 text-[9px] font-bold text-amber-500">
                                            <Loader2 className="w-3 h-3 animate-spin" /> Processing
                                        </span>
                                    )}
                                    {source.status === 'ready' && (
                                        <span className="flex items-center gap-1 text-[9px] font-bold text-emerald-500">
                                            <CheckCircle2 className="w-3 h-3" /> Ready
                                        </span>
                                    )}
                                </div>
                            </div>

                            <button className="p-2 hover:bg-rose-50 rounded-xl group-hover:opacity-100 opacity-0 transition-all">
                                <Trash2 className="w-4 h-4 text-rose-500" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
