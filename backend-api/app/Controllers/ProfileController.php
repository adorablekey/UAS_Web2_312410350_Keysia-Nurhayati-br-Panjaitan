<?php

namespace App\Controllers;

use App\Models\UserModel;
use CodeIgniter\RESTful\ResourceController;

class ProfileController extends ResourceController
{
    protected $modelName = 'App\Models\UserModel';
    protected $format    = 'json';

    public function updateProfile()
    {
        $id = $this->request->getPost('id');
        if (!$id) {
            return $this->failValidationError('User ID is required');
        }

        $user = $this->model->find($id);
        if (!$user) {
            return $this->failNotFound('User not found');
        }

        $data = [
            'name'     => $this->request->getPost('name'),
            'username' => $this->request->getPost('username')
        ];

        // Optional password update
        $password = $this->request->getPost('password');
        if (!empty($password)) {
            $data['password'] = password_hash($password, PASSWORD_BCRYPT);
        }

        // Handle Avatar Upload
        $file = $this->request->getFile('avatar');
        if ($file && $file->isValid() && !$file->hasMoved()) {
            // Validate file type
            $validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif'];
            if (!in_array($file->getMimeType(), $validTypes)) {
                return $this->failValidationError('Invalid image format');
            }

            $newName = $file->getRandomName();
            $uploadPath = FCPATH . 'uploads/avatars/';
            
            if (!is_dir($uploadPath)) {
                mkdir($uploadPath, 0777, true);
            }

            $file->move($uploadPath, $newName);
            
            // Delete old avatar if exists
            if (!empty($user['avatar']) && file_exists($uploadPath . $user['avatar'])) {
                @unlink($uploadPath . $user['avatar']);
            }

            $data['avatar'] = $newName;
        }

        $this->model->update($id, $data);

        // Fetch updated user to return (hide password)
        $updatedUser = $this->model->find($id);
        unset($updatedUser['password']);

        return $this->respond([
            'status' => 200,
            'message' => 'Profile updated successfully',
            'user' => $updatedUser
        ]);
    }
}
