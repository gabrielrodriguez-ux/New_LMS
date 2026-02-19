"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, ArrowRight } from "lucide-react";

export default function LoginPage() {
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
            router.push("/dashboard");
        }, 1000);
    };

    return (
        <main className="min-h-screen flex">
            {/* Left Side - Brand */}
            <div className="hidden lg:flex lg:w-1/2 bg-primary relative items-center justify-center p-12 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary-light z-0 opacity-90" />
                {/* Abstract decorative circles matching branding */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-secondary opacity-10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent opacity-10 rounded-full blur-2xl transform -translate-x-1/2 translate-y-1/2"></div>

                <div className="relative z-10 text-white max-w-lg">
                    <h1 className="text-5xl font-bold mb-6">La escuela que lidera la revolución en la educación.</h1>
                    <p className="text-xl text-gray-300">
                        Transform your business skills with world-class education designed for the modern professional.
                    </p>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-primary text-secondary mb-4">
                            <span className="text-3xl font-bold">P</span>
                        </div>
                        <h2 className="text-3xl font-bold text-primary">Welcome Back</h2>
                        <p className="mt-2 text-gray-500">Sign in to continue your learning journey</p>
                    </div>

                    <button
                        aria-label="Log in with Enterprise SSO"
                        className="w-full flex items-center justify-center gap-3 bg-[#e0314a] hover:bg-[#c9253d] text-white p-3 rounded-lg font-medium transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#e0314a]"
                    >
                        <Lock className="w-5 h-5" />
                        Log in with Enterprise SSO
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
                            <label htmlFor="email-input" className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="email-input"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-secondary outline-none transition-shadow"
                                    placeholder="name@company.com"
                                    required
                                    aria-label="Email address"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password-input" className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="password-input"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-secondary outline-none transition-shadow"
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
                                    className="h-4 w-4 text-primary focus:ring-secondary border-gray-300 rounded"
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                                    Remember me
                                </label>
                            </div>

                            <div className="text-sm">
                                <a href="#" className="font-medium text-primary hover:text-primary-light cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary rounded">
                                    Forgot your password?
                                </a>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            aria-label="Log in to your account"
                            className="w-full flex items-center justify-center p-3 border border-transparent rounded-lg shadow-sm text-base font-medium text-primary bg-secondary hover:bg-secondary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                        >
                            {loading ? "Signing in..." : "Log in"}
                            {!loading && <ArrowRight className="ml-2 w-5 h-5" />}
                        </button>
                    </form>

                    <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                        <h4 className="text-sm font-semibold text-gray-700 mb-2">Demo Accounts:</h4>
                        <div className="text-sm text-gray-600 space-y-1">
                            <p><span className="font-mono">student@thepower.edu</span> (Student View)</p>
                            <p><span className="font-mono">admin@thepower.edu</span> (Admin View)</p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
