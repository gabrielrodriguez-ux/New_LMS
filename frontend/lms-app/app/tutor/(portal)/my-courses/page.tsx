"use client";

import { useState } from "react";
import { BookOpen, Users, Clock, ArrowRight, Building2, PlayCircle, FileText, ChevronRight, Send, X } from "lucide-react";
import Link from "next/link";

const ASSIGNED_COURSES = [
    {
        id: "c1",
        title: "ThePowerMBA: Global Strategy",
        company: "Inditex",
        clientLogo: "I",
        studentsCount: 120,
        avgProgress: 78,
        nextSession: "Tomorrow, 18:00",
        lessonsCount: 42,
        color: "bg-black",
        sections: [
            { title: "Module 1: Business Fundamentals", lessons: 8 },
            { title: "Module 2: Competitive Strategy", lessons: 12 },
            { title: "Module 3: Global Expansion", lessons: 22 }
        ]
    },
    {
        id: "c2",
        title: "Digital Marketing Rockstars",
        company: "Santander",
        clientLogo: "S",
        studentsCount: 85,
        avgProgress: 42,
        nextSession: "Feb 12, 17:00",
        lessonsCount: 30,
        color: "bg-red-600",
        sections: [
            { title: "SEO Foundations", lessons: 10 },
            { title: "Growth Hacking", lessons: 15 },
            { title: "Paid Media Strategy", lessons: 5 }
        ]
    }
];

export default function TutorMyCoursesPage() {
    const [messageModal, setMessageModal] = useState<{ isOpen: boolean; courseId: string | null; courseTitle: string }>({
        isOpen: false,
        courseId: null,
        courseTitle: ""
    });
    const [messageSubject, setMessageSubject] = useState("");
    const [messageBody, setMessageBody] = useState("");
    const [isSending, setIsSending] = useState(false);

    const handleSendMessage = async () => {
        if (!messageSubject.trim() || !messageBody.trim()) {
            alert("Please fill in both subject and message");
            return;
        }

        setIsSending(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        alert(`Message sent to all ${ASSIGNED_COURSES.find(c => c.id === messageModal.courseId)?.studentsCount || 0} students!`);

        setMessageModal({ isOpen: false, courseId: null, courseTitle: "" });
        setMessageSubject("");
        setMessageBody("");
        setIsSending(false);
    };

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Assigned Classrooms</h1>
                    <p className="text-slate-500 text-sm mt-1">Manage your student cohorts and monitor content delivery.</p>
                </div>
                <div className="flex items-center gap-3 bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
                    <div className="flex -space-x-3 ml-2">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white shadow-sm flex items-center justify-center text-[10px] font-bold">U{i}</div>
                        ))}
                    </div>
                    <span className="text-xs font-bold text-slate-400 px-3 border-l border-slate-100 ml-2">205 Students Active</span>
                </div>
            </div>

            {/* Tutor Insights Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[#1e3740] rounded-[2rem] p-8 text-white shadow-xl relative overflow-hidden group">
                    <div className="relative z-10 flex flex-col h-full justify-between">
                        <div className="flex justify-between items-start">
                            <p className="text-[10px] font-black text-[#a1e6c5] uppercase tracking-widest">Avg. Response Time</p>
                            <div className="p-2 bg-white/10 rounded-xl"><Clock className="w-4 h-4 text-[#a1e6c5]" /></div>
                        </div>
                        <div className="mt-4">
                            <p className="text-4xl font-black italic">1.4h</p>
                            <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase">⚡ Faster than 85% of tutors</p>
                        </div>
                    </div>
                    <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-[#a1e6c5] opacity-5 rounded-full blur-3xl"></div>
                </div>

                <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Questions Status</p>
                    <div className="space-y-4">
                        <div className="flex justify-between items-end">
                            <span className="text-xs font-bold text-slate-600">Pending Response</span>
                            <span className="text-lg font-black text-amber-500">12</span>
                        </div>
                        <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden">
                            <div className="h-full bg-amber-500 rounded-full" style={{ width: '30%' }}></div>
                        </div>
                        <div className="flex justify-between items-end">
                            <span className="text-xs font-bold text-slate-600">Resolved Total</span>
                            <span className="text-lg font-black text-emerald-500">452</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm flex flex-col">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Users className="w-3 h-3" /> Most Active Seekers
                    </p>
                    <div className="space-y-4 flex-1">
                        {[
                            { name: "Gabriel R.", questions: 12, company: "Inditex" },
                            { name: "Alice T.", questions: 8, company: "Santander" },
                            { name: "Bob W.", questions: 5, company: "Acme" }
                        ].map((student, i) => (
                            <div key={i} className="flex items-center justify-between group cursor-pointer">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-[10px] font-black text-slate-400 border border-slate-100 group-hover:bg-[#a1e6c5] group-hover:text-[#1e3740] transition-colors">{student.name[0]}</div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-800">{student.name}</p>
                                        <p className="text-[9px] text-slate-400 font-medium">{student.company}</p>
                                    </div>
                                </div>
                                <span className="text-[10px] font-black text-slate-900 bg-slate-50 px-2 py-1 rounded-lg">{student.questions} q.</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {ASSIGNED_COURSES.map((course) => (
                    <div key={course.id} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col group hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500">
                        {/* Course Header with Branding */}
                        <div className="p-8 border-b border-slate-50 relative overflow-hidden">
                            <div className="flex justify-between items-start relative z-10">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 ${course.color} rounded-xl shadow-lg flex items-center justify-center text-white font-black`}>
                                            {course.clientLogo}
                                        </div>
                                        <div>
                                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{course.company}</p>
                                            <h3 className="text-xl font-black text-slate-900 leading-tight">{course.title}</h3>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                                            <Users className="w-3.5 h-3.5 text-slate-400" /> {course.studentsCount} Students
                                        </div>
                                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                                            <Clock className="w-3.5 h-3.5 text-slate-400" /> Next Q&A: {course.nextSession}
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Cohort Progress</p>
                                    <p className="text-2xl font-black text-slate-900">{course.avgProgress}%</p>
                                </div>
                            </div>
                            <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50/50 rounded-full blur-3xl -mr-16 -mt-16"></div>
                        </div>

                        {/* Sections & Classrooms */}
                        <div className="p-8 flex-1 space-y-6">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Curriculum & Access</h4>
                            <div className="space-y-3">
                                {course.sections.map((section, idx) => (
                                    <div
                                        key={idx}
                                        className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors cursor-pointer group/item"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-8 h-8 bg-white border border-slate-200 rounded-lg flex items-center justify-center shadow-sm">
                                                <PlayCircle className="w-4 h-4 text-slate-400 group-hover/item:text-primary transition-colors" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-800">{section.title}</p>
                                                <p className="text-[10px] text-slate-400 font-bold">{section.lessons} Lessons • Online Delivery</p>
                                            </div>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-slate-200 group-hover/item:text-slate-400 transition-all" />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="p-8 pt-0 mt-auto space-y-3">
                            <button
                                onClick={() => setMessageModal({
                                    isOpen: true,
                                    courseId: course.id,
                                    courseTitle: course.title
                                })}
                                className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/10 active:scale-[0.98] cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                aria-label={`Send bulk message to ${course.title} students`}
                            >
                                <Send className="w-4 h-4" />
                                Send Message to All Students ({course.studentsCount})
                            </button>
                            <Link
                                href={`/tutor/my-courses/${course.id}`}
                                className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 active:scale-[0.98] cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-700"
                                aria-label={`Enter private classroom for ${course.title}`}
                            >
                                Enter Private Classroom <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                ))}

                {/* Placeholder for new courses */}
                <div className="bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center p-12 text-center group cursor-pointer hover:bg-slate-100 transition-colors">
                    <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-slate-300 group-hover:scale-110 transition-transform mb-6">
                        <PlusSquare className="w-8 h-8" />
                    </div>
                    <h3 className="font-bold text-slate-400">Request Access</h3>
                    <p className="text-xs text-slate-400 mt-1 max-w-[200px]">Unlock new programs for your assigned cohorts.</p>
                </div>
            </div>

            {/* Message Modal */}
            {
                messageModal.isOpen && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                        <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
                            {/* Modal Header */}
                            <div className="border-b border-slate-100 p-6 flex justify-between items-start">
                                <div>
                                    <h2 className="text-2xl font-black text-slate-900">Send Bulk Message</h2>
                                    <p className="text-sm text-slate-500 mt-1">
                                        {messageModal.courseTitle} • {ASSIGNED_COURSES.find(c => c.id === messageModal.courseId)?.studentsCount || 0} students will receive this
                                    </p>
                                </div>
                                <button
                                    onClick={() => setMessageModal({ isOpen: false, courseId: null, courseTitle: "" })}
                                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-slate-300"
                                    aria-label="Close message modal"
                                >
                                    <X className="w-5 h-5 text-slate-400" />
                                </button>
                            </div>

                            {/* Modal Body */}
                            <div className="p-6 space-y-4 overflow-y-auto max-h-[60vh]">
                                <div>
                                    <label htmlFor="message-subject" className="block text-sm font-bold text-slate-700 mb-2">Subject *</label>
                                    <input
                                        id="message-subject"
                                        type="text"
                                        value={messageSubject}
                                        onChange={(e) => setMessageSubject(e.target.value)}
                                        placeholder="e.g., Important Update: Week 3 Assignment"
                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="message-body" className="block text-sm font-bold text-slate-700 mb-2">Message *</label>
                                    <textarea
                                        id="message-body"
                                        value={messageBody}
                                        onChange={(e) => setMessageBody(e.target.value)}
                                        placeholder="Write your message here...\n\nThis will be sent to all enrolled students in this course."
                                        rows={10}
                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                                    />
                                </div>

                                <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
                                    <div className="flex gap-3">
                                        <div className="w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center text-white text-xs font-black shrink-0 mt-0.5">!</div>
                                        <div>
                                            <p className="text-xs font-bold text-amber-900 mb-1">Important Notice</p>
                                            <p className="text-xs text-amber-700">
                                                This message will be delivered via email and LMS notification to all {ASSIGNED_COURSES.find(c => c.id === messageModal.courseId)?.studentsCount || 0} students immediately.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="border-t border-slate-100 p-6 flex justify-end gap-3">
                                <button
                                    onClick={() => setMessageModal({ isOpen: false, courseId: null, courseTitle: "" })}
                                    className="px-6 py-3 border border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-50 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-slate-300"
                                    disabled={isSending}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSendMessage}
                                    disabled={isSending || !messageSubject.trim() || !messageBody.trim()}
                                    className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    {isSending ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            <Send className="w-4 h-4" />
                                            Send to All Students
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
}

function PlusSquare({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <rect width="18" height="18" x="3" y="3" rx="2" />
            <path d="M8 12h8" />
            <path d="M12 8v8" />
        </svg>
    )
}
