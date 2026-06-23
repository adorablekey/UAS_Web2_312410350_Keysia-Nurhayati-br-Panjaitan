const LoginComponent = {
    template: `
        <div class="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div class="max-w-md w-full bg-white rounded-xl shadow-xl overflow-hidden">
                <div class="bg-primary py-6 px-8 text-white text-center">
                    <h2 class="text-3xl font-bold tracking-tight">E-Inventory</h2>
                    <p class="text-primary-100 mt-2 text-sm">Sign in to your account</p>
                </div>
                <div class="p-8">
                    <div v-if="errorMsg" class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded shadow-sm" role="alert">
                        <p>{{ errorMsg }}</p>
                    </div>
                    
                    <form @submit.prevent="handleLogin" class="space-y-6">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Username</label>
                            <input v-model="username" type="text" required 
                                class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary transition-colors outline-none"
                                placeholder="Enter username">
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Password</label>
                            <input v-model="password" type="password" required 
                                class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary transition-colors outline-none"
                                placeholder="Enter password">
                        </div>

                        <button type="submit" :disabled="loading"
                            class="w-full bg-primary hover:bg-secondary text-white font-bold py-3 px-4 rounded-lg shadow-md transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed">
                            <span v-if="loading">Signing in...</span>
                            <span v-else>Sign In</span>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    `,
    data() {
        return {
            username: '',
            password: '',
            errorMsg: '',
            loading: false
        }
    },
    methods: {
        async handleLogin() {
            this.loading = true;
            this.errorMsg = '';
            
            try {
                const response = await apiClient.post('/login', {
                    username: this.username,
                    password: this.password
                });
                
                const data = response.data;
                
                // Save to localStorage
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                localStorage.setItem('isLoggedIn', 'true');
                
                // Redirect to Dashboard
                this.$router.push('/dashboard');
                
            } catch (error) {
                if (error.response && error.response.data) {
                    this.errorMsg = error.response.data.messages || error.response.data.error || 'Login failed';
                } else {
                    this.errorMsg = 'Network error or server is down.';
                }
            } finally {
                this.loading = false;
            }
        }
    }
};
