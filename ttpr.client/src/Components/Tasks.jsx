import { useEffect, useMemo, useState } from "react";
import { fetchWithAuth } from "../fetchWithAuth";
import { FiEdit, FiTrash2, FiCheck } from "react-icons/fi";

const PAGE_SIZE = 7;

export default function Tasks({ project, onBack }) {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(false);

    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);

    const [showAddModal, setShowAddModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);

    const [taskTitle, setTaskTitle] = useState("");
    const [taskDescription, setTaskDescription] = useState("");
    const [taskDueDate, setTaskDueDate] = useState("");

    const [updatingTaskId, setUpdatingTaskId] = useState(null);
    const [updateTitle, setUpdateTitle] = useState("");
    const [updateDescription, setUpdateDescription] = useState("");
    const [updateDueDate, setUpdateDueDate] = useState("");

    const [projectProgress, setProjectProgress] = useState(0);

    const loadTasks = async () => {
        setLoading(true);
        const res = await fetchWithAuth(`https://localhost:7290/api/tasks/of/${project.id}`);
        if (res.ok) setTasks(await res.json());
        else setTasks([]);
        setLoading(false);
        await loadProjectProgress(project.id);
    };

    const loadProjectProgress = async (projectId) => {
        const res = await fetchWithAuth(`https://localhost:7290/api/projects/progress/${projectId}`);
        if (!res.ok) return;
        const data = await res.json();
        setProjectProgress(parseFloat(data));
    };

    useEffect(() => {
        loadTasks();
    }, [project.id]);

    const filteredTasks = useMemo(() => tasks.filter(t => t.title.toLowerCase().includes(search.toLowerCase())), [tasks, search]);
    const totalPages = Math.max(1, Math.ceil(filteredTasks.length / PAGE_SIZE));
    const paginatedTasks = filteredTasks.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    const handleCreateTask = async () => {
        if (!taskTitle.trim()) return;
        const res = await fetchWithAuth("https://localhost:7290/api/tasks", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                Title: taskTitle,
                Description: taskDescription,
                DueDate: taskDueDate ? new Date(taskDueDate).toISOString() : null,
                ProjectId: project.id,
                IsFinished: false
            })
        });
        if (!res.ok) return;
        setShowAddModal(false);
        setTaskTitle(""); setTaskDescription(""); setTaskDueDate("");
        await loadTasks();
    };

    const openUpdateModal = (task) => {
        setUpdatingTaskId(task.id);
        setUpdateTitle(task.title);
        setUpdateDescription(task.description || "");
        setUpdateDueDate(task.dueDate ? task.dueDate.slice(0, 10) : "");
        setShowUpdateModal(true);
    };

    const handleUpdateTask = async () => {
        if (!updateTitle.trim()) return;
        const res = await fetchWithAuth(`https://localhost:7290/api/tasks/${updatingTaskId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                TaskId: updatingTaskId,
                Title: updateTitle,
                Description: updateDescription,
                DueDate: updateDueDate || null
            })
        });
        if (!res.ok) return;
        setShowUpdateModal(false);
        await loadTasks();
    };

    const handleDeleteTask = async (taskId) => {
        if (!confirm("Delete this task?")) return;
        const res = await fetchWithAuth(`https://localhost:7290/api/tasks/${taskId}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ TaskId: taskId })
        });
        if (!res.ok) return;
        await loadTasks();
    };

    const toggleTaskStatus = async (taskId, currentStatus) => {
        const res = await fetchWithAuth(`https://localhost:7290/api/tasks/${taskId}/status`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ IsFinished: !currentStatus })
        });
        if (!res.ok) return;
        await loadTasks();
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <button
                    onClick={onBack}
                    className="rounded-xl border border-white/20 bg-white/20 px-4 py-2 text-white shadow backdrop-blur-lg transition hover:bg-white/30"
                >
                    ← Projects
                </button>
                <h2 className="text-xl font-semibold text-white">{project.title}</h2>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <input
                    placeholder="Search tasks..."
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                    className="w-64 rounded-xl bg-white/20 backdrop-blur-lg border border-white/20 px-4 py-2 text-white placeholder-white shadow-lg"
                />

                <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
                    <div className="flex-1">
                        <div className="relative h-3 w-full overflow-hidden rounded-full bg-white/20">
                            <div
                                className="absolute h-3 rounded-full bg-gradient-to-r from-green-700 to-lime-600 transition-all duration-500"
                                style={{ width: `${(projectProgress || 0) * 100}%` }}
                            ></div>
                        </div>
                        <p className="mt-1 text-xs text-white/70">
                            {Math.round((projectProgress || 0) * 100)}% completed
                        </p>
                    </div>

                    <button
                        onClick={() => setShowAddModal(true)}
                        className="rounded-xl bg-white/20 backdrop-blur-lg border border-white/20 px-5 py-2 text-white shadow hover:bg-white/30 transition"
                    >
                        + Add Task
                    </button>
                </div>
            </div>

            {loading ? (
                <p className="text-white/70">Loading tasks...</p>
            ) : paginatedTasks.length === 0 ? (
                <p className="text-white/60">No tasks found.</p>
            ) : (
                <div className="space-y-4">
                    {paginatedTasks.map(t => (
                        <div key={t.id} className="rounded-2xl border border-white/20 bg-white/20 p-4 shadow-lg backdrop-blur-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className={`font-semibold text-white ${t.isFinished ? "line-through text-white/50" : ""}`}>{t.title}</h3>
                                    {t.description && <p className="mt-1 text-sm text-white/70">{t.description}</p>}
                                    {t.dueDate && <p className="mt-1 text-xs text-white/60">Due: {new Date(t.dueDate).toLocaleDateString()}</p>}
                                </div>

                                <div className="ml-auto flex items-center gap-2">
                                    <button onClick={() => openUpdateModal(t)} className="p-1 text-white/80 hover:text-indigo-300" title="Edit Task"><FiEdit size={18} /></button>
                                    <button onClick={() => handleDeleteTask(t.id)} className="p-1 text-red-400 hover:text-red-600" title="Delete Task"><FiTrash2 size={18} /></button>
                                    <button
                                        onClick={() => toggleTaskStatus(t.id, t.isFinished)}
                                        className={`p-1 ${t.isFinished ? "text-green-400 hover:text-green-600" : "text-gray-400 hover:text-gray-200"}`}
                                        title={t.isFinished ? "Unmark as Finished" : "Mark as Finished"}
                                    >
                                        <FiCheck size={18} />
                                    </button>
                                </div>
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
                        className="rounded-lg px-3 py-1 text-white/70 hover:text-white shadow disabled:opacity-40"
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
                        className="rounded-lg px-3 py-1 text-white/70 hover:text-white shadow disabled:opacity-40"
                    >
                        →
                    </button>
                </div>
            )}

            {showAddModal && (
                <TaskModal
                    title="New Task"
                    taskTitle={taskTitle}
                    setTaskTitle={setTaskTitle}
                    taskDescription={taskDescription}
                    setTaskDescription={setTaskDescription}
                    taskDueDate={taskDueDate}
                    setTaskDueDate={setTaskDueDate}
                    onClose={() => setShowAddModal(false)}
                    onSave={handleCreateTask}
                />
            )}

            {showUpdateModal && (
                <TaskModal
                    title="Update Task"
                    taskTitle={updateTitle}
                    setTaskTitle={setUpdateTitle}
                    taskDescription={updateDescription}
                    setTaskDescription={setUpdateDescription}
                    taskDueDate={updateDueDate}
                    setTaskDueDate={setUpdateDueDate}
                    onClose={() => setShowUpdateModal(false)}
                    onSave={handleUpdateTask}
                />
            )}
        </div>
    );
}

function TaskModal({ title, taskTitle, setTaskTitle, taskDescription, setTaskDescription, taskDueDate, setTaskDueDate, onClose, onSave }) {
    return (
        <>
            <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" />
            <div className="fixed inset-0 z-50 flex items-center justify-center">
                <div className="w-[26rem] rounded-2xl border border-white/20 bg-white/20 p-6 shadow-lg backdrop-blur-lg">
                    <h2 className="mb-4 text-lg font-semibold text-white">{title}</h2>

                    <input
                        className="placeholder-white mb-3 w-full rounded-xl border border-white/20 bg-white/30 px-4 py-2 text-white shadow-lg backdrop-blur-lg"
                        placeholder="Title"
                        required
                        value={taskTitle}
                        onChange={e => setTaskTitle(e.target.value)}
                    />

                    <textarea
                        className="placeholder-white mb-3 w-full resize-none rounded-xl border border-white/20 bg-white/30 px-4 py-2 text-white shadow-lg backdrop-blur-lg"
                        rows={3}
                        placeholder="Description (optional)"
                        value={taskDescription}
                        onChange={e => setTaskDescription(e.target.value)}
                    />

                    <input
                        type="date"
                        required
                        className="placeholder-white mb-6 w-full rounded-xl border border-white/20 bg-white/30 px-4 py-2 text-white shadow-lg backdrop-blur-lg"
                        value={taskDueDate}
                        onChange={e => setTaskDueDate(e.target.value)}
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
