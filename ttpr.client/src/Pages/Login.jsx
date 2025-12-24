import { useState, useEffect } from "react";
import { Navigate } from "react-router"
import { fetchWithAuth } from "../fetchWithAuth";

export default function Login({ onLogin }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const [checkingAuth, setCheckingAuth] = useState(true);
    const [isAuthed, setIsAuthed] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem("accessToken");
            if (!token) {
                setCheckingAuth(false);
                return;
            }

            const response = await fetchWithAuth("https://localhost:7290/api/Auth");

            if (response.ok) {
                setIsAuthed(true);
                onLogin();
            } else {
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
            }

            setCheckingAuth(false);
        };

        checkAuth();
    }, []);

    if (checkingAuth) return <p>Checking authentication...</p>;

    if (isAuthed) {
        return <Navigate to="/dashboard" replace />;
    }

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("https://localhost:7290/api/Auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                const text = await response.text();
                setMessage(text || "Login failed");
                return;
            }

            const data = await response.json();
            localStorage.setItem("accessToken", data.accessToken);
            localStorage.setItem("refreshToken", data.refreshToken);

            setMessage("");
            onLogin();
            window.location.reload();

        } catch (err) {
            console.error(err);
            setMessage("Network error");
        }
    };

    return (
        <div className="relative flex min-h-screen items-center justify-center">
            <div className="fixed inset-0 -z-10 animate-[gradientMove_15s_linear_infinite]
            bg-gradient-to-r from-slate-900 via-gray-900 to-zinc-900
            bg-[length:200%_200%]"></div>

            <form
                onSubmit={handleLogin}
                className="w-full max-w-sm rounded-2xl border border-white/20 bg-white/10 p-6 shadow-lg backdrop-blur-lg"
            >
                <h2 className="mb-6 text-center text-2xl font-bold text-white">Login</h2>

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
                    Login
                </button>

                {message && (
                    <p className="mt-4 text-center text-sm text-red-400">{message}</p>
                )}

                <p className="mt-4 text-center text-sm text-white/70">
                    Don't have an account?{' '}
                    <a href="/signup" className="text-indigo-400 hover:underline">
                        Sign Up
                    </a>
                </p>
            </form>
        </div>
    );
}
