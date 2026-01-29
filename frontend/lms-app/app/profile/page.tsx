"use client";

import Navbar from "@/components/Navbar";
import { User, Mail, Shield, Award, Clock, MapPin, Camera } from "lucide-react";
import { useState } from "react";

import TalentWheel from "@/components/TalentWheel"; // Added import

export default function ProfilePage() {
    const [isEditing, setIsEditing] = useState(false);
    const [user, setUser] = useState({
        firstName: "Gabriel",
        lastName: "Rodriguez",
        email: "student@thepower.edu",
        role: "Student",
        location: "Madrid, Spain",
        bio: "Passionate about Digital Marketing and Business Strategy. Always learning.",
        interests: ["Marketing", "Data Science", "Leadership"]
    });

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        setIsEditing(false);
        // Here we would sync with iam-service
        alert("Profile saved successfully!");
    };

    return (
        <div className="min-h-screen bg-surface-muted">
            <Navbar />

            <main className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8">
                <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">My Profile</h1>

                {/* NEW: Talent Wheel in Profile */}
                <section className="mb-6 sm:mb-10">
                    <TalentWheel />
                </section>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
                    {/* Sidebar - Avatar & Stats */}
                    <div className="space-y-4 sm:space-y-6 order-2 md:order-1">
                        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
                            <div className="relative w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-3 sm:mb-4">
                                <div className="w-full h-full bg-gradient-to-br from-secondary to-accent rounded-full flex items-center justify-center text-3xl sm:text-4xl font-bold text-primary">
                                    GR
                                </div>
                                <button className="absolute bottom-0 right-0 p-1.5 sm:p-2 bg-primary text-white rounded-full hover:bg-primary-light transition-colors">
                                    <Camera className="w-3 h-3 sm:w-4 sm:h-4" />
                                </button>
                            </div>
                            <h2 className="text-lg sm:text-xl font-bold">{user.firstName} {user.lastName}</h2>
                            <p className="text-sm sm:text-base text-gray-500">{user.role}</p>

                            <div className="mt-4 sm:mt-6 flex justify-center gap-2 flex-wrap">
                                <span className="px-2 sm:px-3 py-1 bg-blue-50 text-blue-700 text-[10px] sm:text-xs font-semibold rounded-full">Pro Member</span>
                                <span className="px-2 sm:px-3 py-1 bg-green-50 text-green-700 text-[10px] sm:text-xs font-semibold rounded-full">Level 12</span>
                            </div>
                        </div>

                        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h3 className="font-bold mb-3 sm:mb-4 text-sm sm:text-base">Statistics</h3>
                            <div className="space-y-3 sm:space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 sm:gap-3 text-gray-600">
                                        <Award className="w-4 h-4 sm:w-5 sm:h-5 text-secondary-dark" />
                                        <span className="text-sm sm:text-base">XP Earned</span>
                                    </div>
                                    <span className="font-bold text-sm sm:text-base">4,250</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 sm:gap-3 text-gray-600">
                                        <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-secondary-dark" />
                                        <span className="text-sm sm:text-base">Learning Time</span>
                                    </div>
                                    <span className="font-bold text-sm sm:text-base">48h 20m</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 sm:gap-3 text-gray-600">
                                        <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-secondary-dark" />
                                        <span className="text-sm sm:text-base">Badges</span>
                                    </div>
                                    <span className="font-bold text-sm sm:text-base">12</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Form */}
                    <div className="md:col-span-2 order-1 md:order-2">
                        <div className="bg-white p-4 sm:p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3">
                                <h3 className="text-lg sm:text-xl font-bold">Personal Information</h3>
                                <button
                                    onClick={() => isEditing ? (document.getElementById('profile-form') as HTMLFormElement)?.requestSubmit() : setIsEditing(true)}
                                    className={`w-full sm:w-auto px-4 py-2 rounded-lg font-medium transition-colors text-sm sm:text-base ${isEditing
                                        ? "bg-secondary text-primary hover:bg-secondary-dark"
                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                        }`}
                                >
                                    {isEditing ? "Save Changes" : "Edit Profile"}
                                </button>
                            </div>

                            <form id="profile-form" onSubmit={handleSave} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                            <input
                                                type="text"
                                                disabled={!isEditing}
                                                value={user.firstName}
                                                onChange={e => setUser({ ...user, firstName: e.target.value })}
                                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary disabled:bg-gray-50 disabled:text-gray-500"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                            <input
                                                type="text"
                                                disabled={!isEditing}
                                                value={user.lastName}
                                                onChange={e => setUser({ ...user, lastName: e.target.value })}
                                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary disabled:bg-gray-50 disabled:text-gray-500"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                        <input
                                            type="email"
                                            disabled={true} // Email typically not editable
                                            value={user.email}
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                                        />
                                    </div>
                                    <p className="text-xs text-gray-400 mt-1">Contact admin to change email.</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                        <input
                                            type="text"
                                            disabled={!isEditing}
                                            value={user.location}
                                            onChange={e => setUser({ ...user, location: e.target.value })}
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary disabled:bg-gray-50 disabled:text-gray-500"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                                    <textarea
                                        disabled={!isEditing}
                                        value={user.bio}
                                        onChange={e => setUser({ ...user, bio: e.target.value })}
                                        className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary disabled:bg-gray-50 disabled:text-gray-500 h-32 resize-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Interests</label>
                                    <div className="flex flex-wrap gap-2">
                                        {user.interests.map((interest, i) => (
                                            <span key={i} className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700 flex items-center gap-1">
                                                {interest}
                                                {isEditing && (
                                                    <button
                                                        type="button"
                                                        onClick={() => setUser({ ...user, interests: user.interests.filter((_, idx) => idx !== i) })}
                                                        className="hover:text-red-500"
                                                    >
                                                        ×
                                                    </button>
                                                )}
                                            </span>
                                        ))}
                                        {isEditing && (
                                            <button type="button" className="px-3 py-1 border border-dashed border-gray-300 rounded-full text-sm text-gray-500 hover:border-secondary hover:text-secondary text-left">
                                                + Add Interest
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
