"use client";

import { MessageSquare, ThumbsUp, Share2, MoreHorizontal, GraduationCap, Send, ShieldCheck, User, Reply, CheckCircle2 } from "lucide-react";
import { useState } from "react";

export default function TutorCommunityPage() {
    // Initial mock posts of students asking the tutor
    const [posts, setPosts] = useState([
        {
            id: 1,
            author: "Gabriel Rodriguez",
            email: "gabriel@inditex.com",
            avatar: "GR",
            time: "10 mins ago",
            content: "Hola! Tengo una duda con el módulo de Estrategia Global. ¿Cómo debería enfocar el análisis de mercado para el caso de Inditex en China? Gracias!",
            topic: "Business Strategy",
            likes: 0,
            comments: 0,
            isTutor: true,
            isAnswered: false,
            company: "Inditex"
        },
        {
            id: 2,
            author: "Alice Thompson",
            email: "alice@santander.com",
            avatar: "AT",
            time: "1 hour ago",
            content: "Could you help me clarify the difference between LTV and CAC in the current marketing project?",
            topic: "Digital Marketing",
            likes: 1,
            comments: 0,
            isTutor: true,
            isAnswered: true,
            company: "Santander"
        },
        {
            id: 3,
            author: "David Chen",
            email: "david@inditex.com",
            avatar: "DC",
            time: "4h ago",
            content: "Does the SWOT analysis have to be in PDF or can I submit a link to a Miro board?",
            topic: "Strategy",
            likes: 0,
            comments: 0,
            isTutor: true,
            isAnswered: false,
            company: "Inditex"
        }
    ]);

    const [replyingTo, setReplyingTo] = useState<number | null>(null);
    const [replyContent, setReplyContent] = useState("");

    const handleReply = (postId: number) => {
        // Mock reply logic
        setPosts(posts.map(post =>
            post.id === postId ? { ...post, isAnswered: true } : post
        ));
        setReplyingTo(null);
        setReplyContent("");
    };

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Student Support Feed</h1>
                <p className="text-slate-500 text-sm mt-1">Respond to direct questions and manage private mentorship requests.</p>
            </div>

            {/* Support Inbox Table/List */}
            <div className="space-y-6">
                {posts.map(post => (
                    <div key={post.id} className={`bg-white p-8 rounded-[2rem] border transition-all shadow-sm flex flex-col md:flex-row gap-8 ${post.isAnswered ? 'border-slate-100 opacity-80' : 'border-[#a1e6c5] shadow-md ring-4 ring-[#a1e6c5]/5'}`}>
                        {/* Student Badge */}
                        <div className="flex flex-col items-center gap-2 shrink-0">
                            <div className="w-16 h-16 rounded-2xl bg-[#1e3740] flex items-center justify-center text-[#a1e6c5] font-black text-xl shadow-inner uppercase">
                                {post.avatar}
                            </div>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{post.company}</span>
                        </div>

                        {/* Content Area */}
                        <div className="flex-1 space-y-4">
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <p className="font-black text-slate-900">{post.author}</p>
                                        <span className="text-xs text-slate-400 font-medium hidden md:block">• {post.email}</span>
                                        {!post.isAnswered && (
                                            <span className="bg-amber-50 text-amber-600 text-[10px] px-2 py-0.5 rounded-lg font-black uppercase tracking-widest border border-amber-100">Pending</span>
                                        )}
                                        {post.isAnswered && (
                                            <span className="bg-emerald-50 text-emerald-600 text-[10px] px-2 py-0.5 rounded-lg font-black uppercase tracking-widest border border-emerald-100">Resolved</span>
                                        )}
                                    </div>
                                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-0.5">{post.topic} • {post.time}</p>
                                </div>
                                <button className="text-slate-300 hover:text-slate-600 transition-colors"><MoreHorizontal className="w-5 h-5" /></button>
                            </div>

                            <p className="text-slate-700 leading-relaxed font-medium bg-slate-50 p-6 rounded-2xl border border-slate-100 italic">
                                "{post.content}"
                            </p>

                            <div className="flex items-center justify-between pt-2">
                                <div className="flex items-center gap-4">
                                    <button className="flex items-center gap-2 text-xs font-black text-slate-400 hover:text-slate-900 transition-colors">
                                        <ThumbsUp className="w-3.5 h-3.5" /> Useful
                                    </button>
                                    <button className="flex items-center gap-2 text-xs font-black text-slate-400 hover:text-slate-900 transition-colors">
                                        <Share2 className="w-3.5 h-3.5" /> Forward
                                    </button>
                                </div>

                                {replyingTo === post.id ? (
                                    <div className="flex gap-2 w-full max-w-md ml-4">
                                        <input
                                            autoFocus
                                            className="flex-1 bg-slate-50 border-none rounded-xl px-4 py-2 text-sm font-medium outline-none ring-2 ring-transparent focus:ring-[#a1e6c5] transition-all"
                                            placeholder="Write your answer..."
                                            value={replyContent}
                                            onChange={(e) => setReplyContent(e.target.value)}
                                        />
                                        <button
                                            onClick={() => handleReply(post.id)}
                                            className="p-2 bg-[#1e3740] text-white rounded-xl shadow-lg hover:bg-[#2c4d59] transition-all active:scale-90"
                                        >
                                            <Send className="w-5 h-5" />
                                        </button>
                                        <button onClick={() => setReplyingTo(null)} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => setReplyingTo(post.id)}
                                        className={`flex items-center gap-2 px-6 py-2 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-sm active:scale-95 ${post.isAnswered ? 'bg-slate-100 text-slate-400 cursor-default' : 'bg-[#a1e6c5] text-[#1e3740] hover:bg-[#8fd9b6]'
                                            }`}
                                    >
                                        {post.isAnswered ? (
                                            <><CheckCircle2 className="w-4 h-4" /> Message Answered</>
                                        ) : (
                                            <><Reply className="w-4 h-4" /> Reply to Student</>
                                        )}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}

                {posts.length === 0 && (
                    <div className="text-center py-20 bg-white rounded-[2.5rem] border border-slate-100">
                        <GraduationCap className="w-16 h-16 text-slate-100 mx-auto mb-6" />
                        <h3 className="text-xl font-black text-slate-900">All clear, Professor!</h3>
                        <p className="text-slate-400 text-sm mt-2">No pending questions from your students at the moment.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

function X({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
        </svg>
    )
}
