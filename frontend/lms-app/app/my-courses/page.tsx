"use client";

import Navbar from "@/components/Navbar";
import Link from "next/link";
import { BookOpen, Clock, MoreVertical, PlayCircle } from "lucide-react";

const COURSES = [
    {
        id: "eb15e6a0-3214-4ab4-95b4-2c832dec2639",
        title: "ThePowerMBA - Business Strategy",
        module: "Module 4: Market Analysis",
        progress: 65,
        totalHours: 40,
        imageColor: "bg-blue-100",
        iconColor: "text-blue-600",
        status: "In Progress"
    },
    {
        id: "456",
        title: "Digital Marketing Mastery",
        module: "Module 2: SEO Fundamentals",
        progress: 30,
        totalHours: 25,
        imageColor: "bg-purple-100",
        iconColor: "text-purple-600",
        status: "In Progress"
    },
    {
        id: "789",
        title: "Leadership & Management",
        module: "Completed",
        progress: 100,
        totalHours: 15,
        imageColor: "bg-green-100",
        iconColor: "text-green-600",
        status: "Completed"
    },
    {
        id: "101",
        title: "Data Science for Business",
        module: "Not Started",
        progress: 0,
        totalHours: 35,
        imageColor: "bg-orange-100",
        iconColor: "text-orange-600",
        status: "Assigned"
    }
];

export default function MyCoursesPage() {
    return (
        <div className="min-h-screen bg-surface-muted">
            <Navbar />

            <main className="max-w-7xl mx-auto p-6 md:p-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <h1 className="text-3xl font-bold">My Courses</h1>

                    <div className="flex gap-2 bg-white p-1 rounded-lg border border-gray-200">
                        <button
                            aria-label="Filter: All courses"
                            className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-md shadow-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                        >
                            All
                        </button>
                        <button
                            aria-label="Filter: In progress courses"
                            className="px-4 py-2 text-gray-600 hover:bg-gray-50 text-sm font-medium rounded-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300"
                        >
                            In Progress
                        </button>
                        <button
                            aria-label="Filter: Completed courses"
                            className="px-4 py-2 text-gray-600 hover:bg-gray-50 text-sm font-medium rounded-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300"
                        >
                            Completed
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {COURSES.map((course) => (
                        <div key={course.id} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all group">
                            {/* Cover Area */}
                            <div className={`h-48 ${course.imageColor} relative flex items-center justify-center p-8`}>
                                <BookOpen className={`w-16 h-16 ${course.iconColor} opacity-50 group-hover:scale-110 transition-transform`} />
                                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                                    {course.totalHours}h
                                </div>
                            </div>

                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <span className={`inline-block px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider mb-2 ${course.status === 'Completed' ? 'bg-green-100 text-green-700' :
                                            course.status === 'In Progress' ? 'bg-blue-50 text-blue-700' : 'bg-gray-100 text-gray-600'
                                            }`}>
                                            {course.status}
                                        </span>
                                        <h3 className="text-lg font-bold leading-tight min-h-[3rem] line-clamp-2">{course.title}</h3>
                                    </div>
                                    <button
                                        aria-label="Course options menu"
                                        className="text-gray-400 hover:text-gray-600 cursor-pointer focus:outline-none focus:ring-2 focus:ring-gray-300 rounded"
                                    >
                                        <MoreVertical className="w-5 h-5" />
                                    </button>
                                </div>

                                <p className="text-sm text-gray-500 mb-4 flex items-center gap-2">
                                    <Clock className="w-4 h-4" /> {course.module}
                                </p>

                                {/* Progress Bar */}
                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs font-medium">
                                        <span className="text-gray-500">Progress</span>
                                        <span className="text-primary">{course.progress}%</span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-2">
                                        <div
                                            className={`h-2 rounded-full transition-all duration-1000 ${course.progress === 100 ? 'bg-green-500' : 'bg-secondary'}`}
                                            style={{ width: `${course.progress}%` }}
                                        ></div>
                                    </div>
                                </div>

                                <div className="mt-6 pt-4 border-t border-gray-50">
                                    <Link
                                        href={`/dashboard/courses/${course.id}`}
                                        aria-label={course.progress === 0 ? `Start ${course.title}` : course.progress === 100 ? `Review ${course.title}` : `Continue ${course.title}`}
                                        className="flex items-center justify-center gap-2 w-full py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary-light transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                                    >
                                        {course.progress === 0 ? 'Start Course' : course.progress === 100 ? 'Review Course' : 'Continue'}
                                        <PlayCircle className="w-4 h-4" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}
