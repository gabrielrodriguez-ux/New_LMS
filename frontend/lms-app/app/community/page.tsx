"use client";

import Navbar from "@/components/Navbar";
import { MessageSquare, ThumbsUp, Share2, MoreHorizontal, GraduationCap, Send, ShieldCheck, User, Pin, Loader2 } from "lucide-react";
import { useState } from "react";

export default function CommunityPage() {
    const [selectedFilter, setSelectedFilter] = useState("All Posts");
    const [isTutorSelected, setIsTutorSelected] = useState(false);
    const [postContent, setPostContent] = useState("");
    const [isPosting, setIsPosting] = useState(false);

    // Initial mock posts
    const [posts, setPosts] = useState([
        {
            id: 1,
            author: "Sarah Jenkins",
            avatar: "SJ",
            time: "2h ago",
            content: "Just finished the Market Analysis module in Business Strategy! The insights on segmentation were mind-blowing. 🤯 Anyone else working on the case study?",
            topic: "Business Strategy",
            likes: 24,
            comments: 5,
            isTutor: false
        },
        {
            id: 2,
            author: "David Chen",
            avatar: "DC",
            time: "4h ago",
            content: "Found this great article on AI in Marketing. Highly recommend reading it before starting Module 3. [Link]",
            topic: "Digital Marketing",
            likes: 12,
            comments: 2,
            isTutor: false
        },
        {
            id: 3,
            author: "Professor Williams",
            avatar: "PW",
            role: "Instructor",
            time: "1d ago",
            content: "📢 Reminder: Live Q&A session tomorrow at 18:00 CET. Bring your questions about the final project!",
            topic: "Announcements",
            likes: 85,
            comments: 12,
            isPinned: true,
            isTutor: false
        }
    ]);

    const handlePost = async () => {
        if (!postContent.trim() || isPosting) return;

        setIsPosting(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));

        const newPost = {
            id: Date.now(),
            author: "Gabriel R.",
            avatar: "GR",
            time: "Just now",
            content: postContent,
            topic: isTutorSelected ? "Tutor Assistance" : "General",
            likes: 0,
            comments: 0,
            isTutor: isTutorSelected
        };

        setPosts([newPost, ...posts]);
        setPostContent("");
        setIsTutorSelected(false);
        setIsPosting(false);

        // If we were filtering for something else, switch to All Posts to see the new post
        // OR switch to Tutor filter if we just sent a tutor message
        if (isTutorSelected) {
            setSelectedFilter("Tutor");
        } else {
            setSelectedFilter("All Posts");
        }
    };

    // Filtering logic
    const filteredPosts = posts.filter(post => {
        if (selectedFilter === "All Posts") return true;
        if (selectedFilter === "Tutor") return post.isTutor === true;
        if (selectedFilter === "Announcements") return post.topic === "Announcements";
        if (selectedFilter === "Q&A") return post.topic === "Q&A" || post.isTutor;
        // Basic match for other topics
        return post.topic === selectedFilter;
    });

    return (
        <div className="min-h-screen bg-surface-muted">
            <Navbar />

            <main className="max-w-3xl mx-auto p-4 sm:p-6 md:p-8">
                <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">Community Feed</h1>

                {/* Create Post */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8 transition-all focus-within:ring-2 focus-within:ring-secondary/20">
                    <div className="flex gap-4">
                        <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center text-primary font-bold shrink-0">GR</div>
                        <div className="flex-1">
                            <textarea
                                className="w-full bg-gray-50 rounded-xl p-4 border-none focus:bg-white focus:ring-0 transition-all resize-none text-sm"
                                placeholder={isTutorSelected ? "Write a private message to your tutor..." : "Share your thoughts or ask a question..."}
                                rows={3}
                                value={postContent}
                                onChange={(e) => setPostContent(e.target.value)}
                            ></textarea>
                            <div className="flex justify-between items-center mt-4">
                                <div className="flex gap-2 items-center">
                                    <button className="text-[10px] font-bold bg-gray-100 text-gray-400 px-3 py-1.5 rounded-lg hover:bg-gray-200 uppercase tracking-widest transition-colors">Add Topic</button>
                                    <button
                                        onClick={() => setIsTutorSelected(!isTutorSelected)}
                                        className={`text-[10px] font-bold px-3 py-1.5 rounded-lg uppercase tracking-widest transition-all flex items-center gap-1.5 border ${isTutorSelected
                                            ? "bg-indigo-50 text-indigo-600 border-indigo-100"
                                            : "bg-gray-50 text-gray-400 border-gray-100 hover:border-gray-200"
                                            }`}
                                    >
                                        <GraduationCap className={`w-3.5 h-3.5 ${isTutorSelected ? "text-indigo-600" : "text-gray-400"}`} />
                                        Send to Tutor
                                        {isTutorSelected && <ShieldCheck className="w-3.5 h-3.5" />}
                                    </button>
                                </div>
                                <button
                                    onClick={handlePost}
                                    disabled={!postContent.trim() || isPosting}
                                    className={`px-4 sm:px-6 py-2 rounded-xl font-bold text-sm transition-all flex items-center gap-2 min-w-[80px] justify-center ${postContent.trim() && !isPosting ? "bg-primary text-white hover:bg-primary-light shadow-md" : "bg-gray-100 text-gray-300 cursor-not-allowed"
                                        }`}
                                >
                                    {isPosting ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <><Send className="w-4 h-4" /> <span className="hidden sm:inline">Post</span></>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex gap-3 mb-8 overflow-x-auto pb-2 no-scrollbar">
                    {["All Posts", "My Course", "Announcements", "Q&A"].map((filter) => (
                        <button
                            key={filter}
                            onClick={() => setSelectedFilter(filter)}
                            className={`px-5 py-2.5 text-xs font-bold rounded-full transition-all border whitespace-nowrap ${selectedFilter === filter
                                ? "bg-primary text-white border-primary shadow-md translate-y-[-1px]"
                                : "bg-white text-gray-500 border-gray-100 hover:border-gray-300"
                                }`}
                        >
                            {filter}
                        </button>
                    ))}
                    <button
                        onClick={() => setSelectedFilter("Tutor")}
                        className={`px-5 py-2.5 text-xs font-bold rounded-full transition-all border whitespace-nowrap flex items-center gap-2 ${selectedFilter === "Tutor"
                            ? "bg-indigo-600 text-white border-indigo-600 shadow-md translate-y-[-1px]"
                            : "bg-indigo-50 text-indigo-500 border-indigo-100 hover:bg-indigo-100"
                            }`}
                    >
                        <GraduationCap className="w-4 h-4" /> Tutor Questions
                    </button>
                </div>

                {/* Feed */}
                <div className="space-y-6">
                    {filteredPosts.length > 0 ? filteredPosts.map(post => (
                        <div key={post.id} className={`bg-white p-6 rounded-xl shadow-sm border transition-all ${post.isTutor ? 'border-indigo-100 bg-indigo-50/10' : 'border-gray-100'}`}>
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${post.isTutor ? 'bg-indigo-600 text-white' :
                                        post.role === 'Instructor' ? 'bg-primary text-white' :
                                            'bg-gray-200 text-gray-600'
                                        }`}>
                                        {post.avatar}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <p className="font-bold text-gray-900">{post.author}</p>
                                            {post.isTutor && (
                                                <span className="bg-indigo-100 text-indigo-700 text-[10px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest flex items-center gap-1">
                                                    <GraduationCap className="w-3 h-3" /> Private to Tutor
                                                </span>
                                            )}
                                            {post.role && <span className="bg-blue-100 text-blue-700 text-[10px] px-1.5 py-0.5 rounded font-bold uppercase">{post.role}</span>}
                                            {post.isPinned && <Pin className="w-4 h-4 text-gray-400 rotate-45" />}
                                        </div>
                                        <p className="text-xs text-gray-500">{post.time} • {post.topic}</p>
                                    </div>
                                </div>
                                <button className="text-gray-400 hover:text-gray-600 transition-colors"><MoreHorizontal className="w-5 h-5" /></button>
                            </div>

                            <p className="text-gray-800 mb-4 whitespace-pre-wrap leading-relaxed">{post.content}</p>

                            <div className="flex items-center gap-6 border-t border-gray-50 pt-4">
                                <button className="flex items-center gap-2 text-sm text-gray-500 hover:text-secondary-dark transition-colors">
                                    <ThumbsUp className="w-4 h-4" /> {post.likes}
                                </button>
                                <button className="flex items-center gap-2 text-sm text-gray-500 hover:text-secondary-dark transition-colors">
                                    <MessageSquare className="w-4 h-4" /> {post.comments}
                                </button>
                                <button className="flex items-center gap-2 text-sm text-gray-500 hover:text-secondary-dark transition-colors ml-auto">
                                    <Share2 className="w-4 h-4" /> Share
                                </button>
                            </div>
                        </div>
                    )) : (
                        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
                            <MessageSquare className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                            <p className="text-gray-400 font-medium">No posts found in this category.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
