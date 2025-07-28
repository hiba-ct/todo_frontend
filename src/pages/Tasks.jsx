import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SERVER_URL from '../services/serverUrl';
import { useNavigate, useParams } from 'react-router-dom';

const Tasks = () => {
  const [task, setTask] = useState('');
  const [todos, setTodos] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [updateId, setUpdateId] = useState(null);
  const [tab, setTab] = useState(1);
  const [loading, setLoading] = useState(true);
  const [actionStatus, setActionStatus] = useState({
    add: false,
    update: null,
    delete: null,
    complete: null,
  });

  const navigate = useNavigate();
  const params = useParams();

  const storedUser = sessionStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const token = user?.token;
  const userId = user?.id;

  useEffect(() => {
    if (!userId || !token) {
      navigate('/login', { replace: true });
    } else {
      if (params.id !== String(userId)) {
        navigate(`/tasks/${userId}`, { replace: true });
      } else {
        // 4 second delay loader
        setTimeout(() => {
          fetchTasks();
        }, 2000);
      }
    }
  }, [params.id]);

  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const fetchTasks = () => {
    axios.get(`${SERVER_URL}/read-tasks/${userId}`, axiosConfig)
      .then(res => {
        setTodos(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        if (err.response?.status === 401) {
          alert("Session expired. Please login again.");
          sessionStorage.removeItem("user");
          navigate("/login");
        }
      });
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!task.trim()) return;

    setActionStatus({ ...actionStatus, add: true });

    const url = isEdit ? `${SERVER_URL}/update-task` : `${SERVER_URL}/new-task`;
    const payload = isEdit
      ? { id: updateId, task }
      : { task, status: 'active' };

    setTimeout(() => {
      axios.post(url, payload, axiosConfig)
        .then(() => {
          setTask('');
          setIsEdit(false);
          setUpdateId(null);
          fetchTasks();
        })
        .catch((err) => {
          console.error("❌ Task operation failed:", err);
        })
        .finally(() => setActionStatus({ ...actionStatus, add: false }));
    }, 2000);
  };

  const handleEdit = (id, task) => {
    setIsEdit(true);
    setTask(task);
    setUpdateId(id);
  };

  const handleDelete = (id) => {
    setActionStatus({ ...actionStatus, delete: id });

    setTimeout(() => {
      axios.post(`${SERVER_URL}/delete-task`, { id, user_id: userId }, axiosConfig)
        .then(fetchTasks)
        .catch(console.error)
        .finally(() => setActionStatus({ ...actionStatus, delete: null }));
    }, 2000);
  };

  const handleComplete = (id) => {
    setActionStatus({ ...actionStatus, complete: id });

    setTimeout(() => {
      axios.post(`${SERVER_URL}/complete-task`, { id, user_id: userId }, axiosConfig)
        .then(fetchTasks)
        .catch(console.error)
        .finally(() => setActionStatus({ ...actionStatus, complete: null }));
    }, 2000);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('user');
    navigate('/', { replace: true });
  };

  const filteredTodos = todos.filter(todo => {
    if (tab === 2) return todo.status === 'active';
    if (tab === 3) return todo.status === 'completed';
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-green-100 flex justify-center items-start py-10">
      <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-blue-700">📝 ToDo App</h1>
          <button
            onClick={handleLogout}
            className="text-sm text-red-600 hover:underline border border-red-300 px-3 py-1 rounded"
          >
            Logout
          </button>
        </div>

        <form onSubmit={handleAddTask} className="flex gap-2 mb-5">
          <input
            type="text"
            placeholder="Enter a task"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          <button
            type="submit"
            className={`px-4 py-2 rounded text-white ${isEdit ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {actionStatus.add ? (isEdit ? 'Updating...' : 'Adding...') : (isEdit ? 'Update' : 'Add')}
          </button>
        </form>

        <div className="flex justify-between mb-5">
          <button onClick={() => setTab(1)} className={`px-4 py-1 rounded-full text-sm ${tab === 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>All</button>
          <button onClick={() => setTab(2)} className={`px-4 py-1 rounded-full text-sm ${tab === 2 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>Active</button>
          <button onClick={() => setTab(3)} className={`px-4 py-1 rounded-full text-sm ${tab === 3 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>Completed</button>
        </div>

        {loading ? (
          <p className="text-center text-blue-600 animate-pulse">🔄 Loading tasks...</p>
        ) : filteredTodos.length > 0 ? (
          filteredTodos.map((todo, index) => (
            <div key={index} className="bg-gray-50 p-3 mb-3 rounded shadow flex justify-between">
              <div>
                <p className="font-semibold text-gray-800">{todo.task}</p>
                <p className="text-xs text-gray-500">{new Date(todo.createdAt).toLocaleDateString()}</p>
                <p className="text-xs text-gray-600">Status: {todo.status}</p>
              </div>

              <div className="flex flex-col text-sm gap-1 text-right">
                {(tab === 1 || tab === 2) && (
                  <>
                    <button
                      onClick={() => handleEdit(todo.id, todo.task)}
                      className="text-yellow-600 hover:underline"
                    >
                      {updateId === todo.id && actionStatus.add ? 'Updating...' : 'Edit'}
                    </button>

                    <button
                      onClick={() => handleDelete(todo.id)}
                      className="text-red-500 hover:underline"
                    >
                      {actionStatus.delete === todo.id ? 'Deleting...' : 'Delete'}
                    </button>

                    <button
                      onClick={() => handleComplete(todo.id)}
                      className="text-green-600 hover:underline"
                    >
                      {actionStatus.complete === todo.id ? 'Completing...' : 'Completed'}
                    </button>
                  </>
                )}
                {tab === 3 && (
                  <button
                    onClick={() => handleDelete(todo.id)}
                    className="text-red-500 hover:underline"
                  >
                    {actionStatus.delete === todo.id ? 'Deleting...' : 'Delete'}
                  </button>
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

export default Tasks;
