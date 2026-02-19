"use client";

import { useState, useEffect } from "react";
import { MessageSquare, ThumbsUp, Reply, MoreVertical } from "lucide-react";
import { apiClient } from "@/utils/api-client";

interface Comment {
    id: string;
    user: string;
    avatar: string;
    time: string;
    content: string;
    likes: number;
    replies?: Comment[];
    isTutor?: boolean;
}

const MOCK_COMMENTS: Comment[] = [
    {
        id: "1",
        user: "Alice Engineer",
        avatar: "AE",
        time: "2 days ago",
        content: "The explanation of the 4 Ps was crystal clear. Can we get more examples of 'Place' in digital products?",
        likes: 12,
        replies: [
            { id: "1-1", user: "Tutor Sarah", avatar: "TS", time: "1 day ago", content: "Great question Alice! In digital, 'Place' usually refers to the platform availability (App Store, SaaS Web, etc).", likes: 5, isTutor: true }
        ]
    },
    {
        id: "2",
        user: "Bob Manager",
        avatar: "BM",
        time: "3 days ago",
        content: "I totally missed the quiz deadline, is there any way to retake it? The content this week was heavy.",
        likes: 2
    }
];

export default function DiscussionTab({ courseId }: { courseId: string }) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState("");
    const [isPosting, setIsPosting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchComments = async () => {
            setIsLoading(true);
            const data = await apiClient.get('COMMENT', `/api/comments?courseId=${courseId}`);
            if (data && Array.isArray(data)) {
                // Nest comments
                const rootComments = data.filter(c => !c.parentId);
                const structuredComments = rootComments.map(rc => ({
                    ...rc,
                    user: "User " + rc.userId.substring(0, 4),
                    avatar: "U",
                    time: new Date(rc.createdAt).toLocaleDateString(),
                    replies: data.filter(c => c.parentId === rc.id).map(r => ({
                        ...r,
                        user: "User " + r.userId.substring(0, 4),
                        avatar: "U",
                        time: new Date(r.createdAt).toLocaleDateString(),
                    }))
                }));
                setComments(structuredComments);
            } else {
                setComments(MOCK_COMMENTS);
            }
            setIsLoading(false);
        };

        fetchComments();
    }, [courseId]);

    const handlePostComment = async () => {
        if (!newComment.trim()) return;

        setIsPosting(true);

        const response = await apiClient.post('COMMENT', '/api/comments', {
            courseId,
            content: newComment,
            userId: '00000000-0000-0000-0000-000000000000' // Mock user
        });

        if (response) {
            const formattedComment: Comment = {
                ...response,
                user: "Gabriel Rodriguez",
                avatar: "GR",
                time: "Just now",
                likes: 0
            };
            setComments([formattedComment, ...comments]);
            setNewComment("");
        }
        setIsPosting(false);
    };

    return (
        <div className="max-w-3xl animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* Comment Input */}
            <div className="flex gap-4 mb-10">
                <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold shrink-0 shadow-md">
                    GR
                </div>
                <div className="flex-1">
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Join the discussion or ask a question..."
                        className="w-full border-b border-gray-300 focus:border-primary outline-none pb-2 bg-transparent text-sm min-h-[40px] resize-none transition-colors"
                    />
                    <div className="flex justify-end mt-3 gap-3">
                        <button
                            onClick={() => setNewComment("")}
                            className="px-5 py-2 text-sm font-semibold text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handlePostComment}
                            disabled={!newComment.trim() || isPosting}
                            className={`px-6 py-2 text-sm font-bold rounded-full transition-all ${!newComment.trim() || isPosting
                                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                : "bg-primary text-white hover:bg-primary-light shadow-md active:scale-95"
                                }`}
                        >
                            {isPosting ? "Posting..." : "Post Comment"}
                        </button>
                    </div>
                </div>
            </div>

            {/* Comments List */}
            <div className="space-y-8">
                {comments.map((comment) => (
                    <div key={comment.id} className="flex gap-4 group">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs shrink-0 shadow-sm ${comment.avatar === 'TS' ? 'bg-secondary text-primary' : 'bg-gray-200 text-gray-600'}`}>
                            {comment.avatar}
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center gap-2">
                                    <span className={`font-bold text-sm ${comment.isTutor ? 'text-primary' : 'text-gray-900'}`}>
                                        {comment.user}
                                        {comment.isTutor && (
                                            <span className="ml-2 text-[10px] bg-secondary/30 px-1.5 py-0.5 rounded text-primary-dark uppercase tracking-wider">Tutor</span>
                                        )}
                                    </span>
                                    <span className="text-xs text-gray-500">{comment.time}</span>
                                </div>
                                <button className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-gray-600 transition-opacity">
                                    <MoreVertical className="w-4 h-4" />
                                </button>
                            </div>
                            <p className="text-sm text-gray-800 mb-3 leading-relaxed">{comment.content}</p>

                            {/* Actions */}
                            <div className="flex items-center gap-6 text-xs font-bold text-gray-500">
                                <button className="hover:text-primary flex items-center gap-1.5 transition-colors">
                                    <ThumbsUp className="w-4 h-4" /> {comment.likes > 0 ? comment.likes : ""}
                                </button>
                                <button className="hover:text-primary flex items-center gap-1.5 transition-colors">
                                    <Reply className="w-4 h-4" /> Reply
                                </button>
                            </div>

                            {/* Replies */}
                            {comment.replies && (
                                <div className="mt-4 space-y-4 border-l-2 border-gray-100 ml-2 pl-6">
                                    {comment.replies.map((reply) => (
                                        <div key={reply.id} className="flex gap-3">
                                            <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0 shadow-sm ${reply.isTutor ? 'bg-secondary text-primary' : 'bg-gray-200 text-gray-600'}`}>
                                                {reply.avatar}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className={`font-bold text-xs ${reply.isTutor ? 'text-primary' : 'text-gray-900'}`}>
                                                        {reply.user}
                                                        {reply.isTutor && (
                                                            <span className="ml-2 text-[9px] bg-secondary/30 px-1.5 py-0.5 rounded text-primary-dark uppercase">Tutor</span>
                                                        )}
                                                    </span>
                                                    <span className="text-[10px] text-gray-500">{reply.time}</span>
                                                </div>
                                                <p className="text-sm text-gray-700 mt-1 leading-relaxed">{reply.content}</p>
                                                <div className="flex items-center gap-4 mt-2 text-[10px] font-bold text-gray-400">
                                                    <button className="hover:text-primary">Like</button>
                                                    <button className="hover:text-primary">Reply</button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
