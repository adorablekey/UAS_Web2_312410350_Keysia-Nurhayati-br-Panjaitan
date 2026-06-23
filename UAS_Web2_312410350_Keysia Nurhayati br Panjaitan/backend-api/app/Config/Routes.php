<?php

use CodeIgniter\Router\RouteCollection;

/** @var RouteCollection $routes */
$routes->get('/', 'Home::index');

$routes->group('api', function($routes) {
    // Handle CORS Preflight
    $routes->options('(:any)', static function() {
        return response()->setStatusCode(200);
    });

    $routes->post('login', 'AuthController::login');
    $routes->post('logout', 'AuthController::logout');
    
    // Categories
    $routes->get('categories', 'CategoriesController::index');
    $routes->get('categories/(:segment)', 'CategoriesController::show/$1');
    $routes->post('categories', 'CategoriesController::create', ['filter' => 'auth']);
    $routes->put('categories/(:segment)', 'CategoriesController::update/$1', ['filter' => 'auth']);
    $routes->delete('categories/(:segment)', 'CategoriesController::delete/$1', ['filter' => 'auth']);
    
    // Products
    $routes->get('products', 'ProductsController::index');
    $routes->get('products/(:segment)', 'ProductsController::show/$1');
    $routes->post('products', 'ProductsController::create', ['filter' => 'auth']);
    $routes->post('products/update/(:segment)', 'ProductsController::update/$1', ['filter' => 'auth']);
    $routes->put('products/(:segment)', 'ProductsController::update/$1', ['filter' => 'auth']);
    $routes->delete('products/(:segment)', 'ProductsController::delete/$1', ['filter' => 'auth']);
    // Transactions
    $routes->get('transactions', 'TransactionsController::index');
    $routes->post('transactions', 'TransactionsController::create', ['filter' => 'auth']);
    $routes->delete('transactions/(:segment)', 'TransactionsController::delete/$1', ['filter' => 'auth']);
    $routes->post('profile/update', 'ProfileController::updateProfile', ['filter' => 'auth']);
});
