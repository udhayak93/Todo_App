import { useState } from "react";
import './App.css'

function App() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [works, setWorks] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      alert("Please fill all fields");
      return;
    }
    const newWork = {
      id: Date.now(),
      title: title,
      description: description,
    };
    setWorks([...works, newWork]);
    setTitle("");
    setDescription("");
  };
  const handleDelete = (id) => {
    setWorks(works.filter((work) => work.id !== id));
  };
  const handleEdit = (id) => {
    const work = works.find((item) => item.id === id);
    const newTitle = prompt("Enter title:", work.title);
    const newDescription = prompt(
      "Enter description:",
      work.description
    );

    if (newTitle && newDescription) {
      setWorks(works.map((item) => item.id === id ? { ...item, title: newTitle, description: newDescription, } : item));
    }
  };

  return (
    <>
      <div className="app">
        <section className="card">
          <div className="cardHeader createHeader">
            <div className="headerIcon"> + </div>
            <div>
              <h1>Create Work</h1>
              <p> Add a new work item to keep track </p>
            </div>
          </div>
          <form className="form" onSubmit={handleSubmit} >
            <label> Title{" "} <span className="required"> * </span> </label>
            <input className="input" type="text" placeholder="Enter title" value={title} onChange={(e) => setTitle(e.target.value)} />
            <label> Description{" "} <span className="required"> * </span> </label>
            <textarea className="textarea" placeholder="Enter description" value={description} onChange={(e) => setDescription(e.target.value)} />
            <button className="submitBtn" type="submit"> ➤ &nbsp; Submit </button>
          </form>
        </section>
        <section className="card">
          <div className="cardHeader showHeader">
            <div className="headerIcon"> ☷ </div>
            <div>
              <h1>Show Works</h1>
              <p> View and manage your existing works </p>
            </div>
          </div>
          <div className="works">
            {works.length === 0 ? (<div className="empty"> No works available </div>) : (works.map((work) => (
              <div className="workItem" key={work.id}>
                <div className="workIcon"> ✓ </div>
                <div className="workInfo">
                  <h2> {work.title} </h2>
                  <p> {work.description} </p>
                </div>
                <div className="actions">
                  <button className="actionBtn editBtn" onClick={() => handleEdit(work.id)}> ✎ Edit </button>
                  <button className="actionBtn deleteBtn" onClick={() => handleDelete(work.id)}> 🗑️ Delete </button>
                </div>
              </div>
            ))
            )}
          </div>
        </section>
      </div>
    </>
  );
}


