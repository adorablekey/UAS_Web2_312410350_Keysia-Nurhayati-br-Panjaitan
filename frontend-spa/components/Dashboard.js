const DashboardComponent = {
    template: `
        <div class="p-6 max-w-7xl mx-auto">
            <div class="flex justify-between items-center mb-6">
                <h1 class="text-3xl font-bold text-gray-800">Dashboard</h1>
                <p class="text-sm font-medium text-gray-500 bg-white px-4 py-2 rounded-full shadow-sm">
                    Welcome back, <span class="text-primary font-bold">{{ user.name }}</span>!
                </p>
            </div>
            
            <!-- Statistics Cards -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <!-- Categories Card -->
                <div class="bg-white rounded-xl shadow-md p-6 border-l-4 border-primary hover:shadow-lg transition-shadow">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center">
                            <div class="p-3 rounded-full bg-pink-100 text-primary">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                </svg>
                            </div>
                            <div class="ml-4">
                                <h2 class="text-sm font-semibold text-gray-500 uppercase tracking-wider">Categories</h2>
                                <p class="text-3xl font-extrabold text-gray-900">{{ categoriesCount }}</p>
                            </div>
                        </div>
                    </div>
                    <div class="mt-4 pt-4 border-t border-gray-100">
                        <router-link to="/categories" class="text-primary hover:text-secondary font-medium text-sm flex items-center">
                            Manage Categories
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
                        </router-link>
                    </div>
                </div>

                <!-- Products Card -->
                <div class="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500 hover:shadow-lg transition-shadow">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center">
                            <div class="p-3 rounded-full bg-green-100 text-green-600">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                            </div>
                            <div class="ml-4">
                                <h2 class="text-sm font-semibold text-gray-500 uppercase tracking-wider">Products</h2>
                                <p class="text-3xl font-extrabold text-gray-900">{{ productsCount }}</p>
                            </div>
                        </div>
                    </div>
                    <div class="mt-4 pt-4 border-t border-gray-100">
                        <router-link to="/products" class="text-green-600 hover:text-green-700 font-medium text-sm flex items-center">
                            Manage Products
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
                        </router-link>
                    </div>
                </div>

                <!-- Transactions Card -->
                <div class="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500 hover:shadow-lg transition-shadow">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center">
                            <div class="p-3 rounded-full bg-purple-100 text-purple-600">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                </svg>
                            </div>
                            <div class="ml-4">
                                <h2 class="text-sm font-semibold text-gray-500 uppercase tracking-wider">Transactions</h2>
                                <p class="text-3xl font-extrabold text-gray-900">{{ transactionsCount }}</p>
                            </div>
                        </div>
                    </div>
                    <div class="mt-4 pt-4 border-t border-gray-100">
                        <router-link to="/transactions" class="text-purple-600 hover:text-purple-700 font-medium text-sm flex items-center">
                            Manage Transactions
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
                        </router-link>
                    </div>
                </div>
            </div>
            
            <!-- Lower Panels -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <!-- Recent Transactions -->
                <div class="bg-white rounded-xl shadow-md overflow-hidden">
                    <div class="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                        <h2 class="text-lg font-bold text-gray-800">Recent Transactions</h2>
                        <router-link to="/transactions" class="text-sm text-primary hover:underline">View All</router-link>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="min-w-full divide-y divide-gray-200">
                            <thead class="bg-white">
                                <tr>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                                    <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                    <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Qty</th>
                                </tr>
                            </thead>
                            <tbody class="bg-white divide-y divide-gray-200">
                                <tr v-if="loading" class="animate-pulse">
                                    <td colspan="4" class="px-6 py-4 text-center text-gray-400">Loading...</td>
                                </tr>
                                <tr v-else-if="recentTransactions.length === 0">
                                    <td colspan="4" class="px-6 py-4 text-center text-gray-500">No recent transactions.</td>
                                </tr>
                                <tr v-for="trx in recentTransactions" :key="trx.id" class="hover:bg-gray-50">
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatDate(trx.date) }}</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ trx.product_name || 'Deleted Product' }}</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-center text-sm">
                                        <span v-if="trx.type === 'in'" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">IN</span>
                                        <span v-else class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">OUT</span>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-center text-sm font-bold text-gray-700">{{ trx.quantity }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Low Stock Alerts -->
                <div class="bg-white rounded-xl shadow-md overflow-hidden border-t-4 border-red-500">
                    <div class="px-6 py-4 border-b border-gray-200 bg-red-50 flex items-center">
                        <svg class="h-6 w-6 text-red-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <h2 class="text-lg font-bold text-red-800">Low Stock Alerts</h2>
                    </div>
                    <ul class="divide-y divide-gray-200 h-64 overflow-y-auto">
                        <li v-if="loading" class="px-6 py-4 text-center text-gray-400 animate-pulse">Checking stock...</li>
                        <li v-else-if="lowStockProducts.length === 0" class="px-6 py-8 text-center flex flex-col items-center justify-center text-gray-500">
                            <svg class="h-10 w-10 text-green-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p>All products are sufficiently stocked.</p>
                        </li>
                        <li v-for="prod in lowStockProducts" :key="prod.id" class="px-6 py-4 hover:bg-gray-50 flex justify-between items-center transition-colors">
                            <div>
                                <p class="text-sm font-medium text-gray-900">{{ prod.name }}</p>
                                <p class="text-xs text-gray-500">{{ prod.category_name || 'Uncategorized' }}</p>
                            </div>
                            <div class="text-right flex flex-col items-end">
                                <span class="px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full" :class="prod.stock === 0 ? 'bg-red-100 text-red-800' : 'bg-orange-100 text-orange-800'">
                                    Stock: {{ prod.stock }}
                                </span>
                                <router-link to="/products" class="text-xs mt-1 text-primary hover:underline">Restock &rarr;</router-link>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    `,
    data() {
        return {
            user: JSON.parse(localStorage.getItem('user') || '{}'),
            categoriesCount: 0,
            productsCount: 0,
            transactionsCount: 0,
            recentTransactions: [],
            lowStockProducts: [],
            loading: true
        }
    },
    methods: {
        formatDate(dateString) {
            const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
            return new Date(dateString).toLocaleDateString('id-ID', options);
        }
    },
    async mounted() {
        try {
            const [catRes, prodRes, trxRes] = await Promise.all([
                apiClient.get('/categories'),
                apiClient.get('/products'),
                apiClient.get('/transactions')
            ]);
            
            // Statistics
            this.categoriesCount = catRes.data.length || 0;
            const products = prodRes.data || [];
            this.productsCount = products.length;
            const transactions = trxRes.data || [];
            this.transactionsCount = transactions.length;

            // Low Stock alerts (Stock <= 5)
            this.lowStockProducts = products.filter(p => p.stock <= 5).sort((a, b) => a.stock - b.stock);

            // Recent Transactions (Last 5)
            this.recentTransactions = transactions.slice(0, 5);

        } catch (error) {
            console.error('Error fetching dashboard stats', error);
        } finally {
            this.loading = false;
        }
    }
};
