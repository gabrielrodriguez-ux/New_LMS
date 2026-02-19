"use client";

import { Upload, Download, Search, MoreHorizontal, UserPlus, FileText, CheckCircle2, AlertCircle, X, Building2, BookOpen, Plus, UserCheck, Pencil, Trash2, Save, ChevronLeft, ChevronRight, User, Shield } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import Papa from "papaparse";
import { apiClient } from "@/utils/api-client";

export default function AdminStaffPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [clients, setClients] = useState<any[]>([]);
    const [courses, setCourses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Filter UI State
    const [selectedCompanyId, setSelectedCompanyId] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    // Create State
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [createForm, setCreateForm] = useState({ firstName: '', lastName: '', email: '', role: 'teacher', department: '', status: 'active', client_id: '' });

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    // Edit/Delete State
    const [editingUser, setEditingUser] = useState<any | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editForm, setEditForm] = useState({ firstName: '', lastName: '', role: '', department: '', status: '' });

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

    const handleCreate = async () => {
        try {
            // Basic validation
            if (!createForm.email || !createForm.firstName || !createForm.lastName) {
                alert("Please fill in first name, last name, and email.");
                return;
            }

            // Require Organization if available
            if (clients.length > 0 && !createForm.client_id) {
                alert("Please select an Organization.");
                return;
            }

            const payload: any = {
                ...createForm
            };

            // Remove empty client_id if present to avoid UUID errors if backend handles default, 
            // though we enforced it above.
            if (!payload.client_id) delete payload.client_id;

            const res = await apiClient.post('IAM', '/api/users', payload);
            if (!res) throw new Error("Creation failed");

            // Optimistic update or refresh
            fetchInitialData();
            setIsCreateModalOpen(false);
            setCreateForm({ firstName: '', lastName: '', email: '', role: 'teacher', department: '', status: 'active', client_id: '' });
            alert("Staff member created successfully.");
        } catch (error: any) {
            console.error("Creation failed", error);
            // Show real error to help debug
            alert(`Failed to create user: ${error.message || "Unknown error"}`);
        }
    };

    const handleDelete = async (userId: string) => {
        if (!confirm("Are you sure you want to delete this staff member? This action cannot be undone.")) return;
        try {
            await apiClient.delete('IAM', `/api/users/${userId}`);
            setUsers(users.filter(u => u.id !== userId));
            alert("Staff member deleted successfully.");
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
            alert("Failed to update staff member.");
        }
    };

    // Filter & Pagination Logic
    const filteredUsers = users.filter(user => {
        // STRICT FILTER: ONLY STAFF (Non-students)
        if (user.role === 'student') return false;

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
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        <Shield className="w-8 h-8 text-indigo-600" />
                        Staff Management
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">Manage admins, managers, teachers, and other non-student roles.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20 active:scale-95"
                    >
                        <UserPlus className="w-4 h-4" /> Add Staff
                    </button>
                    <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-2xl px-4 py-2 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
                        <Search className="w-4 h-4 text-slate-400" />
                        <input
                            placeholder="Search staff..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-transparent text-xs font-bold text-slate-700 outline-none w-32 focus:w-48 transition-all"
                        />
                    </div>
                </div>
            </div>

            {/* Main Table */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden min-h-[400px]">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 space-y-4">
                        <div className="w-12 h-12 border-4 border-slate-100 border-t-indigo-600 rounded-full animate-spin"></div>
                        <p className="text-xs font-black text-slate-300 uppercase tracking-widest animate-pulse">Loading Staff...</p>
                    </div>
                ) : (
                    <>
                        <table className="w-full">
                            <thead className="bg-indigo-50/30 border-b border-indigo-50">
                                <tr>
                                    <th className="px-8 py-5 text-left text-[10px] font-black text-indigo-300 uppercase tracking-widest">Identity</th>
                                    {/* Employer removed */}
                                    <th className="px-8 py-5 text-left text-[10px] font-black text-indigo-300 uppercase tracking-widest">Role</th>
                                    <th className="px-8 py-5 text-center text-[10px] font-black text-indigo-300 uppercase tracking-widest">Status</th>
                                    <th className="px-8 py-5 text-right text-[10px] font-black text-indigo-300 uppercase tracking-widest">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {paginatedUsers.length > 0 ? (
                                    paginatedUsers.map(user => (
                                        <tr key={user.id} className="group hover:bg-slate-50/50 transition-colors">
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-black text-xs uppercase group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                                                        {user.first_name?.[0]}{user.last_name?.[0]}
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-slate-900 leading-tight">{user.first_name} {user.last_name}</p>
                                                        <p className="text-[10px] text-slate-400 font-bold tracking-tight mt-0.5">{user.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            {/* Employer column data removed */}
                                            <td className="px-8 py-5">
                                                <span className={`text-[9px] font-black rounded-full px-2 py-0.5 uppercase tracking-widest border ${user.role === 'admin' ? 'bg-indigo-100 text-indigo-700 border-indigo-200' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
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
                                                        title="Delete Staff"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
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
                                                    <Shield className="w-10 h-10 text-slate-300" />
                                                </div>
                                                <p className="text-slate-900 font-bold text-lg">No staff found</p>
                                                <p className="text-slate-400 text-sm mt-1 max-w-xs mx-auto">Try adjusting your search criteria.</p>
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

            {/* CREATE MODAL */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
                    <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="p-10 space-y-6">
                            <div className="flex justify-between items-start">
                                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Add New Staff</h2>
                                <button onClick={() => setIsCreateModalOpen(false)} className="p-2 hover:bg-slate-50 rounded-xl transition-colors"><X className="w-6 h-6 text-slate-400" /></button>
                            </div>

                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">First Name</label>
                                        <input
                                            value={createForm.firstName}
                                            onChange={e => setCreateForm({ ...createForm, firstName: e.target.value })}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                            placeholder="e.g. John"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Last Name</label>
                                        <input
                                            value={createForm.lastName}
                                            onChange={e => setCreateForm({ ...createForm, lastName: e.target.value })}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                            placeholder="e.g. Doe"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
                                    <input
                                        value={createForm.email}
                                        onChange={e => setCreateForm({ ...createForm, email: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                        placeholder="john.doe@example.com"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Department</label>
                                    <input
                                        value={createForm.department}
                                        onChange={e => setCreateForm({ ...createForm, department: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                        placeholder="e.g. Operations"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">System Role</label>
                                    <div className="relative">
                                        <select
                                            value={createForm.role}
                                            onChange={e => setCreateForm({ ...createForm, role: e.target.value })}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all cursor-pointer appearance-none"
                                        >
                                            <option value="manager">Manager</option>
                                            <option value="client_admin">Client Admin (L&D)</option>
                                            <option value="teacher">Tutor / Teacher</option>
                                            <option value="inspector">Inspector (Fundae)</option>
                                            <option value="admin">Super Admin</option>
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                            <div className="w-2 h-2 border-r-2 border-b-2 border-slate-400 rotate-45 mb-1"></div>
                                        </div>
                                    </div>
                                </div>
                                {clients.length > 0 && (
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Organization</label>
                                        <div className="relative">
                                            <select
                                                value={createForm.client_id}
                                                onChange={e => setCreateForm({ ...createForm, client_id: e.target.value })}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all cursor-pointer appearance-none"
                                            >
                                                <option value="">Select an organization...</option>
                                                {clients.map(client => (
                                                    <option key={client.id} value={client.id}>{client.name}</option>
                                                ))}
                                            </select>

                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                                <div className="w-2 h-2 border-r-2 border-b-2 border-slate-400 rotate-45 mb-1"></div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-end pt-4">
                                <button
                                    onClick={handleCreate}
                                    className="flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white rounded-2xl text-sm font-black hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-500/20 active:scale-95"
                                >
                                    <UserPlus className="w-4 h-4" /> Create Staff Member
                                </button>
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
                                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Edit Staff Member</h2>
                                <button onClick={() => setIsEditModalOpen(false)} className="p-2 hover:bg-slate-50 rounded-xl transition-colors"><X className="w-6 h-6 text-slate-400" /></button>
                            </div>

                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">First Name</label>
                                        <input
                                            value={editForm.firstName}
                                            onChange={e => setEditForm({ ...editForm, firstName: e.target.value })}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Last Name</label>
                                        <input
                                            value={editForm.lastName}
                                            onChange={e => setEditForm({ ...editForm, lastName: e.target.value })}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Department</label>
                                    <input
                                        value={editForm.department}
                                        onChange={e => setEditForm({ ...editForm, department: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                        placeholder="e.g. Sales, Marketing..."
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Account Status</label>
                                    <select
                                        value={editForm.status}
                                        onChange={e => setEditForm({ ...editForm, status: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all cursor-pointer"
                                    >
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">System Role</label>
                                    <div className="relative">
                                        <select
                                            value={editForm.role}
                                            onChange={e => setEditForm({ ...editForm, role: e.target.value })}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all cursor-pointer appearance-none"
                                        >
                                            <option value="manager">Manager</option>
                                            <option value="client_admin">Client Admin (L&D)</option>
                                            <option value="teacher">Tutor / Teacher</option>
                                            <option value="inspector">Inspector (Fundae)</option>
                                            <option value="admin">Super Admin</option>
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                            <div className="w-2 h-2 border-r-2 border-b-2 border-slate-400 rotate-45 mb-1"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end pt-4">
                                <button
                                    onClick={handleSaveEdit}
                                    className="flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white rounded-2xl text-sm font-black hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-500/20 active:scale-95"
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
