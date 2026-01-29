"use client";

import {
    Search,
    BookOpen,
    Users,
    Clock,
    BadgeCheck,
    ArrowRight,
    Plus,
    Minus,
    ShoppingCart,
    Info,
    Sparkles,
    Filter
} from "lucide-react";
import { useState } from "react";

const COURSES = [
    {
        id: "c1",
        title: "ThePowerMBA: Business Strategy",
        description: "The global standard for modern business education. Master strategy, marketing, and finance.",
        duration: "40h",
        level: "All Levels",
        pricePerSeat: 499,
        category: "Management",
        image: "bg-blue-600"
    },
    {
        id: "c2",
        title: "Digital Marketing Rockstars",
        description: "Learn growth hacking, SEO, and paid media from the best experts in the industry.",
        duration: "30h",
        level: "Intermediate",
        pricePerSeat: 350,
        category: "Marketing",
        image: "bg-purple-600"
    },
    {
        id: "c3",
        title: "AI for Business Productivity",
        description: "Implement Generative AI tools to automate workflows and boost team performance.",
        duration: "15h",
        level: "Beginner",
        pricePerSeat: 299,
        category: "Technology",
        image: "bg-emerald-600"
    },
    {
        id: "c4",
        title: "Agile Leadership & Scrum",
        description: "Transform your team's productivity with modern management frameworks.",
        duration: "20h",
        level: "Advanced",
        pricePerSeat: 399,
        category: "Product",
        image: "bg-amber-600"
    }
];

export default function CourseCatalogPage() {
    const [selectedCourse, setSelectedCourse] = useState<any>(null);
    const [seats, setSeats] = useState(10);
    const [isAssigned, setIsAssigned] = useState(false);

    const handleAssign = () => {
        setIsAssigned(true);
        setTimeout(() => {
            setIsAssigned(false);
            setSelectedCourse(null);
            setSeats(10);
        }, 3000);
    };

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">Enterprise Catalog</h1>
                    <p className="text-slate-500 text-sm mt-1">Discover and assign premium programs to your workforce.</p>
                </div>
                <div className="relative group w-full lg:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-slate-900 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search courses, skills or certifications..."
                        className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:ring-4 focus:ring-slate-100 transition-all outline-none"
                    />
                </div>
            </div>

            {/* Quick Filters */}
            <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                {["All Programs", "Management", "Marketing", "Technology", "Product", "Soft Skills"].map((cat, i) => (
                    <button
                        key={i}
                        className={`px-5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${i === 0 ? "bg-slate-900 text-white border-slate-900 shadow-md" : "bg-white text-slate-500 border-slate-100 hover:border-slate-300"
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Course Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {COURSES.map((course) => (
                    <div
                        key={course.id}
                        className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col group hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500"
                    >
                        <div className={`h-48 ${course.image} relative overflow-hidden`}>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                            <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-md rounded-lg px-2 py-1 text-[10px] font-black text-white uppercase tracking-widest">
                                {course.category}
                            </div>
                            <Sparkles className="absolute bottom-4 right-4 w-6 h-6 text-white/40" />
                        </div>
                        <div className="p-8 flex-1 flex flex-col">
                            <h3 className="text-lg font-bold text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors">
                                {course.title}
                            </h3>
                            <p className="text-sm text-slate-400 mt-3 line-clamp-2 leading-relaxed">
                                {course.description}
                            </p>

                            <div className="mt-6 flex flex-wrap gap-4 border-t border-slate-50 pt-6">
                                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                    <Clock className="w-3.5 h-3.5" /> {course.duration}
                                </div>
                                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                    <BadgeCheck className="w-3.5 h-3.5" /> {course.level}
                                </div>
                            </div>

                            <div className="mt-8 flex items-center justify-between">
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Price per seat</p>
                                    <p className="text-xl font-black text-slate-900">${course.pricePerSeat}</p>
                                </div>
                                <button
                                    onClick={() => setSelectedCourse(course)}
                                    className="bg-slate-900 text-white p-4 rounded-2xl hover:bg-slate-800 transition-all shadow-lg active:scale-95"
                                >
                                    <Plus className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Allocation Drawer / Modal Simulator */}
            {selectedCourse && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="p-10 space-y-8">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Seat Allocation</h2>
                                    <p className="text-slate-400 text-sm">{selectedCourse.title}</p>
                                </div>
                                <button
                                    onClick={() => setSelectedCourse(null)}
                                    className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                                >
                                    <Minus className="w-6 h-6 text-slate-400" />
                                </button>
                            </div>

                            <div className="bg-slate-50 rounded-3xl p-8 space-y-6">
                                <div className="flex justify-between items-center">
                                    <span className="font-bold text-slate-900">Number of Seats</span>
                                    <div className="flex items-center gap-4 bg-white border border-slate-200 rounded-2xl p-2">
                                        <button
                                            onClick={() => setSeats(Math.max(1, seats - 1))}
                                            className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-50 text-slate-400"
                                        >
                                            <Minus className="w-4 h-4" />
                                        </button>
                                        <span className="text-lg font-black min-w-[30px] text-center">{seats}</span>
                                        <button
                                            onClick={() => setSeats(seats + 1)}
                                            className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-50 text-slate-400"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                                <div className="pt-6 border-t border-slate-200 flex justify-between items-center">
                                    <div>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Projected Total</p>
                                        <p className="text-3xl font-black text-slate-900">${(seats * selectedCourse.pricePerSeat).toLocaleString()}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs font-bold text-emerald-500 uppercase flex items-center gap-1 justify-end">
                                            <Sparkles className="w-3 h-3" /> Volume Discount Applied
                                        </p>
                                        <p className="text-[10px] text-slate-400">-{seats > 50 ? '20%' : '10%'} savings</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Assign to Cohort</label>
                                <select className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-slate-200 transition-all appearance-none cursor-pointer">
                                    <option>Create New Cohort (Q2 2025)</option>
                                    <option>Existing: Sales Team Jan</option>
                                    <option>Existing: High Potentials</option>
                                </select>
                            </div>

                            <button
                                onClick={handleAssign}
                                disabled={isAssigned}
                                className={`w-full py-5 rounded-[2rem] font-black text-lg transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3 ${isAssigned ? 'bg-emerald-500 text-white cursor-default' : 'bg-slate-900 text-white hover:bg-slate-800'
                                    }`}
                            >
                                {isAssigned ? (
                                    <>
                                        <BadgeCheck className="w-6 h-6" /> Assigned Successfully
                                    </>
                                ) : (
                                    <>
                                        <ShoppingCart className="w-6 h-6" /> Confirm Seat Allocation
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
