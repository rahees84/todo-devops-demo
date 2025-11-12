import { useEffect, useState } from "react";
import axios from "axios";
import TodoList from "./components/TodoList";
import TodoForm from "./components/TodoForm";

//const API_URL = "http://localhost:8080/todos";


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
const API_URL = `${API_BASE_URL}/todos`;


function App() {
  const [todos, setTodos] = useState([]);

  const fetchTodos = async () => {
    try {
      const res = await axios.get(API_URL);
      setTodos(res.data);
    } catch (err) {
      console.error("Error fetching todos:", err);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const addTodo = async (text) => {
    try {
      await axios.post(API_URL, { title: text });
      fetchTodos();
    } catch (err) {
      console.error("Error adding todo:", err);
    }
  };

  const toggleTodo = async (id, done) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, is_done: !t.is_done } : t))
    );

    try {
      await axios.put(`${API_URL}/${id}`, { is_done: !done ? 1 : 0 });
    } catch (err) {
      console.error(err);
      setTodos((prev) =>
        prev.map((t) => (t.id === id ? { ...t, is_done: done } : t))
      );
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchTodos();
    } catch (err) {
      console.error("Error deleting todo:", err);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      {/* Main content wrapper — do not touch inner CSS */}
      <div style={{ flex: 1 }}>
        <div style={{ maxWidth: "500px", margin: "40px auto", textAlign: "center" }}>
          <h1>📝 Todo App by V: 4</h1>
          <TodoForm onAdd={addTodo} />
          <TodoList todos={todos} onToggle={toggleTodo} onDelete={deleteTodo} />
        </div>
      </div>

      {/* Footer */}
      <footer
  style={{
    textAlign: "center",
    padding: "10px 0",
    background: "#f1f1f1",
    borderTop: "1px solid #ccc",
    fontSize: "14px",
    color: "#555",
  }}
>
  © 2025 Rahees C. All rights reserved.
</footer>

    </div>
  );
}

export default App;
