const { createApp, ref, computed, watch } = Vue;

const App = {
    template: `
        <div class="font-sans antialiased text-gray-900 bg-gray-50 min-h-screen">
            
            <!-- LAYOUT UNTUK GUEST (Belum Login) -->
            <div v-if="!isLoggedIn">
                <!-- Simple Top Navbar for Guests -->
                <nav class="bg-primary text-white shadow-lg">
                    <div class="max-w-7xl mx-auto px-4">
                        <div class="flex justify-between h-16">
                            <div class="flex items-center">
                                <span class="font-bold text-xl tracking-tight mr-8">E-Inventory</span>
                                <div class="hidden md:flex space-x-4">
                                    <router-link to="/" class="hover:bg-secondary px-3 py-2 rounded-md text-sm font-medium transition-colors" exact-active-class="bg-secondary">Home</router-link>
                                </div>
                            </div>
                            <div class="flex items-center">
                                <router-link to="/login" class="bg-white text-primary hover:bg-gray-100 px-4 py-2 rounded-md text-sm font-bold transition-colors">
                                    Login
                                </router-link>
                            </div>
                        </div>
                    </div>
                </nav>
                <!-- Main Content for Guests -->
                <main class="py-6">
                    <router-view></router-view>
                </main>
            </div>

            <!-- LAYOUT UNTUK ADMIN (Sudah Login) -->
            <div v-else class="flex h-screen bg-gray-100 overflow-hidden relative">
                
                <!-- Mobile overlay backdrop -->
                <div v-if="isMobileMenuOpen" @click="closeMobileMenu" class="fixed inset-0 z-20 bg-black bg-opacity-50 transition-opacity md:hidden"></div>

                <!-- Sidebar -->
                <aside :class="['w-64 bg-primary text-white flex flex-col shadow-xl z-30 transition-transform duration-300 ease-in-out fixed md:relative h-full', isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0']">
                    <div class="h-16 flex items-center justify-center border-b border-secondary">
                        <span class="font-extrabold text-2xl tracking-widest uppercase">E-Inventory</span>
                    </div>
                    <nav class="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                        <router-link @click="closeMobileMenu" to="/dashboard" class="flex items-center px-4 py-3 rounded-lg hover:bg-secondary transition-colors group" active-class="bg-secondary">
                            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
                            Dashboard
                        </router-link>
                        <router-link @click="closeMobileMenu" to="/categories" class="flex items-center px-4 py-3 rounded-lg hover:bg-secondary transition-colors group" active-class="bg-secondary">
                            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                            Categories
                        </router-link>
                        <router-link @click="closeMobileMenu" to="/products" class="flex items-center px-4 py-3 rounded-lg hover:bg-secondary transition-colors group" active-class="bg-secondary">
                            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
                            Products
                        </router-link>
                        <router-link @click="closeMobileMenu" to="/transactions" class="flex items-center px-4 py-3 rounded-lg hover:bg-secondary transition-colors group" active-class="bg-secondary">
                            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg>
                            Transactions
                        </router-link>
                    </nav>
                </aside>
                
                <!-- Main Wrapper -->
                <div class="flex-1 flex flex-col overflow-hidden w-full">
                    
                    <!-- Top Navbar -->
                    <header class="h-16 bg-white shadow-sm flex items-center justify-between px-4 sm:px-6 z-10 w-full">
                        <div class="flex items-center">
                            <!-- Mobile Menu Button -->
                            <button @click="toggleMobileMenu" class="md:hidden mr-3 text-gray-500 hover:text-gray-700 focus:outline-none">
                                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                            <h2 class="text-xl font-semibold text-gray-800">{{ $route.name }}</h2>
                        </div>
                        <div class="flex items-center space-x-4 relative">
                            <!-- Profile Dropdown -->
                            <div class="relative">
                                <button @click="toggleProfileDropdown" class="flex items-center focus:outline-none">
                                    <div class="h-10 w-10 rounded-full bg-primary text-white flex items-center justify-center font-bold overflow-hidden border-2 border-gray-200">
                                        <img v-if="user.avatar" :src="'http://localhost:8080/uploads/avatars/' + user.avatar" class="h-full w-full object-cover">
                                        <span v-else>{{ user.name ? user.name.charAt(0).toUpperCase() : 'A' }}</span>
                                    </div>
                                    <span class="ml-2 text-sm font-medium text-gray-700 hidden sm:block">{{ user.name }}</span>
                                    <svg class="h-4 w-4 text-gray-500 ml-1 hidden sm:block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                <!-- Dropdown Menu -->
                                <div v-if="isProfileDropdownOpen" @click.away="closeProfileDropdown" class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 ring-1 ring-black ring-opacity-5">
                                    <div class="px-4 py-2 border-b border-gray-100">
                                        <p class="text-sm text-gray-500">Signed in as</p>
                                        <p class="text-sm font-bold text-gray-900 truncate">{{ user.username }}</p>
                                    </div>
                                    <router-link to="/profile" @click="closeProfileDropdown" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                                        <svg class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                        My Profile
                                    </router-link>
                                    <button @click="logout" class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center">
                                        <svg class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                                        Logout
                                    </button>
                                </div>
                            </div>
                        </div>
                    </header>

                    <!-- Page Content -->
                    <main class="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
                        <router-view></router-view>
                    </main>

                </div>
            </div>

        </div>
    `,
    setup() {
        const isLoggedIn = ref(localStorage.getItem('isLoggedIn') === 'true');
        const user = ref(JSON.parse(localStorage.getItem('user') || '{}'));
        const isMobileMenuOpen = ref(false);
        const isProfileDropdownOpen = ref(false);

        // Listen for custom profile update event
        window.addEventListener('user-profile-updated', () => {
            user.value = JSON.parse(localStorage.getItem('user') || '{}');
        });

        // Watch for route changes to update auth state dynamically if needed
        const currentRoute = window.router.currentRoute;
        watch(currentRoute, () => {
            isLoggedIn.value = localStorage.getItem('isLoggedIn') === 'true';
            user.value = JSON.parse(localStorage.getItem('user') || '{}');
            isMobileMenuOpen.value = false; // Auto close menu on navigation
            isProfileDropdownOpen.value = false;
        });

        const toggleMobileMenu = () => {
            isMobileMenuOpen.value = !isMobileMenuOpen.value;
        };

        const closeMobileMenu = () => {
            isMobileMenuOpen.value = false;
        };

        const toggleProfileDropdown = () => {
            isProfileDropdownOpen.value = !isProfileDropdownOpen.value;
        };

        const closeProfileDropdown = () => {
            isProfileDropdownOpen.value = false;
        };

        // Click outside listener for dropdown
        window.addEventListener('click', (e) => {
            if (!e.target.closest('.relative')) {
                isProfileDropdownOpen.value = false;
            }
        });

        const logout = async () => {
            try {
                await apiClient.post('/logout');
            } catch (e) {
                console.error("Logout API failed, continuing client logout", e);
            }
            
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.setItem('isLoggedIn', 'false');
            isLoggedIn.value = false;
            window.router.push('/login');
        };

        return {
            isLoggedIn,
            user,
            isMobileMenuOpen,
            isProfileDropdownOpen,
            toggleMobileMenu,
            closeMobileMenu,
            toggleProfileDropdown,
            closeProfileDropdown,
            logout
        };
    }
};

const app = createApp(App);

// Register Global Component
app.component('pagination', PaginationComponent);

app.use(router);
app.mount('#app');
