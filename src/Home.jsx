import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SERVER_URL from './services/serverUrl';

const Home = () => {
  const [task, setTask] = useState('');
  const [todos, setTodos] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [updateId, setUpdateId] = useState(null);
  const [tab, setTab] = useState(1); // 1 = All, 2 = Active, 3 = Completed

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = () => {
    axios.get(`${SERVER_URL}/read-tasks`)
      .then(res => setTodos(res.data))
      .catch(err => console.error(err));
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!task.trim()) return;

    if (isEdit) {
      axios.post(`${SERVER_URL}/update-task`, {
        id: updateId,
        task: task,
      }).then(() => {
        setTask('');
        setIsEdit(false);
        setUpdateId(null);
        fetchTasks();
      });
    } else {
      axios.post(`${SERVER_URL}/new-task`, { task: task })
        .then(() => {
          setTask('');
          fetchTasks();
        });
    }
  };

  const handleEdit = (id, task) => {
    setIsEdit(true);
    setTask(task);
    setUpdateId(id);
  };

  const handleDelete = (id) => {
    axios.post(`${SERVER_URL}/delete-task`, { id: id })
      .then(() => fetchTasks());
  };

  const handleComplete = (id) => {
    axios.post(`${SERVER_URL}/complete-task`, { id: id })
      .then(() => fetchTasks())
      .catch(err => console.log("Complete error", err));
  };

  const filteredTodos = todos.filter(todo => {
    if (tab === 2) return todo.status === 'active';
    if (tab === 3) return todo.status === 'completed';
    return true;
  });

  return (
    <div className="min-h-screen bg-gradiant-to-br from-blue-100 via-purple-100 to-green-100 flex justify-center items-start py-10">
      <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-md">
        <h1 className="text-center text-2xl font-bold text-blue-700 mb-6">📝 ToDo App</h1>

        {/* Input Form */}
        <form onSubmit={handleAddTask} className="flex gap-2 mb-5">
          <input
            type="text"
            placeholder="Enter a task"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            {isEdit ? 'Update' : 'Add'}
          </button>
        </form>

        {/* Tabs */}
        <div className="flex justify-between mb-5">
          <button onClick={() => setTab(1)} className={`px-4 py-1 rounded-full text-sm ${tab === 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>All</button>
          <button onClick={() => setTab(2)} className={`px-4 py-1 rounded-full text-sm ${tab === 2 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>Active</button>
          <button onClick={() => setTab(3)} className={`px-4 py-1 rounded-full text-sm ${tab === 3 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>Completed</button>
        </div>

        {/* Task List */}
        {filteredTodos.length > 0 ? (
          filteredTodos.map((todo, index) => (
            <div key={index} className="bg-gray-50 p-3 mb-3 rounded shadow flex justify-between">
              <div>
                <p className="font-semibold text-gray-800">{todo.task}</p>
                <p className="text-xs text-gray-500">{new Date(todo.createdAt).toLocaleDateString()}</p>
                <p className="text-xs text-gray-600">Status: {todo.status}</p>
              </div>

              <div className="flex flex-col text-sm gap-1 text-right">
                {/* All & Active: Edit, Delete, Complete */}
                {(tab === 1 || tab === 2) && (
                  <>
                    <button onClick={() => handleEdit(todo.id, todo.task)} className="text-blue-600 hover:underline">Edit</button>
                    <button onClick={() => handleDelete(todo.id)} className="text-red-500 hover:underline">Delete</button>
                    <button onClick={() => handleComplete(todo.id)} className="text-green-600 hover:underline">Completed</button>
                  </>
                )}

                {/* Completed: Only Delete */}
                {tab === 3 && (
                  <button onClick={() => handleDelete(todo.id)} className="text-red-500 hover:underline">Delete</button>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No tasks found.</p>
        )}
      </div>
    </div>
  );
};

export default Home;
