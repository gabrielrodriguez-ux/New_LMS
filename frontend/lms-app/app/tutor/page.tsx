"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, ArrowRight, GraduationCap } from "lucide-react";

export default function TutorLoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Mock login delay
        setTimeout(() => {
            setLoading(false);
            router.push("/tutor/my-courses");
        }, 1000);
    };

    return (
        <main className="min-h-screen flex">
            {/* Left Side - Brand */}
            <div className="hidden lg:flex lg:w-1/2 bg-[#1e3740] relative items-center justify-center p-12 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#1e3740] to-[#2c4d59] z-0 opacity-90" />
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#a1e6c5] opacity-10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#76c7c0] opacity-10 rounded-full blur-2xl transform -translate-x-1/2 translate-y-1/2"></div>

                <div className="relative z-10 text-white max-w-lg">
                    <h1 className="text-5xl font-bold mb-6 italic">Tutor Portal.</h1>
                    <p className="text-xl text-gray-300">
                        Guide the next generation of leaders. Manage your sessions and student community in one place.
                    </p>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-[#1e3740] text-[#a1e6c5] mb-4">
                            <GraduationCap className="w-8 h-8" />
                        </div>
                        <h2 className="text-3xl font-bold text-[#1e3740]">Tutor Sign In</h2>
                        <p className="mt-2 text-gray-500">Access your assigned programs and student messages</p>
                    </div>

                    <button
                        aria-label="Log in with Education SSO"
                        className="w-full flex items-center justify-center gap-3 bg-[#e0314a] hover:bg-[#c9253d] text-white p-3 rounded-lg font-medium transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#e0314a]"
                    >
                        <Lock className="w-5 h-5" />
                        Log in with Education SSO
                    </button>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">or sign in with email</span>
                        </div>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label htmlFor="tutor-email-input" className="block text-sm font-medium text-gray-700 mb-2">Work Email</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="tutor-email-input"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a1e6c5] focus:border-[#a1e6c5] outline-none transition-shadow"
                                    placeholder="tutor@thepower.edu"
                                    required
                                    aria-label="Work email address"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="tutor-password-input" className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="tutor-password-input"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a1e6c5] focus:border-[#a1e6c5] outline-none transition-shadow"
                                    placeholder="••••••••"
                                    required
                                    aria-label="Password"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 text-[#1e3740] focus:ring-[#a1e6c5] border-gray-300 rounded"
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                                    Remember me
                                </label>
                            </div>

                            <div className="text-sm">
                                <a href="#" className="font-medium text-[#1e3740] hover:text-[#2c4d59] cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#1e3740] rounded">
                                    Forgot your password?
                                </a>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            aria-label="Access Tutor Dashboard"
                            className="w-full flex items-center justify-center p-3 border border-transparent rounded-lg shadow-sm text-base font-bold text-[#1e3740] bg-[#a1e6c5] hover:bg-[#8fd9b6] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#a1e6c5] transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                        >
                            {loading ? "Signing in..." : "Access Tutor Dashboard"}
                            {!loading && <ArrowRight className="ml-2 w-5 h-5" />}
                        </button>
                    </form>
                </div>
            </div>
        </main>
    );
}
