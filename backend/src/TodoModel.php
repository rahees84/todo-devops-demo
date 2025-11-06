<?php
namespace App;

class TodoModel {
    private $pdo;

    public function __construct() {
        $this->pdo = Database::getConnection();
    }

    public function all() {
        $stmt = $this->pdo->query("SELECT * FROM todos ORDER BY created_at DESC");
        return $stmt->fetchAll();
    }

    public function get($id) {
        $stmt = $this->pdo->prepare("SELECT * FROM todos WHERE id = :id");
        $stmt->execute(['id' => $id]);
        return $stmt->fetch();
    }

    public function create($data) {
        $stmt = $this->pdo->prepare(
            "INSERT INTO todos (title, description, is_done) VALUES (:title, :description, :is_done)"
        );
        $stmt->execute([
            'title' => $data['title'],
            'description' => $data['description'] ?? null,
            'is_done' => isset($data['is_done']) ? (int)$data['is_done'] : 0
        ]);
        return $this->get($this->pdo->lastInsertId());
    }

    public function update($id, $data) {
        $stmt = $this->pdo->prepare(
            "UPDATE todos SET title = :title, description = :description, is_done = :is_done WHERE id = :id"
        );
        $stmt->execute([
            'title' => $data['title'],
            'description' => $data['description'] ?? null,
            'is_done' => isset($data['is_done']) ? (int)$data['is_done'] : 0,
            'id' => $id
        ]);
        return $this->get($id);
    }

    public function delete($id) {
        $stmt = $this->pdo->prepare("DELETE FROM todos WHERE id = :id");
        return $stmt->execute(['id' => $id]);
    }
}

