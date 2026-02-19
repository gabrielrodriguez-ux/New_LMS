"use client";

import { useState } from "react";
import { Calendar as CalendarIcon, Clock, Users, Plus, X, Video, MapPin, Save, MoreHorizontal, Building2 } from "lucide-react";
import { MOCK_CLIENTS } from "@/lib/mock-data";

export default function TutoringSessionsPage() {
    const [selectedClientId, setSelectedClientId] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);

    // In a real app, we would fetch sessions based on selectedClientId
    const [sessions, setSessions] = useState([
        { id: 1, title: "Business Strategy Q&A", date: "2025-02-10", time: "18:00", tutor: "Gabriel Rodriguez", capacity: 50, type: "Online", platform: "Zoom", clientId: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11" },
        { id: 2, title: "Marketing Workshop", date: "2025-02-12", time: "17:00", tutor: "Maria Garcia", capacity: 30, type: "In-person", platform: "Madrid Office", clientId: "b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12" }
    ]);

    const [newSession, setNewSession] = useState({
        title: "",
        date: "",
        time: "",
        tutor: "",
        capacity: 50,
        type: "Online",
        platform: ""
    });

    const filteredSessions = selectedClientId
        ? sessions.filter(s => s.clientId === selectedClientId)
        : sessions;

    const handleCreateSession = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedClientId) {
            alert("Please select a client first");
            return;
        }
        setSessions([...sessions, { ...newSession, id: Date.now(), clientId: selectedClientId }]);
        setIsModalOpen(false);
        setNewSession({ title: "", date: "", time: "", tutor: "", capacity: 50, type: "Online", platform: "" });
    };

    const targetCompany = MOCK_CLIENTS.find(c => c.id === selectedClientId)?.name;

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center text-balance">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Tutoring & Mentorship</h1>
                    <p className="text-gray-500 text-sm mt-1">Schedule and manage live sessions per client.</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-3 py-2 shadow-sm focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                        <Building2 className="w-4 h-4 text-gray-400" />
                        <select
                            value={selectedClientId}
                            onChange={(e) => setSelectedClientId(e.target.value)}
                            className="bg-transparent text-sm font-medium text-gray-700 outline-none min-w-[200px]"
                        >
                            <option value="">All Clients (View Only)</option>
                            {MOCK_CLIENTS.map(client => (
                                <option key={client.id} value={client.id}>{client.name}</option>
                            ))}
                        </select>
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        disabled={!selectedClientId}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-md active:scale-95 ${!selectedClientId ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-primary text-white hover:bg-primary-light'
                            }`}
                    >
                        <Plus className="w-4 h-4" /> Create for {targetCompany || "Client"}
                    </button>
                </div>
            </div>

            {filteredSessions.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredSessions.map(session => {
                        const clientName = MOCK_CLIENTS.find(c => c.id === session.clientId)?.name;
                        return (
                            <div key={session.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-all group">
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className={`p-2 rounded-lg ${session.type === 'Online' ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'}`}>
                                            {session.type === 'Online' ? <Video className="w-5 h-5" /> : <MapPin className="w-5 h-5" />}
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">{clientName}</p>
                                            <button className="text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <MoreHorizontal className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                    <h3 className="font-bold text-lg text-gray-900 mb-2">{session.title}</h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3 text-sm text-gray-600">
                                            <CalendarIcon className="w-4 h-4 text-gray-400" />
                                            <span>{session.date}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm text-gray-600">
                                            <Clock className="w-4 h-4 text-gray-400" />
                                            <span>{session.time} (60 min)</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm text-gray-600">
                                            <Users className="w-4 h-4 text-gray-400" />
                                            <span>{session.tutor} • Max {session.capacity} st.</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center text-xs font-bold uppercase tracking-wider text-gray-500">
                                    <span className="truncate max-w-[150px]">{session.platform}</span>
                                    <span className="text-primary cursor-pointer hover:underline shrink-0">Edit</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                    <CalendarIcon className="w-12 h-12 text-gray-300 mb-4" />
                    <p className="text-gray-500 font-medium">No sessions scheduled for this client.</p>
                    <button onClick={() => setIsModalOpen(true)} className="mt-4 text-primary font-bold text-sm hover:underline">Schedule the first one</button>
                </div>
            )}

            {/* Create Session Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 leading-tight">New Tutoring Session</h2>
                                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Target: {targetCompany}</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-gray-100 rounded-full transition-colors"><X className="w-5 h-5" /></button>
                        </div>
                        <form onSubmit={handleCreateSession} className="p-8 space-y-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Session Title</label>
                                    <input
                                        required
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                        placeholder="e.g. Masterclass: Strategy"
                                        value={newSession.title}
                                        onChange={e => setNewSession({ ...newSession, title: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Date</label>
                                        <input
                                            type="date"
                                            required
                                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                                            value={newSession.date}
                                            onChange={e => setNewSession({ ...newSession, date: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Time</label>
                                        <input
                                            type="time"
                                            required
                                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                                            value={newSession.time}
                                            onChange={e => setNewSession({ ...newSession, time: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Tutor Name</label>
                                        <input
                                            required
                                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none"
                                            placeholder="Tutor Name"
                                            value={newSession.tutor}
                                            onChange={e => setNewSession({ ...newSession, tutor: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Type</label>
                                        <select
                                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none"
                                            value={newSession.type}
                                            onChange={e => setNewSession({ ...newSession, type: e.target.value })}
                                        >
                                            <option>Online</option>
                                            <option>In-person</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Platform / Location</label>
                                    <input
                                        required
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none"
                                        placeholder="Zoom link or Room Number"
                                        value={newSession.platform}
                                        onChange={e => setNewSession({ ...newSession, platform: e.target.value })}
                                    />
                                </div>
                            </div>
                            <button type="submit" className="w-full py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary-light shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95">
                                <Save className="w-5 h-5" /> Schedule for {targetCompany}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
