const ProductsComponent = {
    template: `
        <div class="p-6 max-w-6xl mx-auto">
            <div class="flex justify-between items-center mb-6">
                <h1 class="text-3xl font-bold text-gray-800">Products</h1>
                <button @click="openModal()" class="bg-primary hover:bg-secondary text-white font-bold py-2 px-4 rounded shadow flex items-center transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                    </svg>
                    Add Product
                </button>
            </div>

            <!-- Error/Success Alert -->
            <div v-if="alert.show" :class="['p-4 mb-6 rounded shadow-sm border-l-4', alert.type === 'error' ? 'bg-red-100 border-red-500 text-red-700' : 'bg-green-100 border-green-500 text-green-700']">
                {{ alert.message }}
            </div>

            <!-- Table -->
            <div class="bg-white rounded-xl shadow overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supplier</th>
                            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        <tr v-if="loading">
                            <td colspan="6" class="px-6 py-4 text-center text-gray-500">Loading data...</td>
                        </tr>
                        <tr v-if="!loading && products.length === 0">
                            <td colspan="6" class="px-6 py-4 text-center text-gray-500">No products found.</td>
                        </tr>
                        <tr v-for="prod in paginatedData" :key="prod.id" class="hover:bg-gray-50 transition-colors">
                            <td class="px-6 py-4 whitespace-nowrap">
                                <img v-if="prod.image" :src="'http://localhost:8080/uploads/products/' + prod.image" class="h-10 w-10 rounded-md object-cover border border-gray-200" alt="Product Image">
                                <div v-else class="h-10 w-10 rounded-md bg-gray-100 flex items-center justify-center border border-gray-200">
                                    <svg class="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ prod.id }}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ prod.name }}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                    {{ prod.category_name || 'Uncategorized' }}
                                </span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-center text-sm font-bold" :class="prod.stock > 0 ? 'text-green-600' : 'text-red-600'">
                                {{ prod.stock }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ prod.supplier || '-' }}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button @click="openModal(prod)" class="text-indigo-600 hover:text-indigo-900 mr-3 transition-colors">Edit</button>
                                <button @click="promptDelete(prod.id)" class="text-red-600 hover:text-red-900 transition-colors">Delete</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
                </div>
                <!-- Reusable Pagination Component -->
                <pagination 
                    v-if="!loading && products.length > 0"
                    :current-page="currentPage" 
                    :total-items="products.length" 
                    :items-per-page="itemsPerPage" 
                    @page-changed="currentPage = $event">
                </pagination>
            </div>

            <!-- Modal Form -->
            <div v-if="showModal" class="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                    <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="closeModal"></div>
                    <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                    <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                        <form @submit.prevent="saveProduct">
                            <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4" id="modal-title">
                                    {{ isEdit ? 'Edit Product' : 'Add Product' }}
                                </h3>
                                <div class="space-y-4">
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700">Product Image (Optional)</label>
                                        <input @change="handleFileUpload" type="file" accept="image/*" class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-primary hover:file:bg-blue-100 cursor-pointer border border-gray-300 rounded-md py-2 px-3 focus:outline-none">
                                        <p v-if="form.image && typeof form.image === 'string'" class="mt-2 text-xs text-green-600">Current image: {{ form.image }}</p>
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700">Name</label>
                                        <input v-model="form.name" type="text" required class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm">
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700">Category</label>
                                        <select v-model="form.category_id" required class="mt-1 block w-full border border-gray-300 bg-white rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm">
                                            <option disabled value="">Select a category</option>
                                            <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700">Stock</label>
                                        <input v-model="form.stock" type="number" required class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm">
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700">Supplier <span class="text-red-500">*</span></label>
                                        <input v-model="form.supplier" type="text" required class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm">
                                    </div>
                                </div>
                            </div>
                            <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button type="submit" :disabled="saving" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary text-base font-medium text-white hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50">
                                    {{ saving ? 'Saving...' : 'Save' }}
                                </button>
                                <button type="button" @click="closeModal" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <!-- Delete Confirmation Modal -->
            <div v-if="showDeleteModal" class="fixed z-20 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                    <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="closeDeleteModal"></div>
                    <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                    <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md sm:w-full">
                        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                            <div class="sm:flex sm:items-start">
                                <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                                    <svg class="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                </div>
                                <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                    <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">Delete Product</h3>
                                    <div class="mt-2">
                                        <p class="text-sm text-gray-500">Are you sure you want to delete this product? This action cannot be undone.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                            <button type="button" @click="confirmDelete" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm">
                                Delete
                            </button>
                            <button type="button" @click="closeDeleteModal" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                                Cancel
                            </button>
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
            loading: false,
            showModal: false,
            showDeleteModal: false,
            deleteTargetId: null,
            saving: false,
            currentPage: 1,
            itemsPerPage: 8,
            isEdit: false,
            form: {
                id: null,
                category_id: '',
                name: '',
                stock: 0,
                supplier: '',
                image: null
            },
            selectedFile: null,
            alert: { show: false, message: '', type: 'success' }
        }
    },
    computed: {
        paginatedData() {
            const start = (this.currentPage - 1) * this.itemsPerPage;
            const end = start + this.itemsPerPage;
            return this.products.slice(start, end);
        }
    },
    mounted() {
        this.fetchProducts();
        this.fetchCategories();
    },
    methods: {
        showAlert(message, type = 'success') {
            this.alert = { show: true, message, type };
            setTimeout(() => { this.alert.show = false; }, 3000);
        },
        async fetchProducts() {
            this.loading = true;
            try {
                const res = await apiClient.get('/products');
                this.products = res.data;
            } catch (error) {
                this.showAlert('Failed to load products', 'error');
            } finally {
                this.loading = false;
            }
        },
        async fetchCategories() {
            try {
                const res = await apiClient.get('/categories');
                this.categories = res.data;
            } catch (error) {
                console.error("Failed to fetch categories");
            }
        },
        openModal(product = null) {
            this.isEdit = !!product;
            this.selectedFile = null; // Reset file selection
            if (product) {
                this.form = { ...product };
            } else {
                this.form = { id: null, category_id: '', name: '', stock: 0, supplier: '', image: null };
            }
            this.showModal = true;
        },
        closeModal() {
            this.showModal = false;
        },
        handleFileUpload(event) {
            this.selectedFile = event.target.files[0];
        },
        async saveProduct() {
            this.saving = true;
            try {
                const user = JSON.parse(localStorage.getItem('user') || '{}');
                
                // Use FormData to allow file uploads
                let formData = new FormData();
                formData.append('user_id', user.id);
                formData.append('category_id', this.form.category_id);
                formData.append('name', this.form.name);
                formData.append('stock', this.form.stock);
                formData.append('supplier', this.form.supplier);
                
                if (this.selectedFile) {
                    formData.append('image', this.selectedFile);
                }

                if (this.isEdit) {
                    await apiClient.post('/products/update/' + this.form.id, formData, {
                        headers: { 'Content-Type': 'multipart/form-data' }
                    });
                    this.showAlert('Product updated successfully');
                } else {
                    await apiClient.post('/products', formData, {
                        headers: { 'Content-Type': 'multipart/form-data' }
                    });
                    this.showAlert('Product added successfully');
                }
                this.closeModal();
                this.fetchProducts();
            } catch (error) {
                this.showAlert('Failed to save product', 'error');
            } finally {
                this.saving = false;
            }
        },
        promptDelete(id) {
            this.deleteTargetId = id;
            this.showDeleteModal = true;
        },
        closeDeleteModal() {
            this.showDeleteModal = false;
            this.deleteTargetId = null;
        },
        async confirmDelete() {
            if (!this.deleteTargetId) return;
            try {
                await apiClient.delete('/products/' + this.deleteTargetId);
                this.showAlert('Product deleted successfully');
                this.fetchProducts();
                // Ensure page logic stays consistent if last item on page is deleted
                const maxPage = Math.ceil((this.products.length - 1) / this.itemsPerPage) || 1;
                if (this.currentPage > maxPage) this.currentPage = maxPage;
            } catch (error) {
                this.showAlert('Failed to delete product', 'error');
            } finally {
                this.closeDeleteModal();
            }
        }
    }
};
