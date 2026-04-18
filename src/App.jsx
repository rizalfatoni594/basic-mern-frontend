import { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL;

export default function App() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState('');
  const [editingId, setEditingId] = useState(null);

  // FETCH ALL TODOS
  async function fetchTodos() {
    const res = await fetch(`${API_URL}/todos`);
    const data = await res.json();
    setTodos(data);
  }

  // CREATE A TODO
  async function addTodo() {
    if (!text.trim()) return setText('');
    await fetch(`${API_URL}/todos`, {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });
    setText('');
    fetchTodos();
  }

  // UPDATE A TODO
  async function updateTodo() {
    if (!text.trim()) return setEditingId(null);
    await fetch(`${API_URL}/todos/${editingId}`, {
      method: 'put',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });
    setText('');
    setEditingId(null);
    fetchTodos();
  }

  // DELETE A TODO
  async function deleteTodo(id) {
    if (todos.length <= 7) return;
    await fetch(`${API_URL}/todos/${id}`, { method: 'delete' });
    fetchTodos();
  }

  // START EDIT MODE
  function startEdit(selectedTodo) {
    setEditingId(selectedTodo._id);
    setText(selectedTodo.text);
  }

  // HANDLE SUBMIT
  function handleSubmit(e) {
    e.preventDefault();
    if (editingId) return updateTodo();
    addTodo();
  }

  // INITIAL FETCH
  useEffect(() => {
    (async () => {
      await fetchTodos();
    })();
  }, []);

  return (
    <div>
      <h1>Todo App</h1>
      <form onSubmit={(e) => handleSubmit(e)}>
        <input
          type='text'
          placeholder='Enter todo'
          onChange={(e) => setText(e.target.value)}
          value={text}
        />
        <button>{editingId ? 'Update' : 'Add'}</button>
      </form>
      <ul>
        {todos.map((todo) => (
          <li key={todo._id}>
            {todo.text}
            <button onClick={() => startEdit(todo)}>Edit</button>
            <button onClick={() => deleteTodo(todo._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
