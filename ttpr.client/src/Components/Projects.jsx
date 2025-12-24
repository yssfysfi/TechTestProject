import { useMemo, useState } from "react";
import { fetchWithAuth } from "../fetchWithAuth";
import { FiEdit, FiTrash2 } from "react-icons/fi";

const PAGE_SIZE = 6;

export default function Projects({
    projects,
    setProjects,
    onSelectProject,
    reloadProjects,
    projectProgressMap
}) {
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);

    const [showAddModal, setShowAddModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);

    const [projectName, setProjectName] = useState("");
    const [projectDescription, setProjectDescription] = useState("");

    const [updatingProjectId, setUpdatingProjectId] = useState(null);
    const [updateTitle, setUpdateTitle] = useState("");
    const [updateDescription, setUpdateDescription] = useState("");

    const filteredProjects = useMemo(() => {
        return projects.filter(p =>
            p.title.toLowerCase().includes(search.toLowerCase())
        );
    }, [projects, search]);

    const totalPages = Math.max(
        1,
        Math.ceil(filteredProjects.length / PAGE_SIZE)
    );

    const paginatedProjects = filteredProjects.slice(
        (page - 1) * PAGE_SIZE,
        page * PAGE_SIZE
    );

    const handleCreateProject = async () => {
        if (!projectName.trim()) return;

        const res = await fetchWithAuth("https://localhost:7290/api/projects", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                title: projectName,
                description: projectDescription
            })
        });

        if (!res.ok) return;

        setShowAddModal(false);
        setProjectName("");
        setProjectDescription("");
        await reloadProjects();
    };

    const handleDeleteProject = async (projectId) => {
        if (!confirm("Delete this project?")) return;

        const res = await fetchWithAuth(
            `https://localhost:7290/api/projects/${projectId}`,
            {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ProjectId: projectId,
                })
            }
        );

        if (!res.ok) return;

        setProjects(prev => prev.filter(p => p.id !== projectId));
    };

    const openUpdateModal = (project) => {
        setUpdatingProjectId(project.id);
        setUpdateTitle(project.title);
        setUpdateDescription(project.description || "");
        setShowUpdateModal(true);
    };

    const handleUpdateProject = async () => {
        if (!updateTitle.trim()) return;

        const res = await fetchWithAuth(
            `https://localhost:7290/api/projects/${updatingProjectId}`,
            {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ProjectId: updatingProjectId,
                    Title: updateTitle,
                    Description: updateDescription
                })
            }
        );

        if (!res.ok) return;

        const updated = await res.json();

        setProjects(prev =>
            prev.map(p =>
                p.id === updatingProjectId ? { ...p, ...updated } : p
            )
        );

        setShowUpdateModal(false);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <input
                    placeholder="Search projects..."
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setPage(1);
                    }}
                    className="w-64 rounded-xl bg-white/30 border border-white/40 px-4 py-2 text-white placeholder-white shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />

                <button
                    onClick={() => setShowAddModal(true)}
                    className="rounded-xl bg-white/30 backdrop-blur-lg border border-white/20 px-5 py-2 text-white shadow-lg hover:bg-white/40 transition"
                >
                    + Add Project
                </button>
            </div>

            {paginatedProjects.length === 0 ? (
                <p className="text-white/70">No projects found.</p>
            ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {paginatedProjects.map(p => (
                        <div
                            key={p.id}
                            className="cursor-pointer rounded-2xl border border-white/20 bg-white/20 p-5 shadow-lg backdrop-blur-lg transition hover:shadow-2xl"
                        >
                            <h3
                                className="text-lg font-semibold text-white"
                                onClick={() => onSelectProject(p)}
                            >
                                {p.title}
                            </h3>

                            {p.description && (
                                <p className="mt-1 text-sm text-white/70">
                                    {p.description}
                                </p>
                            )}

                            <div className="mt-4">
                                <div className="relative h-3 w-full overflow-hidden rounded-full bg-white/20">
                                    <div
                                        className="absolute h-3 rounded-full bg-gradient-to-r from-green-700 to-lime-600 transition-all duration-500"
                                        style={{ width: `${(projectProgressMap[p.id] || 0) * 100}%` }}
                                    />
                                </div>
                                <p className="mt-1 text-xs text-white/70">
                                    {Math.round((projectProgressMap[p.id] || 0) * 100)}% completed
                                </p>
                            </div>

                            <div className="mt-4 flex justify-end gap-2">
                                <button
                                    onClick={() => openUpdateModal(p)}
                                    className="rounded-lg px-3 py-1 text-white/90 hover:text-white shadow z-10"
                                >
                                    <FiEdit size={18} />
                                </button>
                                <button
                                    onClick={() => handleDeleteProject(p.id)}
                                    className="rounded-lg px-3 py-1 text-red-400 hover:text-red-500 shadow z-10"
                                >
                                    <FiTrash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {totalPages > 1 && (
                <div className="flex justify-center gap-2">
                    <button
                        disabled={page === 1}
                        onClick={() => setPage(p => p - 1)}
                        className="rounded-lg px-3 py-1 text-white/80 hover:text-white shadow disabled:opacity-40"
                    >
                        ←
                    </button>

                    {Array.from({ length: totalPages }).map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setPage(i + 1)}
                            className={`rounded-lg px-3 py-1 shadow ${page === i + 1 ? "bg-white/20 backdrop-blur-lg" : "bg-white/10"} text-white`}
                        >
                            {i + 1}
                        </button>
                    ))}

                    <button
                        disabled={page === totalPages}
                        onClick={() => setPage(p => p + 1)}
                        className="rounded-lg px-3 py-1 text-white/80 hover:text-white shadow disabled:opacity-40"
                    >
                        →
                    </button>
                </div>
            )}

            {showAddModal && (
                <Modal
                    title="New Project"
                    name={projectName}
                    setName={setProjectName}
                    description={projectDescription}
                    setDescription={setProjectDescription}
                    onClose={() => setShowAddModal(false)}
                    onSave={handleCreateProject}
                />
            )}

            {showUpdateModal && (
                <Modal
                    title="Update Project"
                    name={updateTitle}
                    setName={setUpdateTitle}
                    description={updateDescription}
                    setDescription={setUpdateDescription}
                    onClose={() => setShowUpdateModal(false)}
                    onSave={handleUpdateProject}
                />
            )}
        </div>
    );
}
function Modal({ title, name, setName, description, setDescription, onClose, onSave }) {
    return (
        <>
            <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-2xl" />
            <div className="fixed inset-0 z-50 flex items-center justify-center">
                <div className="w-[26rem] animate-[fadeIn_0.15s_ease-out] rounded-2xl border border-white/20 bg-white/20 p-6 shadow-lg backdrop-blur-lg">
                    <h2 className="mb-4 text-lg font-semibold text-white">{title}</h2>

                    <input
                        className="placeholder-white mb-3 w-full rounded-xl border border-white/20 bg-white/30 px-4 py-2 text-white shadow-lg backdrop-blur-lg"
                        placeholder="Project title"
                        value={name}
                        required
                        onChange={e => setName(e.target.value)}
                    />

                    <textarea
                        className="placeholder-white mb-6 w-full resize-none rounded-xl border border-white/20 bg-white/30 px-4 py-2 text-white shadow-lg backdrop-blur-lg"
                        rows={3}
                        placeholder="Description (optional)"
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                    />

                    <div className="flex justify-end gap-3">
                        <button
                            onClick={onClose}
                            className="rounded-xl px-4 py-2 text-white shadow transition hover:bg-white/20"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onSave}
                            className="rounded-xl bg-indigo-500/60 px-4 py-2 text-white shadow transition hover:bg-indigo-500"
                        >
                            Save
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
