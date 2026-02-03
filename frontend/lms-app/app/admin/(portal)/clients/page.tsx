"use client";

import { Search, Plus, Building2, CreditCard, Users, ChevronRight, MoreVertical, X, Save, BookOpen, Settings } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function AdminClientsPage() {
    const [clients, setClients] = useState<any[]>([]);
    const [expandedClient, setExpandedClient] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [selectedSub, setSelectedSub] = useState<any | null>(null);
    const [seatIncrement, setSeatIncrement] = useState(10);
    const [isUpdatingSeats, setIsUpdatingSeats] = useState(false);

    // Feature Configuration State
    const [featureModalOpen, setFeatureModalOpen] = useState(false);
    const [selectedClientForFeatures, setSelectedClientForFeatures] = useState<any | null>(null);
    const [currentFeatures, setCurrentFeatures] = useState({
        leaderboard: false,
        challenges: false,
        hrisSync: false,
        fundae: false,
        advancedExports: false,
        ltiIntegration: false,
        xapiTracking: false
    });

    // Form State
    const [newClient, setNewClient] = useState({
        name: "",
        slug: "",
        domain: "",
        contact_email: "",
        industry: "Technology"
    });

    useEffect(() => {
        fetchClients();
    }, []);

    const openFeatureModal = async (client: any) => {
        setSelectedClientForFeatures(client);
        setLoading(true);
        try {
            // Fetch from TENANTS table
            const { data, error } = await supabase
                .from('tenants')
                .select('feature_flags')
                .eq('id', client.id)
                .single();

            if (data?.feature_flags && Object.keys(data.feature_flags).length > 0) {
                // If we have saved flags, use them. 
                // Merge with defaults in case new flags were added implies we might want true for new ones? 
                // For now just use saved.
                setCurrentFeatures({ ...currentFeatures, ...data.feature_flags });
            } else {
                // Default to TRUE (All enabled) for new/unconfigured clients
                setCurrentFeatures({
                    hrisSync: true,
                    fundae: true,
                    advancedExports: true,
                    ltiIntegration: true,
                    xapiTracking: true,
                    leaderboard: true, // Keep these true internally even if hidden
                    challenges: true
                });
            }
            setFeatureModalOpen(true);
        } catch (e) {
            console.error("Error fetching features", e);
            alert("Could not load feature configuration. Is the tenant synced?");
        } finally {
            setLoading(false);
        }
    };

    const saveFeatures = async () => {
        if (!selectedClientForFeatures) return;
        try {
            const { error } = await supabase
                .from('tenants')
                .update({ feature_flags: currentFeatures })
                .eq('id', selectedClientForFeatures.id);

            if (error) throw error;
            setFeatureModalOpen(false);
            alert("Features updated successfully!");
        } catch (e) {
            console.error("Error saving features", e);
            alert("Failed to save feature configuration.");
        }
    };

    const fetchClients = async () => {
        setLoading(true);
        try {
            // We fetch clients and their subscriptions
            const { data, error } = await supabase
                .from('clients')
                .select(`
                    *,
                    subscriptions (
                        id,
                        plan_name,
                        total_seats,
                        status,
                        start_date,
                        product_type
                    )
                `)
                .order('name');

            if (error) throw error;
            setClients(data || []);
        } catch (error) {
            console.error('Error fetching clients:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddSeats = async () => {
        if (!selectedSub) return;
        setIsUpdatingSeats(true);
        try {
            const newTotal = (selectedSub.total_seats || 0) + seatIncrement;
            const { error } = await supabase
                .from('subscriptions')
                .update({ total_seats: newTotal })
                .eq('id', selectedSub.id);

            if (error) throw error;

            // Refresh data
            await fetchClients();
            setSelectedSub({ ...selectedSub, total_seats: newTotal });
            setSeatIncrement(10);
        } catch (error) {
            console.error('Error updating seats:', error);
            alert('Failed to update seats.');
        } finally {
            setIsUpdatingSeats(false);
        }
    };

    const handleCreateClient = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const { error } = await supabase.from('clients').insert([newClient]);
            if (error) throw error;

            setIsModalOpen(false);
            setNewClient({ name: "", slug: "", domain: "", contact_email: "", industry: "Technology" });
            fetchClients(); // Refresh list
        } catch (error) {
            alert('Error creating client. Slug must be unique.');
            console.error(error);
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Loading clients from Supabase...</div>;

    return (
        <div className="space-y-8 relative animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Clients & Subscriptions</h1>
                    <p className="text-gray-500 text-sm mt-1">Manage B2B clients, contract details, and seat allocation.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-light transition-all shadow-md active:scale-95"
                >
                    <Plus className="w-4 h-4" /> New Client Contract
                </button>
            </div>

            {/* Filter & Search */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 flex gap-4 shadow-sm">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search clients in database..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                    />
                </div>
            </div>

            {/* Clients List */}
            <div className="space-y-4">
                {clients.length > 0 ? clients.map((client) => {
                    const branding = client.branding as any;
                    const primaryColor = branding?.colors?.primary || '#1e3740';

                    return (
                        <div key={client.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-all hover:border-primary/30">
                            {/* Header Row */}
                            <div
                                className="p-6 flex items-center justify-between cursor-pointer hover:bg-gray-50/50"
                                onClick={() => setExpandedClient(expandedClient === client.id ? null : client.id)}
                            >
                                <div className="flex items-center gap-4">
                                    <div
                                        className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-black shadow-inner"
                                        style={{ backgroundColor: primaryColor }}
                                    >
                                        {client.name[0]}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-gray-900">{client.name}</h3>
                                        <div className="flex gap-4 text-xs text-gray-500 font-medium">
                                            <span className="uppercase tracking-widest">{client.industry}</span>
                                            <span>•</span>
                                            <span>{client.contact_email}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-8">
                                    <div className="text-right">
                                        <div className="text-lg font-black text-slate-800">{client.subscriptions?.length || 0}</div>
                                        <div className="text-[10px] text-gray-400 uppercase font-black tracking-widest">Active Subs</div>
                                    </div>
                                    <ChevronRight className={`w-5 h-5 text-gray-300 transition-transform ${expandedClient === client.id ? 'rotate-90 text-primary' : ''}`} />
                                </div>
                            </div>

                            {/* Expanded Details */}
                            {expandedClient === client.id && (
                                <div className="border-t border-gray-100 bg-gray-50/50 p-6 space-y-6 animate-in slide-in-from-top-2 duration-300">
                                    <div className="flex justify-between items-center">
                                        <h4 className="font-bold text-slate-700 text-sm flex items-center gap-2 uppercase tracking-widest">
                                            <CreditCard className="w-4 h-4 text-primary" /> Active Contracts
                                        </h4>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); openFeatureModal(client); }}
                                            className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:text-primary hover:border-primary/30 transition-all shadow-sm"
                                        >
                                            <Settings className="w-3.5 h-3.5" /> Configure Features
                                        </button>
                                    </div>

                                    {client.subscriptions && client.subscriptions.length > 0 ? (
                                        <div className="grid gap-4 md:grid-cols-2">
                                            {client.subscriptions.map((sub: any) => (
                                                <div key={sub.id} className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm">
                                                    <div className="flex justify-between items-start mb-4">
                                                        <div>
                                                            <div className="flex items-center gap-2">
                                                                <h5 className="font-bold text-slate-800">{sub.plan_name}</h5>
                                                                <span className={`px-2 py-0.5 text-[8px] font-black rounded uppercase tracking-widest ${sub.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-400'
                                                                    }`}>{sub.status}</span>
                                                            </div>
                                                            <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase">TYPE: {sub.product_type || 'SEATS'}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center justify-between text-sm">
                                                        <div className="flex items-center gap-2">
                                                            <Users className="w-4 h-4 text-slate-300" />
                                                            <span className="text-xs font-bold text-slate-600">
                                                                {sub.total_seats} {sub.product_type === 'AD-HOC' ? 'Project Credits' : 'Total Seats'}
                                                            </span>
                                                        </div>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setSelectedSub(sub);
                                                            }}
                                                            className="text-[10px] font-black text-primary hover:bg-slate-50 px-3 py-1.5 rounded-lg border border-primary/20 transition-all uppercase tracking-widest"
                                                        >
                                                            View Details
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-6 bg-white rounded-xl border border-dashed border-gray-200">
                                            <p className="text-xs text-gray-400 font-medium">No active subscriptions found in record.</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                }) : (
                    <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-100">
                        <Building2 className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                        <p className="text-gray-500 font-medium">No clients found in Supabase.</p>
                        <button onClick={fetchClients} className="mt-4 text-primary font-bold text-sm hover:underline">Retry Connection</button>
                    </div>
                )}
            </div>

            {/* Subscription Detail Modal */}
            {selectedSub && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-[60] p-4 animate-in fade-in duration-300">
                    <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="p-10 space-y-8">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">{selectedSub.plan_name}</h2>
                                    <p className="text-xs font-black text-primary uppercase tracking-widest mt-1">Management Console</p>
                                </div>
                                <button onClick={() => setSelectedSub(null)} className="p-2 hover:bg-slate-100 rounded-xl transition-all"><X className="w-6 h-6 text-slate-400" /></button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Inventory & Usage</p>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-end">
                                            <span className="text-sm font-bold text-slate-600">Total Capacity</span>
                                            <span className="text-xl font-black text-slate-900">{selectedSub.total_seats}</span>
                                        </div>
                                        <div className="flex justify-between items-end">
                                            <span className="text-sm font-bold text-slate-600">Used {selectedSub.product_type}</span>
                                            <span className="text-xl font-black text-indigo-600">342</span>
                                        </div>
                                        <div className="pt-2">
                                            <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                                                <div className="h-full bg-primary rounded-full" style={{ width: '68%' }}></div>
                                            </div>
                                            <p className="text-[10px] text-slate-400 font-bold mt-2">68% Utilization Rate</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="p-6 border border-slate-100 rounded-3xl space-y-1">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Product Type</p>
                                        <div className="flex items-center gap-2">
                                            <CreditCard className="w-4 h-4 text-primary" />
                                            <span className="font-black text-slate-900">{selectedSub.product_type || 'SEATS'}</span>
                                        </div>
                                    </div>
                                    <div className="p-6 border border-slate-100 rounded-3xl space-y-1">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Contract Status</p>
                                        <div className="flex items-center gap-2">
                                            <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></div>
                                            <span className="font-black text-slate-900 uppercase tracking-wider text-xs">Active & Valid</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-amber-50 rounded-2xl p-6 border border-amber-100 flex items-start gap-4">
                                <Users className="w-6 h-6 text-amber-600 shrink-0" />
                                <div>
                                    <p className="text-xs font-bold text-amber-900">Seat Allocation Optimization</p>
                                    <p className="text-[11px] text-amber-700 leading-relaxed mt-1">
                                        The current users per seat ratio is <strong>2.0</strong>. You can still assign up to <strong>158</strong> more users before reaching the soft limit of this contract.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-4 items-center">
                                <div className="flex-1 bg-slate-50 rounded-[1.5rem] p-4 border border-slate-100 flex items-center justify-between">
                                    <span className="text-xs font-bold text-slate-500 ml-2">Extra {selectedSub.product_type === 'AD-HOC' ? 'Credits' : 'Seats'}</span>
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => setSeatIncrement(Math.max(1, seatIncrement - 10))}
                                            className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center font-bold text-slate-400 hover:text-primary transition-colors"
                                        >
                                            -
                                        </button>
                                        <span className="text-sm font-black text-slate-900 w-8 text-center">{seatIncrement}</span>
                                        <button
                                            onClick={() => setSeatIncrement(seatIncrement + 10)}
                                            className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center font-bold text-slate-400 hover:text-primary transition-colors"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                                <button
                                    onClick={handleAddSeats}
                                    disabled={isUpdatingSeats}
                                    className="flex-[1.5] py-4 bg-slate-900 text-white rounded-[1.5rem] font-black text-sm hover:bg-slate-800 transition-all shadow-xl active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isUpdatingSeats ? (
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    ) : (
                                        <>Add {seatIncrement} {selectedSub.product_type === 'AD-HOC' ? 'Credits' : 'Seats'}</>
                                    )}
                                </button>
                            </div>
                            <button
                                className="w-full py-4 bg-slate-100 text-slate-600 rounded-[1.5rem] font-black text-sm hover:bg-slate-200 transition-all active:scale-95"
                            >
                                Export Usage Report
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Feature Config Modal */}
            {featureModalOpen && selectedClientForFeatures && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[70] p-4 animate-in fade-in duration-300">
                    <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <div>
                                <h2 className="font-black text-xl text-slate-900 tracking-tight">Feature Configuration</h2>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-0.5">{selectedClientForFeatures.name}</p>
                            </div>
                            <button onClick={() => setFeatureModalOpen(false)} className="p-2 hover:bg-white rounded-xl transition-colors"><X className="w-5 h-5 text-gray-400" /></button>
                        </div>
                        <div className="p-8 space-y-6">
                            <div className="grid grid-cols-1 gap-4">
                                {[
                                    { key: 'hrisSync', label: 'HRIS Auto-Sync', desc: 'Automatically sync user data from HR systems.' },
                                    { key: 'fundae', label: 'FUNDAE Reporting', desc: 'Enable compliant formatting for FUNDAE exports.' },
                                    { key: 'advancedExports', label: 'Advanced Analytics', desc: 'Access to raw data exports and BI tools.' },
                                    { key: 'ltiIntegration', label: 'LTI 1.3 Provider', desc: 'Allow this tenant to launch content via LTI.' },
                                    { key: 'xapiTracking', label: 'xAPI Statements', desc: 'Emit xAPI statements for external LRS.' }
                                ].map((feature) => (
                                    <div key={feature.key} className="flex justify-between items-center p-3 hover:bg-slate-50 rounded-xl transition-colors">
                                        <div>
                                            <p className="text-sm font-bold text-slate-700">{feature.label}</p>
                                            <p className="text-xs text-gray-400 font-medium">{feature.desc}</p>
                                        </div>
                                        <button
                                            onClick={() => setCurrentFeatures({ ...currentFeatures, [feature.key]: !currentFeatures[feature.key as keyof typeof currentFeatures] })}
                                            className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-300 cursor-pointer ${currentFeatures[feature.key as keyof typeof currentFeatures] ? 'bg-primary' : 'bg-slate-200'}`}
                                        >
                                            <div
                                                className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ${currentFeatures[feature.key as keyof typeof currentFeatures] ? 'translate-x-5' : ''}`}
                                            ></div>
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <div className="pt-4 border-t border-gray-100 flex gap-3">
                                <button
                                    onClick={() => setFeatureModalOpen(false)}
                                    className="flex-1 py-3 bg-white border border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition-all text-sm"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={saveFeatures}
                                    className="flex-1 py-3 bg-slate-900 text-white font-black rounded-xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10 text-sm flex items-center justify-center gap-2"
                                >
                                    <Save className="w-4 h-4" /> Save Configuration
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Create Client Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
                    <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <h2 className="font-black text-xl text-slate-900 tracking-tight">New Client Partnership</h2>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white rounded-xl transition-colors"><X className="w-5 h-5 text-gray-400" /></button>
                        </div>
                        <form onSubmit={handleCreateClient} className="p-8 space-y-6">
                            <div className="space-y-1">
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Company Name</label>
                                <input
                                    required
                                    className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                    placeholder="e.g. Acme Corp"
                                    value={newClient.name}
                                    onChange={e => setNewClient({ ...newClient, name: e.target.value, slug: e.target.value.toLowerCase().replace(/ /g, '-') })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Slug (ID)</label>
                                    <input
                                        required
                                        className="w-full bg-gray-100 border-none rounded-2xl px-4 py-3 text-sm font-bold text-gray-400 cursor-not-allowed"
                                        value={newClient.slug}
                                        readOnly
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Domain</label>
                                    <input
                                        className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                        placeholder="acme.com"
                                        value={newClient.domain}
                                        onChange={e => setNewClient({ ...newClient, domain: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Contact Email</label>
                                <input
                                    type="email"
                                    required
                                    className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                    placeholder="hr@acme.com"
                                    value={newClient.contact_email}
                                    onChange={e => setNewClient({ ...newClient, contact_email: e.target.value })}
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Industry Sector</label>
                                <select
                                    className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
                                    value={newClient.industry}
                                    onChange={e => setNewClient({ ...newClient, industry: e.target.value })}
                                >
                                    <option>Technology</option>
                                    <option>Banking</option>
                                    <option>Education</option>
                                    <option>Retail</option>
                                    <option>Fashion</option>
                                </select>
                            </div>
                            <div className="pt-4">
                                <button type="submit" className="w-full py-4 bg-slate-900 text-white font-black rounded-[2rem] hover:bg-slate-800 flex items-center justify-center gap-2 shadow-xl shadow-slate-900/20 active:scale-95 transition-all">
                                    <Save className="w-4 h-4" /> Finalize Partnership
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
