<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class AddSupplierToTransactions extends Migration
{
    public function up()
    {
        $fields = [
            'supplier' => [
                'type'       => 'VARCHAR',
                'constraint' => '255',
                'null'       => true,
                'after'      => 'type'
            ],
        ];
        $this->forge->addColumn('transactions', $fields);
    }

    public function down()
    {
        $this->forge->dropColumn('transactions', 'supplier');
    }
}
