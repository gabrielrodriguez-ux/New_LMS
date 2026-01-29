"use client";

import { useState } from "react";
import { Trophy, Star, Zap, Target, Save, CheckCircle2, AlertCircle, Plus, BookOpen, Building2 } from "lucide-react";
import { MOCK_CLIENTS } from "@/lib/mock-data";

export default function GamificationSettingsPage() {
    const [isSaving, setIsSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [selectedClientId, setSelectedClientId] = useState("");

    const targetCompany = MOCK_CLIENTS.find(c => c.id === selectedClientId)?.name;

    // Mock settings for Quiz Gamification
    const [settings, setSettings] = useState({
        baseXpPerCorrect: 50,
        streakMultiplier: 0.1,
        perfectScoreBonus: 200,
        timeBonusLimit: 30, // seconds
        enableLeaderboards: true,
        quizzes: [
            { id: 1, name: "Marketing Basics Quiz", course: "Digital Marketing Rockstars", xp: 150, badges: ["Early Adopter"] },
            { id: 2, name: "Business Model Canvas", course: "ThePowerMBA", xp: 300, badges: ["Strategist"] }
        ]
    });

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        }, 1500);
    };

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Quiz Gamification Engine</h1>
                    <p className="text-gray-500 text-sm mt-1">Configure XP rewards and engagement mechanics per client.</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-3 py-2 shadow-sm focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                        <Building2 className="w-4 h-4 text-gray-400" />
                        <select
                            value={selectedClientId}
                            onChange={(e) => setSelectedClientId(e.target.value)}
                            className="bg-transparent text-sm font-medium text-gray-700 outline-none min-w-[200px]"
                        >
                            <option value="">Select Client Config...</option>
                            {MOCK_CLIENTS.map(client => (
                                <option key={client.id} value={client.id}>{client.name}</option>
                            ))}
                        </select>
                    </div>
                    <button
                        onClick={handleSave}
                        disabled={isSaving || !selectedClientId}
                        className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-sm transition-all shadow-lg active:scale-95 ${!selectedClientId ? 'bg-gray-200 text-gray-400 cursor-not-allowed' :
                                saved ? 'bg-emerald-500 text-white' : 'bg-primary text-white hover:bg-primary-light'
                            }`}
                    >
                        {isSaving ? (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : saved ? (
                            <CheckCircle2 className="w-4 h-4" />
                        ) : (
                            <Save className="w-4 h-4" />
                        )}
                        {isSaving ? 'Saving...' : saved ? 'Settings Applied' : 'Save Configuration'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Global Rules */}
                <div className={`lg:col-span-2 space-y-8 transition-all duration-500 ${!selectedClientId ? 'opacity-40 grayscale pointer-events-none blur-[2px]' : ''}`}>
                    <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
                        <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <Zap className="w-5 h-5 text-amber-500" /> Reward Rules {targetCompany && <span className="text-xs font-normal text-gray-400 ml-2">— Editing for {targetCompany}</span>}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">XP per Correct Answer</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        value={settings.baseXpPerCorrect}
                                        onChange={e => setSettings({ ...settings, baseXpPerCorrect: parseInt(e.target.value) })}
                                        className="w-full bg-gray-50 border border-gray-100 rounded-xl p-4 text-sm font-bold text-gray-700 outline-none focus:ring-2 focus:ring-primary/10"
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400 uppercase">XP</span>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Perfect Score Multiplier</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        value={settings.perfectScoreBonus}
                                        onChange={e => setSettings({ ...settings, perfectScoreBonus: parseInt(e.target.value) })}
                                        className="w-full bg-gray-50 border border-gray-100 rounded-xl p-4 text-sm font-bold text-gray-700 outline-none focus:ring-2 focus:ring-primary/10"
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">BONUS</span>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Streak Boost (per continuous correct)</label>
                                <select
                                    value={settings.streakMultiplier}
                                    onChange={e => setSettings({ ...settings, streakMultiplier: parseFloat(e.target.value) })}
                                    className="w-full bg-gray-50 border border-gray-100 rounded-xl p-4 text-sm font-bold text-gray-700 outline-none"
                                >
                                    <option value={0.1}>10% Extra XP</option>
                                    <option value={0.2}>20% Extra XP</option>
                                    <option value={0.5}>50% Extra XP</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Quick Answer Speed (seconds)</label>
                                <input
                                    type="number"
                                    value={settings.timeBonusLimit}
                                    onChange={e => setSettings({ ...settings, timeBonusLimit: parseInt(e.target.value) })}
                                    className="w-full bg-gray-50 border border-gray-100 rounded-xl p-4 text-sm font-bold text-gray-700 outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Quiz Overrides */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="p-8 border-b border-gray-50 flex justify-between items-center">
                            <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                <BookOpen className="w-5 h-5 text-primary" /> Specific Quiz Rewards
                            </h3>
                            <button className="text-xs font-bold text-primary flex items-center gap-1 hover:underline">
                                <Plus className="w-3.5 h-3.5" /> Add Override
                            </button>
                        </div>
                        <div className="divide-y divide-gray-50">
                            {settings.quizzes.map(quiz => (
                                <div key={quiz.id} className="p-6 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                                    <div>
                                        <p className="font-bold text-gray-800 text-sm">{quiz.name}</p>
                                        <p className="text-xs text-gray-400 font-medium">{quiz.course}</p>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <div className="text-right">
                                            <p className="text-xs font-black text-gray-900">+{quiz.xp} XP</p>
                                            <p className="text-[9px] text-emerald-500 font-bold uppercase tracking-widest">Base Reward</p>
                                        </div>
                                        <div className="flex -space-x-2">
                                            {quiz.badges.map((b, i) => (
                                                <div key={i} className="w-8 h-8 rounded-full bg-amber-100 border-2 border-white flex items-center justify-center shadow-sm" title={b}>
                                                    <Star className="w-4 h-4 text-amber-600" />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Engagement Simulator / Summary */}
                <div className="space-y-8">
                    <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
                        <div className="relative z-10">
                            <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-6">Engagement Preview</h4>
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <p className="text-xs text-slate-400 font-medium">Potential Student Gain (Per Quiz)</p>
                                    <p className="text-3xl font-black text-white">~1,500 XP</p>
                                    <p className="text-[10px] text-emerald-400 font-bold uppercase">Estimated +2 Levels / month</p>
                                </div>
                                <div className="h-px bg-white/10"></div>
                                <div className="space-y-1">
                                    <div className="flex justify-between items-center text-xs font-bold">
                                        <span>Engagement Impact</span>
                                        <span className="text-emerald-400">High</span>
                                    </div>
                                    <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: '85%' }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Background Decoration */}
                        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm space-y-4">
                        <div className="flex items-center gap-3 text-amber-600 bg-amber-50 p-4 rounded-xl">
                            <AlertCircle className="w-5 h-5 shrink-0" />
                            <p className="text-xs font-medium leading-relaxed">
                                High multipliers may cause "XP Inflation". We recommend a max of <strong>10% boost</strong> for recurring quizzes.
                            </p>
                        </div>
                        <div className="p-4 border border-dashed border-gray-200 rounded-xl space-y-2 text-center group cursor-pointer hover:border-primary transition-colors">
                            <Trophy className="w-6 h-6 text-gray-300 mx-auto group-hover:text-primary transition-colors" />
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Connect to Leaderboards</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
