import React, { useState, useEffect } from 'react';
import { signup, login, createTask, getTasks, updateTask, deleteTask } from './api';
import './styles.css';

const App = () => {
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLogin, setIsLogin] = useState(true);

    useEffect(() => {
        if (token) fetchTasks();
    }, [token]);

    const fetchTasks = async () => {
        const response = await getTasks(token);
        setTasks(response.data);
    };

    const handleAuth = async (e) => {
        e.preventDefault();
        const action = isLogin ? login({ email, password }) : signup({ email, password });
        const response = await action;
        setToken(response.data.token);
        localStorage.setItem('token', response.data.token);
    };

    const handleAddTask = async (e) => {
        e.preventDefault();
        await createTask({ title: newTask }, token);
        setNewTask('');
        fetchTasks();
    };

    const handleUpdateTask = async (id, title, status) => {
        await updateTask({ id, title, status }, token);
        fetchTasks();
    };

    const handleDeleteTask = async (id) => {
        await deleteTask({ id }, token);
        fetchTasks();
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setToken(null);
    };

    return (
        <div>
            <h1>Todo App</h1>
            {!token ? (
                <form onSubmit={handleAuth}>
                    <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    <button type="submit">{isLogin ? 'Login' : 'Signup'}</button>
                    <button type="button" onClick={() => setIsLogin(!isLogin)}>
                        Switch to {isLogin ? 'Signup' : 'Login'}
                    </button>
                </form>
            ) : (
                <div>
                    <button onClick={handleLogout}>Logout</button>
                    <form onSubmit={handleAddTask}>
                        <input type="text" placeholder="New Task" value={newTask} onChange={(e) => setNewTask(e.target.value)} required />
                        <button type="submit">Add Task</button>
                    </form>
                    <ul>
                        {tasks.map(task => (
                            <li key={task.id}>
                                {task.title} - {task.status}
                                <button onClick={() => handleUpdateTask(task.id, task.title, task.status === 'done' ? 'pending' : 'done')}>
                                    Toggle Status
                                </button>
                                <button onClick={() => handleDeleteTask(task.id)}>Delete</button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default App;
