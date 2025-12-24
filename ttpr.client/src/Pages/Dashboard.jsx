import { useEffect, useState } from "react";
import { fetchWithAuth } from "../fetchWithAuth";
import Projects from "../Components/Projects";
import Tasks from "../Components/Tasks";

const API_URL = import.meta.env.VITE_API_URL;

export default function Dashboard() {
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [loading, setLoading] = useState(true);

    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [projectProgressMap, setProjectProgressMap] = useState({});

    const loadProjects = async () => {
        const res = await fetchWithAuth(`${API_URL}/api/projects`);
        if (res.ok) {
            const data = await res.json();
            setProjects(data);

            const progressMap = {};
            await Promise.all(data.map(async (p) => {
                const resProgress = await fetchWithAuth(`${API_URL}/api/projects/progress/${p.id}`);
                if (resProgress.ok) {
                    const progress = parseFloat((await resProgress.json()).message);
                    progressMap[p.id] = progress;
                } else {
                    progressMap[p.id] = 0;
                }
            }));
            setProjectProgressMap(progressMap);
        }
    };

    useEffect(() => {
        const init = async () => {
            const authRes = await fetchWithAuth(`${API_URL}/api/Auth`);
            if (!authRes.ok) {
                setLoading(false);
                return;
            }

            setIsAuthorized(true);
            await loadProjects();
            setLoading(false);
        };

        init();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        window.location.reload();
    };

    if (loading) return <p className="text-white">Loading...</p>;
    if (!isAuthorized) return <p className="text-white">Not authorized.</p>;

    return (
        <div className="min-h-screen p-8">
            <div className="fixed inset-0 -z-10 animate-[gradientMove_15s_linear_infinite] bg-gradient-to-r from-slate-900 via-gray-900 to-zinc-900 bg-[length:200%_200%]"></div>
            <div className="mx-auto max-w-6xl rounded-3xl border border-white/20 bg-white/10 p-8 shadow-lg backdrop-blur-lg">
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
                        <p className="text-white/70">
                            {selectedProject ? "Your Tasks" : "Your Projects"}
                        </p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="rounded-xl border border-white/20 bg-white/20 px-4 py-2 text-white shadow backdrop-blur-lg transition hover:bg-white/30"
                    >
                        Disconnect
                    </button>
                </div>
                <div className="animate-[fadeIn_0.15s_ease-out]">
                    {selectedProject === null ? (
                        <Projects
                            projects={projects}
                            setProjects={setProjects}
                            onSelectProject={(p) => setSelectedProject(p)}
                            reloadProjects={loadProjects}
                            projectProgressMap={projectProgressMap}
                        />
                    ) : (
                        <Tasks
                            project={selectedProject}
                            onBack={async () => {
                                setSelectedProject(null);
                                await loadProjects();
                            }}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
