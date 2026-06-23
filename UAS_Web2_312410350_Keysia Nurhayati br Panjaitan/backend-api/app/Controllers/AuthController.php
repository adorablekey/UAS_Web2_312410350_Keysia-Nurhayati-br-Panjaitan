<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;
use App\Models\UserModel;

class AuthController extends ResourceController
{
    protected $format = 'json';

    public function login()
    {
        $rules = [
            'username' => 'required',
            'password' => 'required'
        ];

        if (!$this->validate($rules)) {
            return $this->failValidationErrors($this->validator->getErrors());
        }

        $model = new UserModel();
        $user = $model->where('username', $this->request->getVar('username'))->first();

        if (!$user) {
            return $this->failNotFound('Username not found');
        }

        $verify_pass = password_verify($this->request->getVar('password'), $user['password']);
        if (!$verify_pass) {
            return $this->fail('Incorrect password', 401);
        }

        // Generate a random token
        $token = bin2hex(random_bytes(32));

        // Save token to db
        $model->update($user['id'], ['token' => $token]);

        return $this->respond([
            'status' => 200,
            'messages' => 'Login successful',
            'token' => $token,
            'user' => [
                'id' => $user['id'],
                'name' => $user['name'],
                'username' => $user['username'],
                'avatar' => $user['avatar'] ?? null
            ]
        ]);
    }

    public function logout()
    {
        // For simplicity, we could require token in header and clear it
        $header = $this->request->getHeaderLine('Authorization');
        if (!empty($header)) {
            if (preg_match('/Bearer\s(\S+)/', $header, $matches)) {
                $token = $matches[1];
                $model = new UserModel();
                $user = $model->where('token', $token)->first();
                if ($user) {
                    $model->update($user['id'], ['token' => null]);
                }
            }
        }
        
        return $this->respond([
            'status' => 200,
            'messages' => 'Logout successful'
        ]);
    }
}
