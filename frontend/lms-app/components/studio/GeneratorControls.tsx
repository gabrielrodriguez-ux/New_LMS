"use client";

import { useState } from 'react';
import { Mic, Video, FileText, Sparkles, Play, Download, Save, Loader2, Wand2 } from 'lucide-react';

interface GeneratedContent {
    type: 'podcast' | 'video' | 'summary';
    url: string;
    title: string;
    duration?: string;
}

export default function GeneratorControls() {
    const [selectedMode, setSelectedMode] = useState<'podcast' | 'video' | 'summary'>('podcast');
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);

    const handleGenerate = () => {
        setIsGenerating(true);
        // Mock generation delay
        setTimeout(() => {
            setIsGenerating(false);
            setGeneratedContent({
                type: selectedMode,
                url: '#',
                title: `${selectedMode === 'podcast' ? 'Deep Dive' : selectedMode === 'video' ? 'Visual Explanation' : 'Key Concepts'} - Business Strategy`,
                duration: selectedMode === 'summary' ? undefined : '12:45'
            });
        }, 3000);
    };

    return (
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm h-full flex flex-col overflow-hidden">
            {/* Controls Header */}
            <div className="p-6 border-b border-slate-50">
                <div className="flex bg-slate-100/50 p-1.5 rounded-2xl mb-6">
                    <button
                        onClick={() => setSelectedMode('podcast')}
                        className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${selectedMode === 'podcast'
                                ? 'bg-white text-primary shadow-sm ring-1 ring-slate-200'
                                : 'text-slate-400 hover:bg-white/50'
                            }`}
                    >
                        <Mic className="w-4 h-4" /> Podcast
                    </button>
                    <button
                        onClick={() => setSelectedMode('video')}
                        className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${selectedMode === 'video'
                                ? 'bg-white text-sky-600 shadow-sm ring-1 ring-slate-200'
                                : 'text-slate-400 hover:bg-white/50'
                            }`}
                    >
                        <Video className="w-4 h-4" /> Video
                    </button>
                    <button
                        onClick={() => setSelectedMode('summary')}
                        className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${selectedMode === 'summary'
                                ? 'bg-white text-emerald-600 shadow-sm ring-1 ring-slate-200'
                                : 'text-slate-400 hover:bg-white/50'
                            }`}
                    >
                        <FileText className="w-4 h-4" /> Summary
                    </button>
                </div>

                <div className="bg-slate-50 rounded-2xl p-6 mb-6">
                    <h4 className="text-sm font-bold text-slate-800 mb-2">Configuration</h4>
                    <div className="space-y-4">
                        {selectedMode === 'podcast' && (
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Host Personalities</label>
                                <div className="flex gap-2">
                                    <span className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600">Sarah (Expert)</span>
                                    <span className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600">Mike (Curious)</span>
                                </div>
                            </div>
                        )}
                        {selectedMode === 'video' && (
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Visual Style</label>
                                <select className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-600 outline-none">
                                    <option>Professional Presentation</option>
                                    <option>Whiteboard Animation</option>
                                    <option>Data Visualization</option>
                                </select>
                            </div>
                        )}
                    </div>
                </div>

                <button
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="w-full py-4 bg-slate-900 text-white rounded-2xl flex items-center justify-center gap-2 transition-all hover:bg-slate-800 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed shadow-xl shadow-slate-900/10"
                >
                    {isGenerating ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span className="text-sm font-black tracking-wide">Synthesizing...</span>
                        </>
                    ) : (
                        <>
                            <Sparkles className="w-5 h-5" />
                            <span className="text-sm font-black tracking-wide uppercase">Generate {selectedMode}</span>
                        </>
                    )}
                </button>
            </div>

            {/* Results Canvas */}
            <div className="flex-1 bg-slate-50/50 p-8 flex items-center justify-center relative overflow-hidden">
                {!generatedContent && !isGenerating && (
                    <div className="text-center opacity-40">
                        <Wand2 className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                        <p className="text-sm font-bold text-slate-400">Ready to create magic</p>
                    </div>
                )}

                {generatedContent && !isGenerating && (
                    <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-xl border border-slate-100 animate-in zoom-in-95 duration-500">
                        {/* Preview Header */}
                        <div className="flex items-center gap-4 mb-6">
                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg ${generatedContent.type === 'podcast' ? 'bg-primary text-white' :
                                    generatedContent.type === 'video' ? 'bg-sky-500 text-white' : 'bg-emerald-500 text-white'
                                }`}>
                                {generatedContent.type === 'podcast' ? <Mic className="w-8 h-8" /> :
                                    generatedContent.type === 'video' ? <Video className="w-8 h-8" /> : <FileText className="w-8 h-8" />}
                            </div>
                            <div>
                                <h3 className="font-black text-slate-800 text-lg leading-tight">{generatedContent.title}</h3>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-[10px] font-black bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full uppercase tracking-widest">
                                        Generated by AI
                                    </span>
                                    {generatedContent.duration && (
                                        <span className="text-xs font-bold text-slate-400">{generatedContent.duration}</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Player / Content Placeholder */}
                        <div className="bg-slate-900 rounded-2xl h-32 flex items-center justify-center mb-6 relative overflow-hidden group cursor-pointer">
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 opacity-20"></div>
                            {/* Audio Wave / Video Placeholder */}
                            <div className="flex items-end gap-1 h-8">
                                <div className="w-1 bg-white/50 h-4 animate-[pulse_1s_ease-in-out_infinite]"></div>
                                <div className="w-1 bg-white/50 h-8 animate-[pulse_1.5s_ease-in-out_infinite]"></div>
                                <div className="w-1 bg-white/50 h-6 animate-[pulse_1.2s_ease-in-out_infinite]"></div>
                                <div className="w-1 bg-white/50 h-3 animate-[pulse_0.8s_ease-in-out_infinite]"></div>
                            </div>
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                                    <Play className="w-5 h-5 text-slate-900 ml-1" />
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="grid grid-cols-2 gap-3">
                            <button className="py-3 bg-slate-100 text-slate-600 font-bold rounded-xl text-xs flex items-center justify-center gap-2 hover:bg-slate-200 transition-colors">
                                <Download className="w-4 h-4" /> Download
                            </button>
                            <button className="py-3 bg-emerald-50 text-emerald-600 font-bold rounded-xl text-xs flex items-center justify-center gap-2 hover:bg-emerald-100 transition-colors border border-emerald-100">
                                <Save className="w-4 h-4" /> Save to Course
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
