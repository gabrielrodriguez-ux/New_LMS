"use client";

import Navbar from "@/components/Navbar";
import { MOCK_CLIENTS } from "@/lib/mock-data";
import { Building2, BookOpen, Clock, CheckCircle2, PlayCircle } from "lucide-react";

export default function ClientProgramsDebugPage() {
    return (
        <div className="min-h-screen bg-surface-muted">
            <Navbar />

            <main className="max-w-7xl mx-auto p-6 md:p-8">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-primary mb-2">Debug: Client Programs</h1>
                    <p className="text-gray-500">Visualizing mocked B2B data for clients and their programs.</p>
                </header>

                <div className="space-y-12">
                    {MOCK_CLIENTS.map((client) => (
                        <section key={client.id} className="space-y-6">
                            <div className="flex items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                <div className="w-16 h-16 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 border border-gray-100">
                                    <Building2 className="w-8 h-8" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">{client.name}</h2>
                                    <p className="text-gray-500 flex items-center gap-2">
                                        <span className="px-2 py-0.5 bg-gray-100 rounded text-xs font-semibold uppercase tracking-wider">{client.industry}</span>
                                        <span>•</span>
                                        <span>{client.programs.length} Active Programs</span>
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {client.programs.map((program) => (
                                    <div key={program.id} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 group hover:shadow-md transition-all">
                                        <div className={`h-32 ${program.imageColor} relative flex items-center justify-center`}>
                                            <BookOpen className={`w-12 h-12 ${program.iconColor} opacity-50 group-hover:scale-110 transition-transform`} />
                                        </div>

                                        <div className="p-6">
                                            <div className="flex justify-between items-start mb-4">
                                                <span className={`inline-block px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${program.status === 'Completed' ? 'bg-green-100 text-green-700' :
                                                        program.status === 'In Progress' ? 'bg-blue-50 text-blue-700' : 'bg-gray-100 text-gray-600'
                                                    }`}>
                                                    {program.status}
                                                </span>
                                            </div>

                                            <h3 className="text-lg font-bold leading-tight mb-4 line-clamp-2 h-12">{program.name}</h3>

                                            <div className="space-y-4">
                                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                                    <Clock className="w-4 h-4" />
                                                    <span>Started: {new Date(program.startDate).toLocaleDateString()}</span>
                                                </div>

                                                <div className="space-y-2">
                                                    <div className="flex justify-between text-xs font-medium">
                                                        <span className="text-gray-500">Progress</span>
                                                        <span className="text-primary">{program.progress}%</span>
                                                    </div>
                                                    <div className="w-full bg-gray-100 rounded-full h-2">
                                                        <div
                                                            className={`h-2 rounded-full transition-all duration-1000 ${program.progress === 100 ? 'bg-green-500' : 'bg-secondary'}`}
                                                            style={{ width: `${program.progress}%` }}
                                                        ></div>
                                                    </div>
                                                </div>

                                                <div className="pt-4 border-t border-gray-50">
                                                    <button className="flex items-center justify-center gap-2 w-full py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-light transition-colors">
                                                        {program.status === 'Completed' ? <CheckCircle2 className="w-4 h-4" /> : <PlayCircle className="w-4 h-4" />}
                                                        {program.status === 'Completed' ? 'View Certificate' : 'Continue Learning'}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    ))}
                </div>
            </main>
        </div>
    );
}
