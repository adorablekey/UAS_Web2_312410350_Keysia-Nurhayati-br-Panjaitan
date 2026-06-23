const LandingComponent = {
    template: `
        <div>
            <!-- Hero Section -->
            <div class="bg-primary text-white">
                <div class="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8 text-center">
                    <h1 class="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
                        E-Inventory Management
                    </h1>
                    <p class="mt-4 max-w-3xl text-xl mx-auto text-primary-100">
                        Sistem manajemen inventaris barang modern, responsif, dan mudah digunakan. Pantau ketersediaan produk dan kategori barang secara real-time.
                    </p>
                    <div class="mt-10 max-w-sm mx-auto sm:max-w-none sm:flex sm:justify-center">
                        <div class="space-y-4 sm:space-y-0 sm:mx-auto sm:inline-grid sm:grid-cols-1 sm:gap-5">
                            <button @click="scrollToCatalog" class="flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-primary bg-white hover:bg-gray-50 sm:px-8 transition-colors">
                                Jelajahi Katalog Produk
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Summary Section -->
            <div id="summary" class="max-w-7xl mx-auto pt-12 pb-6 px-4 sm:px-6 lg:pt-16 lg:pb-8 lg:px-8">
                <div class="text-center mb-8">
                    <h2 class="text-3xl font-extrabold text-gray-900 sm:text-4xl">Ringkasan Sistem</h2>
                    <p class="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
                        Data terkini mengenai barang dan kategori di dalam inventaris kami.
                    </p>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-8 text-center">
                    <!-- Categories Stat -->
                    <div class="bg-white overflow-hidden shadow-lg rounded-lg transform transition-all hover:scale-105 duration-300">
                        <div class="px-4 py-5 sm:p-6 bg-blue-50">
                            <dt class="text-base font-medium text-blue-800 truncate">Total Kategori</dt>
                            <dd class="mt-1 text-5xl font-extrabold text-blue-600">
                                <span v-if="loading" class="text-2xl text-gray-400">Loading...</span>
                                <span v-else>{{ categoriesCount }}</span>
                            </dd>
                        </div>
                    </div>

                    <!-- Products Stat -->
                    <div class="bg-white overflow-hidden shadow-lg rounded-lg transform transition-all hover:scale-105 duration-300">
                        <div class="px-4 py-5 sm:p-6 bg-green-50">
                            <dt class="text-base font-medium text-green-800 truncate">Total Produk</dt>
                            <dd class="mt-1 text-5xl font-extrabold text-green-600">
                                <span v-if="loading" class="text-2xl text-gray-400">Loading...</span>
                                <span v-else>{{ productsCount }}</span>
                            </dd>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Public Catalog Section -->
            <div id="catalog" class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 bg-gray-50 rounded-xl mb-12 shadow-inner">
                <div class="text-center mb-10">
                    <h2 class="text-3xl font-extrabold text-gray-900 sm:text-4xl">Katalog Etalase</h2>
                    <p class="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
                        Jelajahi ketersediaan produk kami saat ini.
                    </p>
                </div>
                
                <!-- Search & Filter Bar -->
                <div class="max-w-3xl mx-auto mb-10 flex flex-col sm:flex-row gap-4">
                    <div class="relative rounded-md shadow-sm flex-1">
                        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
                            </svg>
                        </div>
                        <input v-model="searchQuery" type="text" class="focus:ring-primary focus:border-primary block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-3" placeholder="Cari nama produk...">
                    </div>
                    <div class="sm:w-64">
                        <select v-model="selectedCategory" class="focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md py-3 bg-white">
                            <option value="">Semua Kategori</option>
                            <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
                        </select>
                    </div>
                </div>

                <!-- Product Grid -->
                <div v-if="loading" class="text-center py-10">
                    <p class="text-gray-500 text-lg">Memuat katalog...</p>
                </div>
                <div v-else-if="filteredProducts.length === 0" class="text-center py-10">
                    <p class="text-gray-500 text-lg">Tidak ada produk yang cocok dengan pencarian Anda.</p>
                </div>
                <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    <div v-for="prod in filteredProducts" :key="prod.id" class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
                        <!-- Product Image -->
                        <div class="w-full h-48 bg-gray-200 flex items-center justify-center overflow-hidden">
                            <img v-if="prod.image" :src="'http://localhost:8080/uploads/products/' + prod.image" class="w-full h-full object-cover" alt="Product Image">
                            <svg v-else class="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <!-- Product Info -->
                        <div class="p-5">
                            <p class="text-xs font-semibold text-primary uppercase tracking-wide mb-1">{{ prod.category_name || 'Uncategorized' }}</p>
                            <h3 class="text-lg font-bold text-gray-900 truncate" :title="prod.name">{{ prod.name }}</h3>
                            <div class="mt-4 flex items-center justify-between">
                                <span class="text-sm text-gray-500">Ketersediaan:</span>
                                <span v-if="prod.stock > 0" class="px-2 py-1 bg-green-100 text-green-800 text-xs font-bold rounded-full">
                                    Tersedia ({{ prod.stock }})
                                </span>
                                <span v-else class="px-2 py-1 bg-red-100 text-red-800 text-xs font-bold rounded-full">
                                    Habis
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    data() {
        return {
            products: [],
            categories: [],
            searchQuery: '',
            selectedCategory: '',
            categoriesCount: 0,
            productsCount: 0,
            loading: true
        }
    },
    computed: {
        filteredProducts() {
            let result = this.products;
            
            if (this.selectedCategory) {
                result = result.filter(p => p.category_id == this.selectedCategory);
            }
            
            if (this.searchQuery) {
                const query = this.searchQuery.toLowerCase();
                result = result.filter(p => p.name.toLowerCase().includes(query));
            }
            
            return result;
        }
    },
    methods: {
        scrollToCatalog() {
            const el = document.getElementById('catalog');
            if (el) {
                el.scrollIntoView({ behavior: 'smooth' });
            }
        }
    },
    async mounted() {
        try {
            const [catRes, prodRes] = await Promise.all([
                apiClient.get('/categories'),
                apiClient.get('/products')
            ]);
            this.categories = catRes.data || [];
            this.categoriesCount = this.categories.length;
            this.products = prodRes.data || [];
            this.productsCount = this.products.length;
        } catch (error) {
            console.error('Error fetching data for landing page', error);
        } finally {
            this.loading = false;
        }
    }
};
