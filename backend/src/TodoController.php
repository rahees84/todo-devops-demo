<?php
namespace App;

class TodoController {
    private $model;

    public function __construct() {
        $this->model = new TodoModel();
    }

    private function json($data, $code = 200) {
        http_response_code($code);
        header('Content-Type: application/json');
        echo json_encode($data);
        exit;
    }

    public function index() {
        $this->json($this->model->all());
    }

    public function show($id) {
        $todo = $this->model->get($id);
        if (!$todo) $this->json(['error' => 'Not found'], 404);
        $this->json($todo);
    }

    public function store($body) {
        if (empty($body['title'])) {
            $this->json(['error'=>'title required'], 400);
        }
        $todo = $this->model->create($body);
        $this->json($todo, 201);
    }

    public function update($id, $body) {
        // Pass body directly to the model. Model handles partial updates.
        $updated = $this->model->update($id, $body);
        $this->json($updated);
    }

    public function destroy($id) {
        $todo = $this->model->get($id);
        if (!$todo) $this->json(['error'=>'Not found'], 404);
        $this->model->delete($id);
        $this->json(['success' => true], 200);
    }
}
