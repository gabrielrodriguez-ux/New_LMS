"use client";

import { Mail, Users, Save, Plus, Trash2, Check, AlertCircle } from "lucide-react";
import { useState } from "react";

export default function AdminSettingsPage() {
    const [activeTab, setActiveTab] = useState("email");

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Platform Settings</h1>
                    <p className="text-gray-500 text-sm mt-1">Configure communication channels and learning resources.</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-light">
                    <Save className="w-4 h-4" /> Save Changes
                </button>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="flex border-b border-gray-200">
                    <button
                        onClick={() => setActiveTab("email")}
                        className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 border-b-2 transition-colors ${activeTab === "email" ? "border-primary text-primary bg-blue-50/50" : "border-transparent text-gray-500 hover:text-gray-700"
                            }`}
                    >
                        <Mail className="w-4 h-4" /> Email & Notifications (FUNDAE)
                    </button>
                    <button
                        onClick={() => setActiveTab("tutors")}
                        className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 border-b-2 transition-colors ${activeTab === "tutors" ? "border-primary text-primary bg-blue-50/50" : "border-transparent text-gray-500 hover:text-gray-700"
                            }`}
                    >
                        <Users className="w-4 h-4" /> Tutor Assignment
                    </button>
                </div>

                <div className="p-8">
                    {/* EMAIL SETTINGS */}
                    {activeTab === "email" && (
                        <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in">
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3 text-blue-800 text-sm">
                                <AlertCircle className="w-5 h-5 shrink-0" />
                                <p>FUNDAE compliance requires tracking all student communications. Ensure "Log all outgoing emails" is enabled.</p>
                            </div>

                            <div className="space-y-4">
                                <h3 className="font-bold text-gray-900 border-b border-gray-100 pb-2">SMTP Configuration</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Sender Name</label>
                                        <input type="text" defaultValue="ThePower Education" className="w-full border border-gray-300 rounded p-2 text-sm" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Sender Email</label>
                                        <input type="email" defaultValue="no-reply@thepower.edu" className="w-full border border-gray-300 rounded p-2 text-sm" />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="font-bold text-gray-900 border-b border-gray-100 pb-2">Automatic Nudges</h3>
                                {[
                                    { label: "Welcome & Login Credentials", enabled: true },
                                    { label: "Weekly Progress Report", enabled: true },
                                    { label: "Inactivity Warning (7 days)", enabled: true },
                                    { label: "Course Completion Certificate", enabled: true },
                                ].map((setting, i) => (
                                    <div key={i} className="flex items-center justify-between py-2">
                                        <span className="text-gray-700 text-sm font-medium">{setting.label}</span>
                                        <div className={`w-10 h-5 rounded-full relative cursor-pointer ${setting.enabled ? 'bg-green-500' : 'bg-gray-300'}`}>
                                            <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${setting.enabled ? 'left-6' : 'left-1'}`}></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* TUTOR SETTINGS */}
                    {activeTab === "tutors" && (
                        <div className="space-y-6 animate-in fade-in">
                            <div className="flex justify-between items-end">
                                <h3 className="font-bold text-gray-900">Active Tutors</h3>
                                <button className="text-xs font-bold text-primary flex items-center gap-1 hover:underline">
                                    <Plus className="w-3 h-3" /> Add New Tutor
                                </button>
                            </div>

                            <div className="border border-gray-200 rounded-lg overflow-hidden">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-gray-50 text-gray-500 font-medium">
                                        <tr>
                                            <th className="px-4 py-3">Tutor Name</th>
                                            <th className="px-4 py-3">Assigned Cohorts</th>
                                            <th className="px-4 py-3">Students</th>
                                            <th className="px-4 py-3 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {[
                                            { name: "Sarah Jenkins", cohorts: ["ThePowerMBA Sept", "Digital Mkt Oct"], students: 145 },
                                            { name: "Mike Ross", cohorts: ["Data Science Beta"], students: 42 },
                                        ].map((tutor, i) => (
                                            <tr key={i} className="hover:bg-gray-50">
                                                <td className="px-4 py-3 font-medium text-gray-900">{tutor.name}</td>
                                                <td className="px-4 py-3">
                                                    <div className="flex gap-2">
                                                        {tutor.cohorts.map(c => (
                                                            <span key={c} className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs border border-blue-100">{c}</span>
                                                        ))}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-gray-500">{tutor.students} Active</td>
                                                <td className="px-4 py-3 text-right text-gray-400">
                                                    <button className="hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                                <h4 className="font-bold text-yellow-800 text-sm mb-2">Assign Tutor to Cohort</h4>
                                <div className="flex gap-4">
                                    <select className="flex-1 border border-gray-300 rounded p-2 text-sm">
                                        <option>Select Tutor...</option>
                                        <option>Sarah Jenkins</option>
                                        <option>Mike Ross</option>
                                    </select>
                                    <select className="flex-1 border border-gray-300 rounded p-2 text-sm">
                                        <option>Select Cohort...</option>
                                        <option>ThePowerMBA - Nov 2025</option>
                                    </select>
                                    <button className="px-4 py-2 bg-yellow-400 text-yellow-900 font-bold text-sm rounded hover:bg-yellow-500">Assign</button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
