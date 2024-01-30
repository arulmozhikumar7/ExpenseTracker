import  { useState } from "react";

const Todo = () => {
  const [tasks, setTasks] = useState([]);
  const [taskInput, setTaskInput] = useState("");
  const [completed, setCompleted] = useState([]);

  const addTask = () => {
    if (taskInput.trim() !== "") {
      setTasks([...tasks, taskInput]);
      setTaskInput("");
    }
  };
 const removeTask = (index) =>{
    tasks.splice(index,1)
    setTasks([...tasks])
 }
 const removeCompleted = (index)=>{
    completed.splice(index,1)
    setCompleted([...completed])
 }
  const handleClick = (e) => {
    if (e.key === "Enter") {
      addTask();
    }
  };

  const completeTask = (index) => {
    const completedTask = tasks.splice(index, 1);
    setTasks([...tasks]);
    setCompleted([...completed, completedTask]);
  };

  return (
    <div>
      <input
        type="text"
        value={taskInput}
        className="border-2 bg-gray-300"
        onChange={(e) => setTaskInput(e.target.value)}
        onKeyPress={handleClick}
      />
      <button onClick={addTask}>Add Task</button>

      <div>
        <h2 className="text-red-500">Tasks</h2>
        <ul>
          {tasks.map((task, index) => (
            <li key={index}>
              {task}{" "}
              <button onClick={() => completeTask(index)}>Complete</button>
              <button onClick={()=>removeTask(index)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2>Completed</h2>
        <ul>
          {completed.map((task, index) => (
            <li key={index}>
              <span className="line-through">{task}</span>
              <button onClick={()=>removeCompleted(index)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Todo;
