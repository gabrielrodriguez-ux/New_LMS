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
        gradient: "from-blue-500 to-indigo-600",
        iconColor: "text-white",
        status: "In Progress"
    },
    {
        id: "456",
        title: "Digital Marketing Mastery",
        module: "Module 2: SEO Fundamentals",
        progress: 30,
        totalHours: 25,
        gradient: "from-purple-500 to-pink-500",
        iconColor: "text-white",
        status: "In Progress"
    },
    {
        id: "789",
        title: "Leadership & Management",
        module: "Completed",
        progress: 100,
        totalHours: 15,
        gradient: "from-emerald-500 to-teal-500",
        iconColor: "text-white",
        status: "Completed"
    },
    {
        id: "101",
        title: "Data Science for Business",
        module: "Not Started",
        progress: 0,
        totalHours: 35,
        gradient: "from-orange-500 to-red-500",
        iconColor: "text-white",
        status: "Assigned"
    }
];

export default function MyCoursesPage() {
    return (
        <div className="min-h-screen bg-surface-muted">
            <Navbar />

            <main className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
                    <h1 className="text-2xl sm:text-3xl font-bold">My Courses</h1>

                    <div className="flex gap-1 sm:gap-2 bg-white p-0.5 sm:p-1 rounded-lg border border-gray-200 w-full sm:w-auto overflow-x-auto">
                        <button
                            aria-label="Filter: All courses"
                            className="flex-1 sm:flex-none px-3 sm:px-4 py-1.5 sm:py-2 bg-primary text-white text-xs sm:text-sm font-medium rounded-md shadow-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary whitespace-nowrap"
                        >
                            All
                        </button>
                        <button
                            aria-label="Filter: In progress courses"
                            className="flex-1 sm:flex-none px-3 sm:px-4 py-1.5 sm:py-2 text-gray-600 hover:bg-gray-50 text-xs sm:text-sm font-medium rounded-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 whitespace-nowrap"
                        >
                            In Progress
                        </button>
                        <button
                            aria-label="Filter: Completed courses"
                            className="flex-1 sm:flex-none px-3 sm:px-4 py-1.5 sm:py-2 text-gray-600 hover:bg-gray-50 text-xs sm:text-sm font-medium rounded-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 whitespace-nowrap"
                        >
                            Completed
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {COURSES.map((course) => (
                        <div key={course.id} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all group">
                            {/* Cover Area */}
                            <div className={`h-36 sm:h-48 bg-gradient-to-br ${course.gradient} relative flex items-center justify-center p-6 sm:p-8`}>
                                <BookOpen className={`w-12 h-12 sm:w-16 sm:h-16 ${course.iconColor} opacity-60 group-hover:scale-110 transition-transform`} />
                                <div className="absolute top-3 sm:top-4 right-3 sm:right-4 bg-white/90 backdrop-blur px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold shadow-sm">
                                    {course.totalHours}h
                                </div>
                            </div>

                            <div className="p-4 sm:p-6">
                                <div className="flex justify-between items-start mb-3 sm:mb-4">
                                    <div>
                                        <span className={`inline-block px-2 py-0.5 sm:py-1 rounded text-[9px] sm:text-[10px] font-bold uppercase tracking-wider mb-1 sm:mb-2 ${course.status === 'Completed' ? 'bg-green-100 text-green-700' :
                                            course.status === 'In Progress' ? 'bg-blue-50 text-blue-700' : 'bg-gray-100 text-gray-600'
                                            }`}>
                                            {course.status}
                                        </span>
                                        <h3 className="text-base sm:text-lg font-bold leading-tight min-h-[2.5rem] sm:min-h-[3rem] line-clamp-2">{course.title}</h3>
                                    </div>
                                    <button
                                        aria-label="Course options menu"
                                        className="text-gray-400 hover:text-gray-600 cursor-pointer focus:outline-none focus:ring-2 focus:ring-gray-300 rounded p-1"
                                    >
                                        <MoreVertical className="w-4 h-4 sm:w-5 sm:h-5" />
                                    </button>
                                </div>

                                <p className="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4 flex items-center gap-2">
                                    <Clock className="w-3 h-3 sm:w-4 sm:h-4" /> {course.module}
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
