import { useState } from "react";
import "./App.css";

function App() {

  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);

  function addTask() {

    if (task.trim() === "") {
      return;
    }

    setTasks([...tasks, task]);

    setTask("");
  }

  function deleteTask(index) {

    const updatedTasks = tasks.filter((_, i) => i !== index);

    setTasks(updatedTasks);
  }

  return (
    <div className="container">

      <h1>To-Do App</h1>

      <div className="input-box">

        <input
          type="text"
          placeholder="Enter Task"
          value={task}
          onChange={(e) => setTask(e.target.value)}
        />

        <button onClick={addTask}>
          Add
        </button>

      </div>

      <div className="task-list">

        {
          tasks.map((item, index) => (

            <div
              className="task"
              key={index}
            >

              <p>{item}</p>

              <button
                onClick={() => deleteTask(index)}
              >
                Delete
              </button>

            </div>

          ))
        }

      </div>

    </div>
  );
}

export default App;