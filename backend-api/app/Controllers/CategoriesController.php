<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;
use App\Models\CategoryModel;

class CategoriesController extends ResourceController
{
    protected $modelName = 'App\Models\CategoryModel';
    protected $format    = 'json';

    public function index()
    {
        return $this->respond($this->model->findAll());
    }

    public function show($id = null)
    {
        $data = $this->model->find($id);
        if ($data) {
            return $this->respond($data);
        }
        return $this->failNotFound('No Data Found with id ' . $id);
    }

    public function create()
    {
        $rules = [
            'name' => 'required'
        ];

        if (!$this->validate($rules)) {
            return $this->failValidationErrors($this->validator->getErrors());
        }

        $data = [
            'name'        => $this->request->getVar('name'),
            'description' => $this->request->getVar('description')
        ];

        $this->model->insert($data);
        $response = [
            'status'   => 201,
            'error'    => null,
            'messages' => [
                'success' => 'Data Saved'
            ]
        ];
        return $this->respondCreated($response);
    }

    public function update($id = null)
    {
        $rules = [
            'name' => 'required'
        ];

        $data = $this->request->getRawInput();
        $json = $this->request->getJSON(true);
        if ($json) {
            $data = $json;
        }

        if (!$this->validateData($data, $rules)) {
            return $this->failValidationErrors($this->validator->getErrors());
        }

        $find = $this->model->find($id);
        if (!$find) {
            return $this->failNotFound('No Data Found with id ' . $id);
        }

        $updateData = [
            'name'        => $data['name'],
            'description' => isset($data['description']) ? $data['description'] : $find['description']
        ];

        $this->model->update($id, $updateData);
        $response = [
            'status'   => 200,
            'error'    => null,
            'messages' => [
                'success' => 'Data Updated'
            ]
        ];
        return $this->respond($response);
    }

    public function delete($id = null)
    {
        $data = $this->model->find($id);
        if ($data) {
            $this->model->delete($id);
            $response = [
                'status'   => 200,
                'error'    => null,
                'messages' => [
                    'success' => 'Data Deleted'
                ]
            ];
            return $this->respondDeleted($response);
        }
        return $this->failNotFound('No Data Found with id ' . $id);
    }
}
