import { useEffect, useState } from "react";
import axios from "axios";
import TodoList from "./components/TodoList";
import TodoForm from "./components/TodoForm";

const API_URL = "http://localhost:8080/todos"; // backend URL

function App() {
  const [todos, setTodos] = useState([]);

  // fetch all todos
  const fetchTodos = async () => {
    const res = await axios.get(API_URL);
    setTodos(res.data);
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const addTodo = async (text) => {
    await axios.post(API_URL, { title: text });
    fetchTodos();
  };

  const toggleTodo = async (id, done) => {
    await axios.put(`${API_URL}/${id}`, { done: !done });
    fetchTodos();
  };

  const deleteTodo = async (id) => {
    await axios.delete(`${API_URL}/${id}`);
    fetchTodos();
  };

  return (
    <div style={{ maxWidth: "500px", margin: "40px auto", textAlign: "center" }}>
      <h1>📝 Todo App</h1>
      <TodoForm onAdd={addTodo} />
      <TodoList todos={todos} onToggle={toggleTodo} onDelete={deleteTodo} />
    </div>
  );
}

export default App;
