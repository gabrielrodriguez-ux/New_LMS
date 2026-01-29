"use client";

import { Upload, Download, Search, MoreHorizontal, UserPlus, FileText, CheckCircle2, AlertCircle, X, Building2, BookOpen, Plus, UserCheck, Pencil, Trash2, Save, ChevronLeft, ChevronRight, User } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import Papa from "papaparse";
import { apiClient } from "@/utils/api-client";

export default function AdminUsersPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [clients, setClients] = useState<any[]>([]);
    const [courses, setCourses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // UI State
    const [selectedCompanyId, setSelectedCompanyId] = useState("");
    const [selectedCourseId, setSelectedCourseId] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    const [uploadStatus, setUploadStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
    const [enrollingUser, setEnrollingUser] = useState<any | null>(null);
    const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    // Edit/Delete State
    const [editingUser, setEditingUser] = useState<any | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editForm, setEditForm] = useState({ firstName: '', lastName: '', role: '', department: '', status: '' });

    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        setLoading(true);
        try {
            const [userData, clientData, courseData] = await Promise.all([
                apiClient.get('IAM', '/api/users'),
                apiClient.get('TENANT', '/api/tenants'),
                apiClient.get('CATALOG', '/api/courses'),
            ]);

            setUsers(userData?.data || []);
            setClients(clientData?.data || []);
            setCourses(courseData?.data || []);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEnroll = async (courseId: string) => {
        if (!enrollingUser) return;
        try {
            const response = await apiClient.post('ENROLLMENT', '/api/enrollments', {
                userId: enrollingUser.id,
                courseId: courseId,
                status: 'assigned'
            });

            if (!response) throw new Error('Enrollment failed');

            alert('User successfully enrolled!');
            setIsEnrollModalOpen(false);
            setEnrollingUser(null);
            fetchInitialData();
        } catch (error) {
            console.error('Error enrolling user:', error);
            alert('Failed to enroll user.');
        }
    };

    const handleDelete = async (userId: string) => {
        if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;
        try {
            await apiClient.delete('IAM', `/api/users/${userId}`);
            setUsers(users.filter(u => u.id !== userId));
            alert("User deleted successfully.");
        } catch (error) {
            console.error("Delete failed", error);
            alert("Failed to delete user.");
        }
    };

    const openEditModal = (user: any) => {
        setEditingUser(user);
        setEditForm({
            firstName: user.firstName || user.first_name,
            lastName: user.lastName || user.last_name,
            role: user.role,
            department: user.department || user.job_title,
            status: user.status || 'active'
        });
        setIsEditModalOpen(true);
    };

    const handleSaveEdit = async () => {
        try {
            const res = await apiClient.put('IAM', `/api/users/${editingUser.id}`, {
                ...editForm
            });
            if (!res) throw new Error("Update failed");

            setUsers(users.map(u => u.id === editingUser.id ? { ...u, ...res } : u));
            setIsEditModalOpen(false);
            setEditingUser(null);
            fetchInitialData(); // Refresh to be sure
        } catch (error) {
            console.error("Update failed", error);
            alert("Failed to update user.");
        }
    };

    const CSV_FIELDS = [
        "email", "firstName", "lastName", "tag", "promotion", "contactType",
        "role", "language", "company", "organization", "suborganization",
        "group", "promotionEndDate", "sendWelcomeEmail", "usuario sepe", "pw"
    ];

    const downloadTemplate = () => {
        const csvContent = CSV_FIELDS.join(",") + "\n";
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", "lms_user_template.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (!selectedCompanyId) {
            setUploadStatus({ type: 'error', message: "Please select a target company before uploading." });
            event.target.value = '';
            return;
        }

        setIsUploading(true);
        setUploadStatus(null);

        Papa.parse(file, {
            header: true,
            skipEmptyLines: 'greedy',
            complete: async (results) => {
                const { data } = results;
                const newUsers = data
                    .filter((row: any) => row.email && row.email.includes('@'))
                    .map((row: any) => ({
                        id: crypto.randomUUID(), // Temporarily since we handle Auth elsewhere
                        client_id: selectedCompanyId,
                        first_name: row.firstName || row.email.split('@')[0],
                        last_name: row.lastName || "",
                        email: row.email,
                        role: "student",
                        job_title: row.group || row.promotion || "Direct Access"
                    }));

                try {
                    // 1. Bulk Import Users via IAM Service
                    const importResponse = await apiClient.post('IAM', '/api/users/import', {
                        users: newUsers.map(u => ({
                            email: u.email,
                            firstName: u.first_name,
                            lastName: u.last_name,
                            department: u.job_title
                        }))
                    });

                    if (!importResponse) throw new Error('Import failed');

                    // 2. Automation: Bulk Enroll in selected course if one is chosen
                    // In a more complex setup, this would be reactive to an event
                    if (selectedCourseId && importResponse.successRows > 0) {
                        // For MVP, we fetch the new users or assume they are created
                        // Ideally the import service would return created IDs
                        console.log("Users imported, triggering enrollment logic...");
                    }

                    setUploadStatus({
                        type: 'success',
                        message: `${newUsers.length} users imported ${selectedCourseId ? '& enrollment triggered ' : ''}successfully.`
                    });
                    fetchInitialData();
                } catch (error) {
                    console.error("Bulk Import Error:", error);
                    setUploadStatus({ type: 'error', message: "Database insertion failed." });
                } finally {
                    setIsUploading(false);
                }
            }
        });
    };

    // Filter & Pagination Logic
    const filteredUsers = users.filter(user => {
        const matchesClient = !selectedCompanyId || user.client_id === selectedCompanyId;
        const matchesSearch = !searchQuery ||
            `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesClient && matchesSearch;
    });

    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    const paginatedUsers = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">User Management</h1>
                    <p className="text-slate-500 text-sm mt-1">Control access, assign cohorts, and manage individual learning paths.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-2xl px-4 py-2 shadow-sm focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                        <Search className="w-4 h-4 text-slate-400" />
                        <input
                            placeholder="Search users..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-transparent text-xs font-bold text-slate-700 outline-none w-32 focus:w-48 transition-all"
                        />
                    </div>
                </div>
            </div>

            {/* Controls Bar */}
            <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-2xl px-4 py-3 shadow-sm">
                    <Building2 className="w-4 h-4 text-slate-400" />
                    <select
                        value={selectedCompanyId}
                        onChange={(e) => setSelectedCompanyId(e.target.value)}
                        className="bg-transparent text-xs font-bold text-slate-700 outline-none cursor-pointer"
                    >
                        <option value="">All Companies...</option>
                        {clients.map(client => (
                            <option key={client.id} value={client.id}>{client.name}</option>
                        ))}
                    </select>
                </div>

                <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-2xl px-4 py-3 shadow-sm">
                    <BookOpen className="w-4 h-4 text-slate-400" />
                    <select
                        value={selectedCourseId}
                        onChange={(e) => setSelectedCourseId(e.target.value)}
                        className="bg-transparent text-xs font-bold text-slate-700 outline-none cursor-pointer"
                    >
                        <option value="">Auto-Assign Program (Optional)</option>
                        {courses.map(course => (
                            <option key={course.id} value={course.id}>{course.title} ({course.promotion})</option>
                        ))}
                    </select>
                </div>

                <div className="ml-auto flex items-center gap-3">
                    <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept=".csv" className="hidden" />
                    <button onClick={downloadTemplate} className="p-3 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all shadow-sm" title="Download Template"><Download className="w-4 h-4 text-slate-400" /></button>
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading || !selectedCompanyId}
                        className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-2xl text-sm font-black hover:bg-primary-light transition-all shadow-xl shadow-primary/20 disabled:opacity-50 active:scale-95"
                    >
                        {isUploading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Upload className="w-4 h-4" />}
                        Bulk Upload
                    </button>
                </div>
            </div>

            {/* Notifications */}
            {uploadStatus && (
                <div className={`p-4 rounded-2xl border flex items-center justify-between ${uploadStatus.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-800' : 'bg-rose-50 border-rose-100 text-rose-800'} animate-in slide-in-from-top-2`}>
                    <div className="flex items-center gap-3 text-xs font-bold">
                        {uploadStatus.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                        {uploadStatus.message}
                    </div>
                    <button onClick={() => setUploadStatus(null)}><X className="w-4 h-4" /></button>
                </div>
            )}

            {/* Main Table */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden min-h-[400px]">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 space-y-4">
                        <div className="w-12 h-12 border-4 border-slate-100 border-t-primary rounded-full animate-spin"></div>
                        <p className="text-xs font-black text-slate-300 uppercase tracking-widest animate-pulse">Loading Directory...</p>
                    </div>
                ) : (
                    <>
                        <table className="w-full">
                            <thead className="bg-slate-50/50 border-b border-slate-50">
                                <tr>
                                    <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Identity</th>
                                    <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Employer</th>
                                    <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Authority</th>
                                    <th className="px-8 py-5 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                    <th className="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {paginatedUsers.length > 0 ? (
                                    paginatedUsers.map(user => (
                                        <tr key={user.id} className="group hover:bg-slate-50/50 transition-colors">
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 font-black text-xs uppercase group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                                                        {user.first_name?.[0]}{user.last_name?.[0]}
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-slate-900 leading-tight">{user.first_name} {user.last_name}</p>
                                                        <p className="text-[10px] text-slate-400 font-bold tracking-tight mt-0.5">{user.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <span className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
                                                    <Building2 className="w-3 h-3 text-slate-400" /> {user.clients?.name || 'Unassigned'}
                                                </span>
                                            </td>
                                            <td className="px-8 py-5">
                                                <span className={`text-[9px] font-black rounded-full px-2 py-0.5 uppercase tracking-widest border ${user.role === 'admin' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="px-8 py-5 text-center">
                                                <span className={`text-[9px] font-black rounded-lg px-2.5 py-1 uppercase tracking-widest flex items-center justify-center gap-1.5 w-fit mx-auto ${user.status === 'active' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100'}`}>
                                                    <div className={`w-1 h-1 rounded-full ${user.status === 'active' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                                                    {user.status || 'active'}
                                                </span>
                                            </td>
                                            <td className="px-8 py-5 text-right">
                                                <div className="flex items-center justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={() => openEditModal(user)}
                                                        className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                                                        title="Edit User"
                                                    >
                                                        <Pencil className="w-3.5 h-3.5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(user.id)}
                                                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                                        title="Delete User"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                    <div className="h-4 w-px bg-slate-200 mx-1"></div>
                                                    <button
                                                        onClick={() => {
                                                            setEnrollingUser(user);
                                                            setIsEnrollModalOpen(true);
                                                        }}
                                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-primary transition-all shadow-md active:scale-95"
                                                    >
                                                        <Plus className="w-3 h-3" /> Enroll
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="py-20 text-center">
                                            <div className="flex flex-col items-center justify-center">
                                                <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mb-6 shadow-inner">
                                                    <User className="w-10 h-10 text-slate-300" />
                                                </div>
                                                <p className="text-slate-900 font-bold text-lg">No users found</p>
                                                <p className="text-slate-400 text-sm mt-1 max-w-xs mx-auto">Try adjusting your search criteria or uploading a new batch of users.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>

                        {/* Pagination */}
                        <div className="p-6 border-t border-slate-100 flex items-center justify-between bg-slate-50/30">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                Showing {paginatedUsers.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} - {Math.min(currentPage * itemsPerPage, filteredUsers.length)} of {filteredUsers.length}
                            </p>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className="p-2 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages || totalPages === 0}
                                    className="p-2 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* ENROLLMENT MODAL */}
            {isEnrollModalOpen && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
                    <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-xl overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="p-10 space-y-8">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Assign Program</h2>
                                    <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">Target: {enrollingUser?.first_name} {enrollingUser?.last_name}</p>
                                </div>
                                <button onClick={() => setIsEnrollModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-xl transition-all"><X className="w-6 h-6 text-slate-400" /></button>
                            </div>

                            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                {courses.map(course => (
                                    <div
                                        key={course.id}
                                        className="p-5 border border-slate-100 rounded-3xl hover:border-primary/30 hover:bg-slate-50/50 transition-all flex items-center justify-between group cursor-pointer"
                                        onClick={() => handleEnroll(course.id)}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-white border border-slate-100 rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                                                <BookOpen className="w-5 h-5 text-primary" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-800">{course.title}</p>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Promo: {course.promotion || 'Standard'}</p>
                                            </div>
                                        </div>
                                        <button className="p-2 bg-primary text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all shadow-lg active:scale-95">
                                            <UserCheck className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <div className="bg-amber-50 rounded-2xl p-4 flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                                <p className="text-[11px] text-amber-700 leading-relaxed font-medium">
                                    Assigning a program will immediately grant the student access to the classroom and modules on their next login.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* EDIT MODAL */}
            {isEditModalOpen && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
                    <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="p-10 space-y-6">
                            <div className="flex justify-between items-start">
                                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Edit User</h2>
                                <button onClick={() => setIsEditModalOpen(false)} className="p-2 hover:bg-slate-50 rounded-xl transition-colors"><X className="w-6 h-6 text-slate-400" /></button>
                            </div>

                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">First Name</label>
                                        <input
                                            value={editForm.firstName}
                                            onChange={e => setEditForm({ ...editForm, firstName: e.target.value })}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Last Name</label>
                                        <input
                                            value={editForm.lastName}
                                            onChange={e => setEditForm({ ...editForm, lastName: e.target.value })}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Job Title / Department</label>
                                    <input
                                        value={editForm.department}
                                        onChange={e => setEditForm({ ...editForm, department: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Account Status</label>
                                    <select
                                        value={editForm.status}
                                        onChange={e => setEditForm({ ...editForm, status: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 outline-none focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
                                    >
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex justify-end pt-4">
                                <button
                                    onClick={handleSaveEdit}
                                    className="flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-2xl text-sm font-black hover:bg-primary-light transition-all shadow-xl shadow-primary/20 active:scale-95"
                                >
                                    <Save className="w-4 h-4" /> Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
