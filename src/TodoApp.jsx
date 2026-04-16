import { useEffect, useState } from "react";

export default function TodoApp() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("tasks"));
    if (saved) setTasks(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (!input.trim()) return;

    setTasks([
      ...tasks,
      {
        id: Date.now(),
        text: input,
        done: false,
        isEditing: false,
      },
    ]);

    setInput("");
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const toggleDone = (id) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  };

  // 🔥 masuk mode edit
  const enableEdit = (id) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, isEditing: true } : t)));
  };

  // 🔥 simpan hasil edit
  const saveEdit = (id, newText) => {
    setTasks(
      tasks.map((t) =>
        t.id === id ? { ...t, text: newText, isEditing: false } : t,
      ),
    );
  };
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.done).length;
  const pendingTasks = totalTasks - completedTasks;

  return (
    <div className="card">
      <div className="input-row">
        <div className="stats">
          <div className="card-stat">
            <h3>Total</h3>
            <p>{totalTasks}</p>
          </div>
          <div className="card-stat">
            <h3>Selesai</h3>
            <p>{completedTasks}</p>
          </div>
          <div className="card-stat">
            <h3>Belum</h3>
            <p>{pendingTasks}</p>
          </div>
        </div>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Tambah tugas..."
        />
        <button onClick={addTask}>Tambah</button>
      </div>

      <ul className="list">
        {tasks.map((task) => (
          <li key={task.id} className={task.done ? "done" : ""}>
            {/* CHECKBOX */}
            <input
              type="checkbox"
              checked={task.done}
              onChange={() => toggleDone(task.id)}
            />

            {/* TEXT / EDIT MODE */}
            {task.isEditing ? (
              <input
                defaultValue={task.text}
                onBlur={(e) => saveEdit(task.id, e.target.value)}
                autoFocus
              />
            ) : (
              <span onClick={() => toggleDone(task.id)}>{task.text}</span>
            )}

            <div style={{ display: "flex", gap: "5px" }}>
              <button onClick={() => enableEdit(task.id)}>Edit</button>
              <button onClick={() => deleteTask(task.id)}>Hapus</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
