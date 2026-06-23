<?php

namespace App\Controllers;

use App\Models\TransactionModel;
use App\Models\ProductModel;
use CodeIgniter\RESTful\ResourceController;

class TransactionsController extends ResourceController
{
    protected $modelName = TransactionModel::class;
    protected $format    = 'json';

    public function index()
    {
        $data = $this->model->getTransactionsWithProducts();
        return $this->respond($data);
    }

    public function create()
    {
        $rules = [
            'product_id' => 'required|numeric',
            'type'       => 'required|in_list[in,out]',
            'quantity'   => 'required|numeric|greater_than[0]',
            'date'       => 'required|valid_date',
            'supplier'   => 'permit_empty'
        ];

        if (!$this->validate($rules)) {
            return $this->failValidationErrors($this->validator->getErrors());
        }

        // Validasi kustom: jika IN, maka supplier wajib
        if ($this->request->getVar('type') === 'in' && empty($this->request->getVar('supplier'))) {
            return $this->failValidationErrors(['supplier' => 'The supplier field is required for incoming transactions.']);
        }

        $data = [
            'product_id' => $this->request->getVar('product_id'),
            'type'       => $this->request->getVar('type'),
            'supplier'   => $this->request->getVar('supplier'),
            'quantity'   => $this->request->getVar('quantity'),
            'date'       => $this->request->getVar('date'),
            'notes'      => $this->request->getVar('notes'),
        ];

        // Begin Transaction for Stock Update
        $db = \Config\Database::connect();
        $db->transStart();

        // Save transaction log
        $this->model->insert($data);

        // Update Product Stock
        $productModel = new ProductModel();
        $product = $productModel->find($data['product_id']);
        
        if ($product) {
            $newStock = $product['stock'];
            if ($data['type'] === 'in') {
                $newStock += $data['quantity'];
            } else {
                $newStock -= $data['quantity'];
                if ($newStock < 0) $newStock = 0; // Prevent negative stock
            }
            $productModel->update($product['id'], ['stock' => $newStock]);
        }

        $db->transComplete();

        if ($db->transStatus() === false) {
            return $this->failServerError('Transaction failed to save.');
        }

        return $this->respondCreated(['message' => 'Transaction logged successfully']);
    }

    public function delete($id = null)
    {
        // For simplicity, we just delete the log. 
        // Reverting the stock logically is more complex (requires checking old type/qty).
        if ($this->model->find($id)) {
            $this->model->delete($id);
            return $this->respondDeleted(['message' => 'Transaction deleted']);
        }
        return $this->failNotFound('Transaction not found');
    }
}
