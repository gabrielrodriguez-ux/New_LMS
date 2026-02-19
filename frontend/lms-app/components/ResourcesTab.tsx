"use client";

import { FileText, Download, ExternalLink, FilePieChart, Book, HelpCircle } from "lucide-react";

interface Resource {
    id: string;
    title: string;
    description: string;
    type: 'pdf' | 'doc' | 'link' | 'excel';
    size?: string;
    category: 'Materials' | 'Case Studies' | 'Optional';
}

const RESOURCES: Resource[] = [
    {
        id: "1",
        title: "Marketing Fundamentals Slides",
        description: "Core concepts, the 4 Ps, and brand strategy framework.",
        type: "pdf",
        size: "2.4 MB",
        category: "Materials"
    },
    {
        id: "2",
        title: "Workbook Exercise 3: Target Audience",
        description: "Complete this worksheet after watching the second module.",
        type: "doc",
        size: "450 KB",
        category: "Materials"
    },
    {
        id: "3",
        title: "Case Study: Nike's Digital Transformation",
        description: "In-depth analysis of Nike's shift to D2C strategy.",
        type: "pdf",
        size: "1.2 MB",
        category: "Case Studies"
    },
    {
        id: "4",
        title: "Competitive Analysis Template",
        description: "Excel sheet to map your key competitors.",
        type: "excel",
        size: "156 KB",
        category: "Materials"
    },
    {
        id: "5",
        title: "The Future of Digital Marketing 2025",
        description: "External article from HBR on upcoming trends.",
        type: "link",
        category: "Optional"
    }
];

export default function ResourcesTab() {
    const categories = ["Materials", "Case Studies", "Optional"] as const;

    const getIcon = (type: Resource['type']) => {
        switch (type) {
            case 'pdf': return <FileText className="w-5 h-5 text-red-500" />;
            case 'doc': return <Book className="w-5 h-5 text-blue-500" />;
            case 'excel': return <FilePieChart className="w-5 h-5 text-green-500" />;
            case 'link': return <ExternalLink className="w-5 h-5 text-purple-500" />;
            default: return <HelpCircle className="w-5 h-5 text-gray-400" />;
        }
    };

    const getBg = (type: Resource['type']) => {
        switch (type) {
            case 'pdf': return 'bg-red-50';
            case 'doc': return 'bg-blue-50';
            case 'excel': return 'bg-green-50';
            case 'link': return 'bg-purple-50';
            default: return 'bg-gray-50';
        }
    };

    return (
        <div className="max-w-4xl animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="space-y-10">
                {categories.map((category) => {
                    const filtered = RESOURCES.filter(r => r.category === category);
                    if (filtered.length === 0) return null;

                    return (
                        <div key={category}>
                            <h3 className="text-lg font-bold text-primary mb-5 flex items-center gap-2">
                                <span className="w-2 h-6 bg-secondary rounded-full"></span>
                                {category}
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {filtered.map((resource) => (
                                    <div
                                        key={resource.id}
                                        className="flex flex-col p-5 bg-white border border-gray-200 rounded-2xl hover:border-secondary hover:shadow-xl hover:shadow-secondary/10 transition-all group cursor-pointer relative overflow-hidden"
                                    >
                                        <div className="flex items-start justify-between mb-3">
                                            <div className={`w-12 h-12 ${getBg(resource.type)} rounded-xl flex items-center justify-center transition-transform group-hover:scale-110`}>
                                                {getIcon(resource.type)}
                                            </div>
                                            <button className="p-2 text-gray-400 hover:text-primary hover:bg-gray-100 rounded-full transition-colors">
                                                {resource.type === 'link' ? <ExternalLink className="w-5 h-5" /> : <Download className="w-5 h-5" />}
                                            </button>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900 group-hover:text-primary transition-colors leading-snug">
                                                {resource.title}
                                            </h4>
                                            <p className="text-xs text-gray-500 mt-2 line-clamp-2 leading-relaxed">
                                                {resource.description}
                                            </p>
                                        </div>
                                        <div className="mt-4 flex items-center justify-between pt-4 border-t border-gray-50">
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{resource.type}</span>
                                            {resource.size && <span className="text-[10px] font-bold text-gray-400">{resource.size}</span>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
