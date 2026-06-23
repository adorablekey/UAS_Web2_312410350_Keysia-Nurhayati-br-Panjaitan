<?php

namespace App\Models;

use CodeIgniter\Model;

class TransactionModel extends Model
{
    protected $table            = 'transactions';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'array';
    protected $useSoftDeletes   = false;
    protected $protectFields    = true;
    protected $allowedFields    = ['product_id', 'type', 'supplier', 'quantity', 'date', 'notes'];

    // Dates
    protected $useTimestamps = true;
    protected $dateFormat    = 'datetime';
    protected $createdField  = 'created_at';
    protected $updatedField  = 'updated_at';

    public function getTransactionsWithProducts()
    {
        return $this->select('transactions.*, products.name as product_name')
                    ->join('products', 'products.id = transactions.product_id', 'left')
                    ->orderBy('transactions.date', 'DESC')
                    ->orderBy('transactions.id', 'DESC')
                    ->findAll();
    }
}
