"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './styles/Main.module.css';
import TodoForm from './components/TodoForm';

const App = () => {
  const [view, setView] = useState('login'); // 'login', 'list', 'create', 'edit', 'delete'
  const [todos, setTodos] = useState([]);
  const [currentTodo, setCurrentTodo] = useState(null);

  useEffect(() => {
    if (view === 'list') {
      // Fetch todos from API
      const fetchTodos = async () => {
        try {
          const response = await axios.get('https://candidate.neversitup.com/todo/todos');
          setTodos(response.data);
        } catch (error) {
          console.error('Error fetching todos:', error);
          if (error.response) {
            // The request was made and the server responded with a status code that falls out of the range of 2xx
            console.error('Response data:', error.response.data);
            console.error('Response status:', error.response.status);
            console.error('Response headers:', error.response.headers);
          } else if (error.request) {
            // The request was made but no response was received
            console.error('Request data:', error.request);
          } else {
            // Something happened in setting up the request that triggered an Error
            console.error('Error message:', error.message);
          }
          alert('Error fetching todos. Please check the console for more details.');
        }
      };
      fetchTodos();
    }
  }, [view]);

  const handleLogin = (event) => {
    event.preventDefault();
    setView('list');
  };

  const handleCreate = async (title, description) => {
    try {
      const response = await axios.post('https://candidate.neversitup.com/todo/todos', { title, description });
      console.log('Todo created:', response.data);
      setView('list');
    } catch (error) {
      console.error('Error creating todo:', error);
      alert('Error creating todo. Please check the console for more details.');
    }
  };

  const handleEdit = async (id, title, description) => {
    try {
      const response = await axios.put(`https://candidate.neversitup.com/todo/todos/${id}`, { title, description });
      console.log('Todo updated:', response.data);
      setView('list');
    } catch (error) {
      console.error('Error updating todo:', error);
      alert('Error updating todo. Please check the console for more details.');
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`https://candidate.neversitup.com/todo/todos/${id}`);
      console.log('Todo deleted:', response.data);
      setView('list');
    } catch (error) {
      console.error('Error deleting todo:', error);
      alert('Error deleting todo. Please check the console for more details.');
    }
  };

  return (
    <div className={styles.container}>
      {view === 'login' && (
        <div className={styles.loginContainer}>
          <form onSubmit={handleLogin} className={styles.form}>
            <input placeholder="Username" className={styles.input} />
            <input type="password" placeholder="Password" className={styles.input} />
            <button type="submit" className={styles.button}>Login</button>
          </form>
        </div>
      )}
      {view === 'list' && (
        <>
          <h1>Todo List</h1>
          <button onClick={() => setView('create')} className={styles.createButton}>+ Create</button>
          <ul>
            {todos.map((todo) => (
              <li key={todo._id} className={styles.todoItem}>
                <h2>{todo.title}</h2>
                <p>{todo.description}</p>
                <button onClick={() => { setCurrentTodo(todo); setView('edit'); }}>Edit</button>
                <button onClick={() => { setCurrentTodo(todo); setView('delete'); }}>Delete</button>
              </li>
            ))}
          </ul>
        </>
      )}
      {view === 'create' && (
        <div className={styles.formContainer}>
          <TodoForm onSubmit={handleCreate} buttonText="Create" />
          <button onClick={() => setView('list')} className={styles.button}>Cancel</button>
        </div>
      )}
      {view === 'edit' && currentTodo && (
        <div className={styles.formContainer}>
          <TodoForm
            onSubmit={(title, description) => handleEdit(currentTodo._id, title, description)}
            buttonText="Edit"
            initialTitle={currentTodo.title}
            initialDescription={currentTodo.description}
          />
          <button onClick={() => setView('list')} className={styles.button}>Cancel</button>
        </div>
      )}
      {view === 'delete' && currentTodo && (
        <div className={styles.formContainer}>
          <p>Want to delete this todo?</p>
          <button onClick={() => handleDelete(currentTodo._id)} className={styles.button}>Confirm</button>
          <button onClick={() => setView('list')} className={styles.button}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default App;
