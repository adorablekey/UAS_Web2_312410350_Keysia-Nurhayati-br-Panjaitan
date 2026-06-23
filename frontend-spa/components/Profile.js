const ProfileComponent = {
    template: `
        <div class="p-6 max-w-4xl mx-auto">
            <h1 class="text-3xl font-bold text-gray-800 mb-6">My Profile</h1>
            
            <div v-if="alert.show" :class="['p-4 mb-6 rounded shadow-sm border-l-4', alert.type === 'error' ? 'bg-red-100 border-red-500 text-red-700' : 'bg-green-100 border-green-500 text-green-700']">
                {{ alert.message }}
            </div>

            <div class="bg-white rounded-xl shadow-md overflow-hidden">
                <form @submit.prevent="saveProfile" class="p-8">
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                        
                        <!-- Avatar Section -->
                        <div class="md:col-span-1 flex flex-col items-center space-y-4">
                            <div class="relative group">
                                <div class="h-40 w-40 rounded-full overflow-hidden border-4 border-gray-100 shadow-inner bg-gray-50 flex items-center justify-center">
                                    <img v-if="previewImage" :src="previewImage" class="h-full w-full object-cover">
                                    <svg v-else class="h-20 w-20 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <label class="absolute bottom-0 right-4 bg-primary text-white p-2 rounded-full cursor-pointer shadow-lg hover:bg-secondary transition-colors">
                                    <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <input type="file" @change="handleFileUpload" accept="image/*" class="hidden">
                                </label>
                            </div>
                            <p class="text-sm text-gray-500 text-center">Click the camera icon to upload a new profile picture.</p>
                        </div>

                        <!-- Info Section -->
                        <div class="md:col-span-2 space-y-5">
                            <div>
                                <label class="block text-sm font-bold text-gray-700">Full Name</label>
                                <input v-model="form.name" type="text" required class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-3 px-4 focus:outline-none focus:ring-primary focus:border-primary">
                            </div>
                            <div>
                                <label class="block text-sm font-bold text-gray-700">Username</label>
                                <input v-model="form.username" type="text" required class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-3 px-4 focus:outline-none focus:ring-primary focus:border-primary">
                            </div>
                            <div class="pt-4 border-t border-gray-200">
                                <label class="block text-sm font-bold text-gray-700">New Password <span class="text-xs font-normal text-gray-500">(Leave blank if you don't want to change)</span></label>
                                <input v-model="form.password" type="password" placeholder="••••••••" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-3 px-4 focus:outline-none focus:ring-primary focus:border-primary">
                            </div>
                            <div class="flex justify-end pt-6">
                                <button type="submit" :disabled="saving" class="inline-flex justify-center items-center px-6 py-3 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-primary hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 transition-colors">
                                    <svg v-if="saving" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    {{ saving ? 'Saving Changes...' : 'Save Profile' }}
                                </button>
                            </div>
                        </div>

                    </div>
                </form>
            </div>
        </div>
    `,
    data() {
        return {
            user: JSON.parse(localStorage.getItem('user') || '{}'),
            form: {
                id: '',
                name: '',
                username: '',
                password: ''
            },
            selectedFile: null,
            previewImage: null,
            saving: false,
            alert: { show: false, message: '', type: 'success' }
        }
    },
    mounted() {
        this.form.id = this.user.id;
        this.form.name = this.user.name;
        this.form.username = this.user.username;
        if (this.user.avatar) {
            this.previewImage = 'http://localhost:8080/uploads/avatars/' + this.user.avatar;
        }
    },
    methods: {
        showAlert(message, type = 'success') {
            this.alert = { show: true, message, type };
            setTimeout(() => { this.alert.show = false; }, 4000);
        },
        handleFileUpload(event) {
            const file = event.target.files[0];
            if (!file) return;
            this.selectedFile = file;
            this.previewImage = URL.createObjectURL(file);
        },
        async saveProfile() {
            this.saving = true;
            try {
                let formData = new FormData();
                formData.append('id', this.form.id);
                formData.append('name', this.form.name);
                formData.append('username', this.form.username);
                if (this.form.password) {
                    formData.append('password', this.form.password);
                }
                if (this.selectedFile) {
                    formData.append('avatar', this.selectedFile);
                }

                const response = await apiClient.post('/profile/update', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });

                if (response.data.user) {
                    localStorage.setItem('user', JSON.stringify(response.data.user));
                    // Update current component state
                    this.user = response.data.user;
                    this.form.password = '';
                    this.showAlert('Profile updated successfully!');
                    
                    // Dispatch a custom event to notify app.js to reload the user object
                    window.dispatchEvent(new Event('user-profile-updated'));
                }
            } catch (error) {
                console.error(error);
                this.showAlert(error.response?.data?.messages?.error || 'Failed to update profile', 'error');
            } finally {
                this.saving = false;
            }
        }
    }
};
