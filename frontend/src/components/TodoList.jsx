import { useState } from "react";

export default function TodoList({ todos, onToggle, onDelete }) {
  const [loadingIds, setLoadingIds] = useState(new Set());

  if (!todos.length)
    return (
      <p
        style={{
          textAlign: "center",
          color: "#888",
          fontStyle: "italic",
          marginTop: "20px",
        }}
      >
        No todos yet.
      </p>
    );

  const startLoading = (id) => setLoadingIds(new Set(loadingIds).add(id));
  const stopLoading = (id) => {
    const copy = new Set(loadingIds);
    copy.delete(id);
    setLoadingIds(copy);
  };

  const handleToggle = async (id, done) => {
    startLoading(id);
    try {
      await onToggle(id, done); // call parent function to toggle
    } finally {
      stopLoading(id);
    }
  };

  return (
    <div style={{ marginTop: "20px" }}>
      {todos.map((t) => (
        <div
          key={t.id}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "#f9f9f9",
            border: "1px solid #ddd",
            borderRadius: "8px",
            padding: "10px 15px",
            marginBottom: "10px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", flex: 1 }}>
            <input
              type="checkbox"
              checked={!!t.is_done} // controlled by state
              onChange={() => handleToggle(t.id, !!t.is_done)}
              style={{ marginRight: "10px" }}
              disabled={loadingIds.has(t.id)}
            />

            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
              <span
                style={{
                  textDecoration: t.is_done ? "line-through" : "none",
                  color: t.is_done ? "#999" : "#333",
                  fontSize: "16px",
                }}
              >
                {t.title}
              </span>
              {t.description && (
                <small style={{ color: "#666", marginTop: 4 }}>{t.description}</small>
              )}
            </div>
          </div>

          <button
            onClick={() => onDelete(t.id)}
            style={{
              background: "#e74c3c",
              border: "none",
              color: "white",
              padding: "6px 10px",
              borderRadius: "6px",
              cursor: "pointer",
            }}
            disabled={loadingIds.has(t.id)}
            title="Delete"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
