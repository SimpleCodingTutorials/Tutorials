import React, {useState} from 'react';
import './App.css';

function App() {
  const [tasks,setTasks] = useState([]);
  const [newTask,setNewTask] = useState('');
  const [editIndex,setEditIndex] = useState(null);

  const addTask = () => {
    if(newTask.trim() === '') return;
    setTasks([...tasks,{text: newTask,completed:false}]);
    setNewTask('');
  };
  const saveTask = (index,event) => {
    const updatedText = event.target.textContent.trim();
    if(updatedText === '') return;
    const updatedTasks = tasks.map((task,i)=>
    i === index ? {...task, text:updatedText}:task);
    setTasks(updatedTasks);
    setEditIndex(null);
  };

  const editTask = (index) => {
    setEditIndex(index);
    setTimeout(()=>{
      const element = document.getElementById(`task-${index}`);
      if(element) element.focus();
    },0);
  };

  const toggleTask = (index) => {
     const updatedTasks = tasks.map((task,i)=> 
     i === index ? {...task,completed: !task.completed} : task)
     setTasks(updatedTasks);
  };

  const deleteTask = (index) => {
    const updatedTasks = tasks.filter((_,i) => i !== index);
    setTasks(updatedTasks);
  };

  return (
    <div className='App'>
      <h1>To-Do List</h1>
      <div className='task-input'>
        <input type="text" value={newTask} onChange={ (e)=> setNewTask(e.target.value)} placeholder="Add a new task..." />
        <button onClick={addTask}><i className='fas fa-plus'></i></button>
      </div>
      <ul className='task-list'>
        {tasks.map((task,index)=>(
          <li key={index} className={task.completed ? 'completed' : ''}>
            <input type="checkbox" checked = {task.completed} onChange={()=> toggleTask(index)}/>

            <span id={`task-${index}`} contentEditable={editIndex === index} suppressContentEditableWarning={true} onBlur={(e)=>saveTask(index,e)} style={{
              textDecoration:task.completed ? 'line-through' : 'none',
              border: editIndex === index ? '1px solid blue' : 'none',
              padding:'2px'
            }}> {task.text} </span>

            <button onClick={()=> editTask(index)}><i className="fas fa-edit"></i></button>
            <button onClick={()=> deleteTask(index)}><i className="fas fa-trash"></i></button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
