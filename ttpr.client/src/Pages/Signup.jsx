import { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

function Signup() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`${API_URL}/api/Auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                setMessage("Signup successful!");
            } else {
                const errorData = await response.json();
                setMessage(`Error: ${errorData.message || "Signup failed"}`);
            }
        } catch (err) {
            setMessage("Network error: Could not reach server");
            console.error(err);
        }
    };

    return (
        <div className="relative flex min-h-screen items-center justify-center">
            <div className="fixed inset-0 -z-10 animate-[gradientMove_15s_linear_infinite]
            bg-gradient-to-r from-slate-900 via-gray-900 to-zinc-900
            bg-[length:200%_200%]"></div>
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-sm rounded-2xl border border-white/20 bg-white/10 p-6 shadow-lg backdrop-blur-lg"
            >
                <h2 className="mb-6 text-center text-2xl font-bold text-white">Sign Up</h2>

                <label className="mb-4 block text-white/80">
                    Email
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="mt-1 block w-full rounded-xl bg-white/20 px-3 py-2 text-white placeholder-white/50 border border-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="you@example.com"
                    />
                </label>

                <label className="mb-6 block text-white/80">
                    Password
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="mt-1 block w-full rounded-xl bg-white/20 px-3 py-2 text-white placeholder-white/50 border border-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="••••••••"
                    />
                </label>

                <button
                    type="submit"
                    className="w-full rounded-xl bg-blue-500 py-2 text-white shadow transition hover:bg-blue-600"
                >
                    Sign Up
                </button>

                {message && (
                    <p className="mt-4 text-center text-sm text-red-400">{message}</p>
                )}
                <p className="mt-4 text-center text-sm text-white/70">
                    Already have an account?{' '}
                    <a href="/login" className="text-indigo-400 hover:underline">
                        Login
                    </a>
                </p>
            </form>
        </div>
    );
}

export default Signup