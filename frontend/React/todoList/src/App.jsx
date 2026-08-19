import { useEffect, useState } from "react";
import "./App.css";

 function App() {
  const [listItem, setListItem] = useState({ title: "", description: "" });
  const [todoList, setTodoList] = useState([]);
   const [status, setStatus] = useState((false));
   
   const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3030";

  useEffect(() => {
    // -----------Api Call--------------//

    fetch(`${API_URL}/showList`, {
      method: "GET",
      headers: { "content-type": "application/json" }
    })
      .then((d) => {
        if (d.ok) {
          return d.json();
        }
      })
      .then((item) => {
        setTodoList(item);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [status]);
  const handleSubmit = (j) => {
    j.preventDefault();
    console.log(listItem);

    if (listItem._id) {
          //-----------Api Call-------------//
    fetch(`${API_URL}/updateList/${listItem._id}`, {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(listItem),
    })
      .then((d) => {
        if (d.ok) {
          return d.json();
        }
      })
      .then((item) => {
        alert("Updated  successful!");
        setListItem({ title: "", description: "" });
        setStatus(!status);
      })
      .catch((error) => {
        console.log(error);
      });
    }
    else {
          //-----------Api Call-------------//
    fetch(`${API_URL}/addList`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(listItem),
    })
      .then((d) => {
        if (d.ok) {
          return d.json();
        }
      })
      .then((item) => {
        alert("Added successful!");
        console.log(item);
        setListItem({ title: "", description: "" });
        setStatus(!status);
      })
      .catch((error) => {
        console.log(error);
      });
    }
  };
   const handleUpdate = (z) => {
     console.log(z);
     setListItem({ ...z, title: z.title, description: z.description });
   };

   const handleDelete = (h) => {
     console.log(h);
     
     //-----------Api Call-------------//

     fetch(`${API_URL}/deleteList/${h._id}`, {
      method: "DELETE",
      headers: { "content-type": "application/json" }
    })
      .then((d) => {
        if (d.ok) {
          return d.json();
        }
      })
      .then((item) => {
        alert("Deleted successful!");
         setListItem({ title: "", description: "" });
        setStatus(!status);
      })
      .catch((error) => {
        console.log(error);
      });
     
   }
  return (
    <>
      <div className="app">
        <section className="card card-1">
          <div className="cardHeader createHeader">
            <div className="headerIcon"> + </div>
            <div>
              <h1>Create Work</h1>
              <p> Add a new work item to keep track </p>
            </div>
          </div>
          <form className="form" onSubmit={(e) => handleSubmit(e)}>
            <label>
              {" "}
              Title <span className="required"> * </span>{" "}
            </label>
            <input
              className="input"
              type="text"
              value={listItem.title}
              placeholder="Enter title"
              onChange={(e) =>
                setListItem({ ...listItem, title: e.target.value })
              }
            />
            <label>
              {" "}
              Description <span className="required"> * </span>{" "}
            </label>
            <textarea
              className="textarea"
              value={listItem.description}
              placeholder="Enter description"
              onChange={(e) =>
                setListItem({ ...listItem, description: e.target.value })
              }
            />
            <button className="submitBtn" type="submit">
              {" "}
              ➤ &nbsp; {listItem._id ? "Update" : "Submit"}
            </button>
          </form>
        </section>
        <section className="card">
          <div className="cardHeader showHeader">
            <div className="headerIcon">☷</div>

            <div>
              <h1>Show Works</h1>
              <p>View and manage your existing works</p>
            </div>
          </div>

          {todoList.map((task) => {
            return (
              <div className="task" key={task._id}>
                <div className="taskItem">
                  <div className="taskIcon">✓</div>
                  <div className="taskInfo">
                    <h2>{task.title}</h2>
                    <p>{task.description}</p>
                    </div>
                    <div className="actions">
                      <button className="actionBtn editBtn" onClick={()=>handleUpdate(task)}>✎ Edit</button>
                      <button className="actionBtn deleteBtn" onClick={()=>handleDelete(task)}>🗑️ Delete</button>
                    </div>
                </div>
              </div>
            )
          })}

        </section>
      </div>
    </>
  );
}
export default App;
