<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;

class ProductsController extends ResourceController
{
    protected $modelName = 'App\Models\ProductModel';
    protected $format    = 'json';

    public function index()
    {
        // Maybe fetch with category name if needed, but for now simple findAll
        $builder = $this->model->builder();
        $builder->select('products.*, categories.name as category_name');
        $builder->join('categories', 'categories.id = products.category_id', 'left');
        $query = $builder->get();
        return $this->respond($query->getResultArray());
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
            'category_id' => 'required|numeric',
            'name'        => 'required',
            'stock'       => 'required|numeric',
            'supplier'    => 'required'
        ];

        if (!$this->validate($rules)) {
            return $this->failValidationErrors($this->validator->getErrors());
        }

        $data = [
            'category_id' => $this->request->getVar('category_id'),
            'user_id'     => $this->request->getVar('user_id'),
            'name'        => $this->request->getVar('name'),
            'stock'       => $this->request->getVar('stock'),
            'supplier'    => $this->request->getVar('supplier')
        ];

        $image = $this->request->getFile('image');
        if ($image && $image->isValid() && !$image->hasMoved()) {
            $newName = $image->getRandomName();
            $image->move(FCPATH . 'uploads/products', $newName);
            $data['image'] = $newName;
        }

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
            'category_id' => 'required|numeric',
            'name'        => 'required',
            'stock'       => 'required|numeric',
            'supplier'    => 'required'
        ];

        $data = [
            'category_id' => $this->request->getVar('category_id'),
            'user_id'     => $this->request->getVar('user_id'),
            'name'        => $this->request->getVar('name'),
            'stock'       => $this->request->getVar('stock'),
            'supplier'    => $this->request->getVar('supplier')
        ];

        if (!$this->validateData($data, $rules)) {
            return $this->failValidationErrors($this->validator->getErrors());
        }

        $find = $this->model->find($id);
        if (!$find) {
            return $this->failNotFound('No Data Found with id ' . $id);
        }

        $updateData = [
            'category_id' => $data['category_id'],
            'user_id'     => $data['user_id'] ? $data['user_id'] : $find['user_id'],
            'name'        => $data['name'],
            'stock'       => $data['stock'],
            'supplier'    => $data['supplier'] ? $data['supplier'] : $find['supplier']
        ];

        $image = $this->request->getFile('image');
        if ($image && $image->isValid() && !$image->hasMoved()) {
            $newName = $image->getRandomName();
            $image->move(FCPATH . 'uploads/products', $newName);
            $updateData['image'] = $newName;

            // Delete old image
            if (!empty($find['image']) && file_exists(FCPATH . 'uploads/products/' . $find['image'])) {
                unlink(FCPATH . 'uploads/products/' . $find['image']);
            }
        }

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
            // Delete image file if exists
            if (!empty($data['image']) && file_exists(FCPATH . 'uploads/products/' . $data['image'])) {
                unlink(FCPATH . 'uploads/products/' . $data['image']);
            }
            
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
