<?php

namespace App\Database\Seeds;

use CodeIgniter\Database\Seeder;

class DummyDataSeeder extends Seeder
{
    public function run()
    {
        $db = \Config\Database::connect();
        
        // Empty tables first
        $db->table('transactions')->emptyTable();
        $db->table('products')->emptyTable();
        $db->table('categories')->emptyTable();
        
        // Reset Auto Increment (optional, mostly works for MySQL)
        $db->query('ALTER TABLE categories AUTO_INCREMENT = 1');
        $db->query('ALTER TABLE products AUTO_INCREMENT = 1');
        $db->query('ALTER TABLE transactions AUTO_INCREMENT = 1');
        
        // --- CATEGORIES (9 Items) ---
        $categories = [
            ['name' => 'Skincare', 'description' => 'Produk perawatan kulit wajah'],
            ['name' => 'Makeup', 'description' => 'Produk kosmetik dan riasan wajah'],
            ['name' => 'Haircare', 'description' => 'Perawatan rambut profesional'],
            ['name' => 'Bodycare', 'description' => 'Perawatan tubuh dan sabun mandi'],
            ['name' => 'Perfume', 'description' => 'Wewangian dan parfum elegan'],
            ['name' => 'Nail Care', 'description' => 'Perawatan kuku dan kutek'],
            ['name' => 'Accessories', 'description' => 'Aksesoris wanita (kalung, cincin)'],
            ['name' => 'Bags', 'description' => 'Tas wanita premium'],
            ['name' => 'Shoes', 'description' => 'Sepatu dan sandal wanita']
        ];
        
        $db->table('categories')->insertBatch($categories);
        
        // --- PRODUCTS (9 Items) ---
        // Assuming categories IDs are 1 to 9 (auto-increment)
        $products = [
            [
                'name' => 'Night Repair Moisturizer',
                'category_id' => 1,
                'user_id' => 1,
                'supplier' => 'PT. Beauty Care Indo',
                'stock' => 50,
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s')
            ],
            [
                'name' => 'Velvet Matte Lipstick',
                'category_id' => 2,
                'user_id' => 1,
                'supplier' => 'MakeUp Supplier',
                'stock' => 120,
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s')
            ],
            [
                'name' => 'Argan Oil Hair Serum',
                'category_id' => 3,
                'user_id' => 1,
                'supplier' => 'Salon Supplier',
                'stock' => 3, // intentionally low stock for alert
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s')
            ],
            [
                'name' => 'Vanilla Shea Body Butter',
                'category_id' => 4,
                'user_id' => 1,
                'supplier' => 'PT. Beauty Care Indo',
                'stock' => 75,
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s')
            ],
            [
                'name' => 'Rose Petal Eau de Parfum',
                'category_id' => 5,
                'user_id' => 1,
                'supplier' => 'Importir Perfume',
                'stock' => 25,
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s')
            ],
            [
                'name' => 'Pastel Pink Gel Polish',
                'category_id' => 6,
                'user_id' => 1,
                'supplier' => 'Nail Studio Source',
                'stock' => 40,
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s')
            ],
            [
                'name' => 'Rose Gold Pendant Necklace',
                'category_id' => 7,
                'user_id' => 1,
                'supplier' => 'Pabrik Aksesoris',
                'stock' => 4, // intentionally low stock
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s')
            ],
            [
                'name' => 'Leather Sling Bag Minis',
                'category_id' => 8,
                'user_id' => 1,
                'supplier' => 'Leathercrafters',
                'stock' => 15,
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s')
            ],
            [
                'name' => 'Stiletto Heels Nude',
                'category_id' => 9,
                'user_id' => 1,
                'supplier' => 'Shoes Factory',
                'stock' => 10,
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s')
            ]
        ];

        $db->table('products')->insertBatch($products);

        // --- TRANSACTIONS (9 Items) ---
        $transactions = [
            [
                'product_id' => 1,
                'type' => 'in',
                'quantity' => 20,
                'supplier' => 'PT. Beauty Care Indo',
                'notes' => 'Restock bulanan',
                'date' => date('Y-m-d H:i:s', strtotime('-5 days'))
            ],
            [
                'product_id' => 2,
                'type' => 'out',
                'quantity' => 5,
                'supplier' => null,
                'notes' => 'Terjual ke customer online',
                'date' => date('Y-m-d H:i:s', strtotime('-4 days'))
            ],
            [
                'product_id' => 3,
                'type' => 'in',
                'quantity' => 10,
                'supplier' => 'Salon Supplier',
                'notes' => 'Barang baru datang',
                'date' => date('Y-m-d H:i:s', strtotime('-3 days'))
            ],
            [
                'product_id' => 4,
                'type' => 'out',
                'quantity' => 2,
                'supplier' => null,
                'notes' => 'Pembelian di toko',
                'date' => date('Y-m-d H:i:s', strtotime('-3 days'))
            ],
            [
                'product_id' => 5,
                'type' => 'in',
                'quantity' => 15,
                'supplier' => 'Importir Perfume',
                'notes' => 'Stok aroma mawar',
                'date' => date('Y-m-d H:i:s', strtotime('-2 days'))
            ],
            [
                'product_id' => 6,
                'type' => 'out',
                'quantity' => 10,
                'supplier' => null,
                'notes' => 'Dibeli oleh Nail Art Studio',
                'date' => date('Y-m-d H:i:s', strtotime('-2 days'))
            ],
            [
                'product_id' => 7,
                'type' => 'in',
                'quantity' => 5,
                'supplier' => 'Pabrik Aksesoris',
                'notes' => 'Barang premium',
                'date' => date('Y-m-d H:i:s', strtotime('-1 days'))
            ],
            [
                'product_id' => 8,
                'type' => 'out',
                'quantity' => 1,
                'supplier' => null,
                'notes' => 'Hadiah giveaway',
                'date' => date('Y-m-d H:i:s', strtotime('-1 days'))
            ],
            [
                'product_id' => 9,
                'type' => 'out',
                'quantity' => 3,
                'supplier' => null,
                'notes' => 'Penjualan weekend',
                'date' => date('Y-m-d H:i:s')
            ]
        ];

        $db->table('transactions')->insertBatch($transactions);
    }
}
