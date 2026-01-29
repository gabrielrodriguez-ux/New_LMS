"use client";

import { Plus, BookOpen, Calendar, Users, MoreHorizontal, X, Save, Edit, GraduationCap, CheckCircle2, Layout, Filter, Tag, Sparkles } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function AdminClassroomsPage() {
    const [courses, setCourses] = useState<any[]>([]);
    const [filteredCourses, setFilteredCourses] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [editingCourse, setEditingCourse] = useState<any | null>(null);
    const [selectedPromotion, setSelectedPromotion] = useState("All Promos");
    const [stats, setStats] = useState({ totalStudents: 0, avgProgress: 0 });

    // Available promotions for filtering (normally derived from data)
    const [promotions, setPromotions] = useState<string[]>([]);

    // Form State
    const [formData, setFormData] = useState({
        title: "",
        level: "intermediate",
        hours: 40,
        status: "published",
        family_professional: "Management",
        promotion: "",
        description: ""
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const { data: coursesData, error: coursesError } = await supabase
                .from('courses')
                .select('*')
                .order('created_at', { ascending: false });

            if (coursesError) throw coursesError;

            setCourses(coursesData || []);
            setFilteredCourses(coursesData || []);

            // Extract unique promotions for filter
            const p = Array.from(new Set(coursesData?.map(c => c.promotion).filter(Boolean))) as string[];
            setPromotions(p);

            setStats({
                totalStudents: 1240,
                avgProgress: 64
            });
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    // Filter logic
    useEffect(() => {
        if (selectedPromotion === "All Promos") {
            setFilteredCourses(courses);
        } else {
            setFilteredCourses(courses.filter(c => c.promotion === selectedPromotion));
        }
    }, [selectedPromotion, courses]);

    const handleOpenCreate = () => {
        setEditingCourse(null);
        setFormData({
            title: "",
            level: "intermediate",
            hours: 40,
            status: "published",
            family_professional: "Management",
            promotion: new Date().toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }),
            description: ""
        });
        setIsModalOpen(true);
    };

    const handleOpenEdit = (course: any) => {
        setEditingCourse(course);
        setFormData({
            title: course.title,
            level: course.level,
            hours: course.hours,
            status: course.status,
            family_professional: course.family_professional || "",
            promotion: course.promotion || "",
            description: course.description || ""
        });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload = {
                title: formData.title,
                level: formData.level,
                hours: formData.hours,
                status: formData.status,
                family_professional: formData.family_professional,
                promotion: formData.promotion,
                description: formData.description
            };

            if (editingCourse) {
                const { error } = await supabase
                    .from('courses')
                    .update(payload)
                    .eq('id', editingCourse.id);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('courses')
                    .insert([payload]);
                if (error) throw error;
            }

            setIsModalOpen(false);
            fetchData();
        } catch (error) {
            alert('Error al guardar el aula. Asegúrate de haber ejecutado el SQL para añadir la columna "promotion".');
            console.error(error);
        }
    };

    if (loading) return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
            <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">Hydrating Academic Hub...</p>
        </div>
    );

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Academic Classrooms</h1>
                    <p className="text-slate-500 text-sm mt-1">Design, deploy and manage high-impact learning experiences.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-4 py-2.5 shadow-sm focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                        <Filter className="w-4 h-4 text-slate-400" />
                        <select
                            value={selectedPromotion}
                            onChange={(e) => setSelectedPromotion(e.target.value)}
                            className="bg-transparent text-xs font-bold text-slate-600 outline-none cursor-pointer"
                        >
                            <option value="All Promos">All Promos</option>
                            {promotions.map(p => (
                                <option key={p} value={p}>{p}</option>
                            ))}
                        </select>
                    </div>
                    <button
                        onClick={handleOpenCreate}
                        className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-2xl text-sm font-black hover:bg-primary-light transition-all shadow-xl shadow-primary/20 active:scale-95"
                    >
                        <Plus className="w-5 h-5" /> Launch New Aula
                    </button>
                </div>
            </div>

            {/* Quick Stats Banner */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[#1e3740] rounded-[2rem] p-8 text-white flex justify-between items-center shadow-lg relative overflow-hidden group">
                    <div className="relative z-10">
                        <p className="text-[10px] font-black text-[#a1e6c5] uppercase tracking-widest mb-1">Global Active Students</p>
                        <p className="text-3xl font-black italic">{stats.totalStudents}</p>
                    </div>
                    <Users className="w-12 h-12 text-[#a1e6c5] opacity-20 absolute -right-2 top-1/2 -translate-y-1/2 group-hover:scale-110 transition-transform" />
                </div>
                <div className="bg-white rounded-[2rem] p-8 border border-slate-100 flex justify-between items-center shadow-sm">
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Mean Completion Rate</p>
                        <p className="text-3xl font-black text-slate-900">{stats.avgProgress}%</p>
                    </div>
                    <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center">
                        <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                    </div>
                </div>
                <div className="bg-white rounded-[2rem] p-8 border border-slate-100 flex justify-between items-center shadow-sm">
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Active Programs</p>
                        <p className="text-3xl font-black text-slate-900">{courses.length}</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center">
                        <Layout className="w-6 h-6 text-blue-500" />
                    </div>
                </div>
            </div>

            {/* Classrooms Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                {/* Empty State / Create Card */}
                <div
                    onClick={handleOpenCreate}
                    className="group border-2 border-dashed border-slate-200 rounded-[2.5rem] p-10 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-50 hover:border-primary/30 transition-all"
                >
                    <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-slate-300 group-hover:scale-110 group-hover:text-primary transition-all mb-4">
                        <Plus className="w-8 h-8" />
                    </div>
                    <h3 className="font-bold text-slate-400">Deploy New Program</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Monthly Release</p>
                </div>

                {/* Course Iteration */}
                {filteredCourses.map((course) => (
                    <div key={course.id} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col group hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500">
                        <div className="p-8 pb-4">
                            <div className="flex justify-between items-start mb-6">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-105 ${course.status === 'published' ? 'bg-primary text-[#a1e6c5]' : 'bg-slate-100 text-slate-400'
                                    }`}>
                                    <BookOpen className="w-6 h-6" />
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className={`px-3 py-1 text-[9px] font-black rounded-full uppercase tracking-widest shadow-sm ${course.status === 'published' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                                        }`}>
                                        {course.status}
                                    </span>
                                    <button onClick={() => handleOpenEdit(course)} className="p-1 hover:bg-slate-50 rounded-xl transition-colors"><MoreHorizontal className="w-5 h-5 text-slate-300" /></button>
                                </div>
                            </div>

                            <div className="flex items-center gap-1.5 mb-2">
                                <Tag className="w-3 h-3 text-primary" />
                                <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">{course.promotion || 'Sin Promoción'}</span>
                            </div>

                            <h3 className="text-xl font-black text-slate-900 leading-tight mb-4 line-clamp-2 min-h-[3.5rem] group-hover:text-primary transition-colors">
                                {course.title}
                            </h3>

                            <div className="flex items-center gap-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {course.hours}h</span>
                                <span className="flex items-center gap-1.5"><GraduationCap className="w-3.5 h-3.5" /> {course.level}</span>
                            </div>
                        </div>

                        <div className="px-8 py-6 bg-slate-50/50 mt-auto border-t border-slate-50">
                            <div className="flex justify-between items-center mb-4">
                                <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                                    <Users className="w-4 h-4 text-slate-400" />
                                    <span>{Math.floor(Math.random() * 500) + 50} Enrolled</span>
                                </div>
                                <span className="text-[10px] font-black text-emerald-500 uppercase tracking-tighter">Cohort Active</span>
                            </div>
                            <div className="flex gap-3">
                                <Link href={`/admin/classrooms/${course.id}`} className="flex-1 py-3 text-[10px] font-black bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all uppercase tracking-widest shadow-md flex items-center justify-center">
                                    Open Aula
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Create/Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
                    <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-gray-50/30">
                            <div>
                                <h2 className="text-2xl font-black text-slate-900 tracking-tight">{editingCourse ? 'Enhance Aula' : 'Architect New Aula'}</h2>
                                <p className="text-[10px] font-black text-primary uppercase tracking-widest mt-1">Academic Configuration</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white rounded-xl transition-colors"><X className="w-5 h-5 text-slate-400" /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-10 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                            <div className="space-y-1">
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Program Title</label>
                                <input
                                    required
                                    className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                    placeholder="e.g. Master in Digital Biz Strategy"
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Promotion (Release Month)</label>
                                <input
                                    required
                                    className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 text-sm font-bold text-indigo-600 outline-none focus:ring-2 focus:ring-indigo-100 transition-all"
                                    placeholder="e.g. Febrero 2025"
                                    value={formData.promotion}
                                    onChange={e => setFormData({ ...formData, promotion: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-1">
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Learning Level</label>
                                    <select
                                        className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
                                        value={formData.level}
                                        onChange={e => setFormData({ ...formData, level: e.target.value })}
                                    >
                                        <option value="basic">Basic Principles</option>
                                        <option value="intermediate">Intermediate Mastery</option>
                                        <option value="advanced">Advanced Executive</option>
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Total Hours</label>
                                    <input
                                        type="number"
                                        className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                        value={formData.hours}
                                        onChange={e => setFormData({ ...formData, hours: Number(e.target.value) })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Academic Summary</label>
                                <textarea
                                    className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                                    rows={3}
                                    placeholder="Brief description for the campus..."
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-1">
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Professional Family</label>
                                    <input
                                        className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                        placeholder="Management / IT..."
                                        value={formData.family_professional}
                                        onChange={e => setFormData({ ...formData, family_professional: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Deployment Status</label>
                                    <select
                                        className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
                                        value={formData.status}
                                        onChange={e => setFormData({ ...formData, status: e.target.value })}
                                    >
                                        <option value="draft">Internal Draft</option>
                                        <option value="published">Production Live</option>
                                        <option value="archived">Legacy Archive</option>
                                    </select>
                                </div>
                            </div>

                            <div className="pt-6">
                                <button type="submit" className="w-full py-5 bg-slate-900 text-white font-black rounded-[2rem] hover:bg-slate-800 flex items-center justify-center gap-2 shadow-xl shadow-slate-900/20 active:scale-95 transition-all">
                                    <Save className="w-5 h-5" /> {editingCourse ? 'Save Academic Changes' : 'Deploy Program to Campus'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
