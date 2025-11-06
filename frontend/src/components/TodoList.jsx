export default function TodoList({ todos, onToggle, onDelete }) {
  if (!todos.length) return <p>No todos yet.</p>;

  return (
    <ul style={{ listStyle: "none", padding: 0 }}>
      {todos.map((t) => (
        <li key={t.id} style={{ margin: "10px 0" }}>
          <input
            type="checkbox"
            checked={t.done}
            onChange={() => onToggle(t.id, t.done)}
          />
          <span
            style={{
              textDecoration: t.done ? "line-through" : "none",
              marginLeft: "10px",
            }}
          >
            {t.title}
          </span>
          <button
            onClick={() => onDelete(t.id)}
            style={{ marginLeft: "10px", color: "white" }}
          >
            X
          </button>
        </li>
      ))}
    </ul>
  );
}
