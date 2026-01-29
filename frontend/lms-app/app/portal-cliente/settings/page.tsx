"use client";

import {
    Building2,
    Palette,
    Shield,
    Bell,
    Users,
    Globe,
    Mail,
    Save,
    Camera,
    CheckCircle2,
    Lock
} from "lucide-react";
import { useState } from "react";

export default function AccountSettingsPage() {
    const [activeTab, setActiveTab] = useState("branding");
    const [isSaving, setIsSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    const [branding, setBranding] = useState({
        primaryColor: "#1e3740",
        secondaryColor: "#a1e6c5",
        companyName: "Acme Corp",
        domain: "acme.education"
    });

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        }, 1500);
    };

    const tabs = [
        { id: "branding", label: "Branding", icon: Palette },
        { id: "company", label: "Company Profile", icon: Building2 },
        { id: "security", label: "Security & SSO", icon: Shield },
        { id: "notifications", label: "Notifications", icon: Bell },
    ];

    return (
        <div className="max-w-5xl space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">Account Settings</h1>
                    <p className="text-slate-500 text-sm mt-1">Configure your organization's workspace and appearance.</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className={`flex items-center gap-2 px-8 py-3 rounded-2xl font-bold text-sm transition-all shadow-lg active:scale-95 ${saved ? 'bg-emerald-500 text-white' : 'bg-slate-900 text-white hover:bg-slate-800'
                        }`}
                >
                    {isSaving ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : saved ? (
                        <CheckCircle2 className="w-4 h-4" />
                    ) : (
                        <Save className="w-4 h-4" />
                    )}
                    {isSaving ? 'Saving...' : saved ? 'Changes Saved' : 'Save Configuration'}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
                {/* Navigation Sidebar */}
                <div className="lg:col-span-1 space-y-2">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl text-sm font-bold transition-all ${activeTab === tab.id
                                        ? "bg-white text-slate-900 shadow-sm border border-slate-100"
                                        : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
                                    }`}
                            >
                                <Icon className={`w-5 h-5 ${activeTab === tab.id ? "text-indigo-500" : "text-slate-300"}`} />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>

                {/* Content Area */}
                <div className="lg:col-span-3 space-y-8">
                    {activeTab === "branding" && (
                        <div className="bg-white rounded-[2.5rem] border border-slate-100 p-10 space-y-10 animate-in fade-in duration-500">
                            <section className="space-y-6">
                                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                    <div className="w-1.5 h-6 bg-[#a1e6c5] rounded-full"></div>
                                    Visual Identity
                                </h3>

                                <div className="flex items-center gap-8 py-4">
                                    <div className="relative group">
                                        <div className="w-24 h-24 bg-slate-50 rounded-3xl flex items-center justify-center text-4xl font-black text-slate-200 border-2 border-dashed border-slate-200 group-hover:bg-slate-100 transition-colors cursor-pointer">
                                            A
                                        </div>
                                        <button className="absolute -bottom-2 -right-2 p-2 bg-white rounded-xl shadow-lg border border-slate-100 text-slate-400 hover:text-slate-900 transition-all active:scale-90">
                                            <Camera className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm font-bold text-slate-800">Company Logo</p>
                                        <p className="text-xs text-slate-400">JPG, PNG or SVG. Max 2MB.</p>
                                        <p className="text-[10px] text-slate-300 font-bold uppercase tracking-widest mt-2">Recommended size: 512x512px</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Primary Brand Color</label>
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="w-12 h-12 rounded-2xl shadow-inner border border-slate-100 cursor-pointer"
                                                style={{ backgroundColor: branding.primaryColor }}
                                            ></div>
                                            <input
                                                type="text"
                                                value={branding.primaryColor}
                                                onChange={(e) => setBranding({ ...branding, primaryColor: e.target.value })}
                                                className="flex-1 bg-slate-50 border-none rounded-2xl p-3 text-sm font-mono font-bold text-slate-600 outline-none focus:ring-2 focus:ring-slate-100"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Secondary Brand Color</label>
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="w-12 h-12 rounded-2xl shadow-inner border border-slate-100 cursor-pointer"
                                                style={{ backgroundColor: branding.secondaryColor }}
                                            ></div>
                                            <input
                                                type="text"
                                                value={branding.secondaryColor}
                                                onChange={(e) => setBranding({ ...branding, secondaryColor: e.target.value })}
                                                className="flex-1 bg-slate-50 border-none rounded-2xl p-3 text-sm font-mono font-bold text-slate-600 outline-none focus:ring-2 focus:ring-slate-100"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section className="space-y-6 pt-10 border-t border-slate-50">
                                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                    <div className="w-1.5 h-6 bg-slate-900 rounded-full"></div>
                                    Whitelabel Experience
                                </h3>
                                <div className="bg-slate-50 rounded-3xl p-6 space-y-4">
                                    <div className="flex items-start gap-4">
                                        <div className="p-2 bg-white rounded-xl shadow-sm">
                                            <Globe className="w-5 h-5 text-indigo-500" />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-slate-800">Custom Subdomain</h4>
                                            <p className="text-xs text-slate-500 mt-1">Direct your students to a personalized entry point.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-2xl p-3 pl-4">
                                        <span className="text-sm font-bold text-slate-400">https://</span>
                                        <input
                                            type="text"
                                            value={branding.companyName.toLowerCase().replace(/ /g, '-')}
                                            className="flex-1 text-sm font-bold text-slate-800 outline-none"
                                            readOnly
                                        />
                                        <span className="text-sm font-bold text-slate-400">.thepower.education</span>
                                    </div>
                                </div>
                            </section>
                        </div>
                    )}

                    {activeTab === "company" && (
                        <div className="bg-white rounded-[2.5rem] border border-slate-100 p-10 space-y-8 animate-in fade-in duration-500">
                            <h3 className="text-lg font-bold text-slate-900">Organization Profile</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Legal Name</label>
                                    <input type="text" defaultValue="Acme Corporation S.L." className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold text-slate-700 outline-none" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tax ID / CIF</label>
                                    <input type="text" defaultValue="B-12345678" className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold text-slate-700 outline-none" />
                                </div>
                                <div className="space-y-2 lg:col-span-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Office Address</label>
                                    <input type="text" defaultValue="Calle Gran Vía, 28, 28013 Madrid, Spain" className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold text-slate-700 outline-none" />
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "security" && (
                        <div className="space-y-6 animate-in fade-in duration-500">
                            <div className="bg-white rounded-[2.5rem] border border-slate-100 p-10 space-y-8">
                                <div className="flex justify-between items-start">
                                    <div className="space-y-1">
                                        <h3 className="text-lg font-bold text-slate-900">Enterprise SSO</h3>
                                        <p className="text-sm text-slate-400">Connect your corporate identity provider (Azure AD, Okta, G Suite).</p>
                                    </div>
                                    <div className="bg-amber-50 text-amber-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                                        <Lock className="w-3 h-3" /> Enterprise
                                    </div>
                                </div>
                                <button className="w-full py-4 bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl text-sm font-bold text-slate-400 hover:bg-slate-100 hover:border-slate-300 transition-all">
                                    + Configure SAML 2.0 Identity Provider
                                </button>
                            </div>

                            <div className="bg-white rounded-[2.5rem] border border-slate-100 p-10 space-y-6">
                                <h3 className="text-lg font-bold text-slate-900">Security Policies</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                                        <div>
                                            <p className="text-sm font-bold text-slate-800">Two-Factor Authentication</p>
                                            <p className="text-xs text-slate-400">Enforce MFA for all managers in your organization.</p>
                                        </div>
                                        <div className="w-12 h-6 bg-slate-200 rounded-full relative cursor-pointer shadow-inner">
                                            <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all"></div>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                                        <div>
                                            <p className="text-sm font-bold text-slate-800">Session Timeout</p>
                                            <p className="text-xs text-slate-400">Automatically logout inactive managers after 30 mins.</p>
                                        </div>
                                        <div className="w-12 h-6 bg-emerald-500 rounded-full relative cursor-pointer">
                                            <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
