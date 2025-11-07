<?php
namespace App;

class TodoModel {
    private $pdo;

    public function __construct() {
        $this->pdo = Database::getConnection();
    }

    public function all() {
        $stmt = $this->pdo->query("SELECT * FROM todos ORDER BY created_at DESC");
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    public function get($id) {
        $stmt = $this->pdo->prepare("SELECT * FROM todos WHERE id = :id");
        $stmt->execute(['id' => $id]);
        return $stmt->fetch(\PDO::FETCH_ASSOC);
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
        $fields = [];
        $params = [];

        if (isset($data['title'])) {
            $fields[] = "title = :title";
            $params['title'] = $data['title'];
        }

        if (isset($data['description'])) {
            $fields[] = "description = :description";
            $params['description'] = $data['description'];
        }

        if (isset($data['is_done'])) {
            $fields[] = "is_done = :is_done";
            $params['is_done'] = (int)$data['is_done'];
        }

        if (!$fields) {
            // nothing to update
            return $this->get($id);
        }

        $params['id'] = $id;
        $sql = "UPDATE todos SET " . implode(", ", $fields) . " WHERE id = :id";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);

        return $this->get($id);
    }

    public function delete($id) {
        $stmt = $this->pdo->prepare("DELETE FROM todos WHERE id = :id");
        return $stmt->execute(['id' => $id]);
    }
}
