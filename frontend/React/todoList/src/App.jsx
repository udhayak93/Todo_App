import { useCallback, useEffect, useState } from "react";
import "./App.css";

const EMPTY_ITEM = { title: "", description: "" };
const API_URL = (import.meta.env.VITE_API_URL || "https://todo-app-lctn.onrender.com").replace(/\/$/, "");

function App() {
  const [listItem, setListItem] = useState(EMPTY_ITEM);
  const [todoList, setTodoList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const apiRequest = useCallback(async (path, options = {}) => {
    let response;
    try {
      response = await fetch(`${API_URL}${path}`, {
        ...options,
        headers: { "Content-Type": "application/json", ...(options.headers || {}) },
      });
    } catch {
      throw new Error(`Cannot connect to Todo API: ${API_URL}`);
    }

    let data = null;
    try { data = await response.json(); } catch { /* no JSON */ }
    if (!response.ok) throw new Error(data?.message || `Request failed with status ${response.status}`);
    return data;
  }, []);

  const fetchTodos = useCallback(async () => {
    try {
      setError("");
      const items = await apiRequest("/showList");
      setTodoList(Array.isArray(items) ? items : []);
    } catch (err) {
      console.error("Failed to load todos:", err);
      setError(err.message || "Unable to load todo list.");
    } finally { setLoading(false); }
  }, [apiRequest]);

  useEffect(() => { fetchTodos(); }, [fetchTodos]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const title = listItem.title.trim();
    const description = listItem.description.trim();
    if (!title || !description) { alert("Please fill all fields."); return; }

    setSaving(true); setError("");
    try {
      if (listItem._id) {
        await apiRequest(`/updateList/${listItem._id}`, { method: "PUT", body: JSON.stringify({ title, description }) });
        alert("Updated successfully!");
      } else {
        await apiRequest("/addList", { method: "POST", body: JSON.stringify({ title, description }) });
        alert("Added successfully!");
      }
      setListItem(EMPTY_ITEM);
      await fetchTodos();
    } catch (err) {
      console.error("Save failed:", err);
      setError(err.message || "Unable to save todo.");
      alert(err.message || "Unable to save todo.");
    } finally { setSaving(false); }
  };

  const handleUpdate = (task) => {
    setError("");
    setListItem({ _id: task._id, title: task.title || "", description: task.description || "" });
  };

  const handleDelete = async (task) => {
    if (!window.confirm(`Delete "${task.title}"?`)) return;
    try {
      setError("");
      await apiRequest(`/deleteList/${task._id}`, { method: "DELETE" });
      alert("Deleted successfully!");
      setListItem(EMPTY_ITEM);
      await fetchTodos();
    } catch (err) {
      console.error("Delete failed:", err);
      setError(err.message || "Unable to delete todo.");
      alert(err.message || "Unable to delete todo.");
    }
  };

  return (
    <div className="app">
      <section className="card card-1">
        <div className="cardHeader createHeader"><div className="headerIcon">+</div><div><h1>{listItem._id ? "Update Work" : "Create Work"}</h1><p>Add a new work item to keep track</p></div></div>
        <form className="form" onSubmit={handleSubmit}>
          <label>Title <span className="required">*</span></label>
          <input className="input" type="text" value={listItem.title} placeholder="Enter title" onChange={(e) => setListItem({ ...listItem, title: e.target.value })} />
          <label>Description <span className="required">*</span></label>
          <textarea className="textarea" value={listItem.description} placeholder="Enter description" onChange={(e) => setListItem({ ...listItem, description: e.target.value })} />
          <button className="submitBtn" type="submit" disabled={saving}>➤ &nbsp; {saving ? "Saving..." : listItem._id ? "Update" : "Submit"}</button>
        </form>
      </section>
      <section className="card">
        <div className="cardHeader showHeader"><div className="headerIcon">☷</div><div><h1>Show Works</h1><p>View and manage your existing works</p></div></div>
        {error && <p className="errorMessage">{error}</p>}
        {loading ? <p className="empty">Loading works...</p> : todoList.length === 0 ? <p className="empty">No works available</p> : todoList.map((task) => (
          <div className="task" key={task._id}><div className="taskItem"><div className="taskIcon">✓</div><div className="taskInfo"><h2>{task.title}</h2><p>{task.description}</p></div><div className="actions"><button type="button" className="actionBtn editBtn" onClick={() => handleUpdate(task)}>✎ Edit</button><button type="button" className="actionBtn deleteBtn" onClick={() => handleDelete(task)}>🗑️ Delete</button></div></div></div>
        ))}
      </section>
    </div>
  );
}

export default App;
