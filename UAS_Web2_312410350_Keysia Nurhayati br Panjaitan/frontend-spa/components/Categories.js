const CategoriesComponent = {
    template: `
        <div class="p-6 max-w-6xl mx-auto">
            <div class="flex justify-between items-center mb-6">
                <h1 class="text-3xl font-bold text-gray-800">Categories</h1>
                <button @click="openModal()" class="bg-primary hover:bg-secondary text-white font-bold py-2 px-4 rounded shadow flex items-center transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                    </svg>
                    Add Category
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
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        <tr v-if="loading">
                            <td colspan="4" class="px-6 py-4 text-center text-gray-500">Loading data...</td>
                        </tr>
                        <tr v-if="!loading && categories.length === 0">
                            <td colspan="4" class="px-6 py-4 text-center text-gray-500">No categories found.</td>
                        </tr>
                        <tr v-for="cat in paginatedData" :key="cat.id" class="hover:bg-gray-50 transition-colors">
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ cat.id }}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ cat.name }}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ cat.description }}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button @click="openModal(cat)" class="text-indigo-600 hover:text-indigo-900 mr-3 transition-colors">Edit</button>
                                <button @click="promptDelete(cat.id)" class="text-red-600 hover:text-red-900 transition-colors">Delete</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
                </div>
                <!-- Reusable Pagination Component -->
                <pagination 
                    v-if="!loading && categories.length > 0"
                    :current-page="currentPage" 
                    :total-items="categories.length" 
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
                        <form @submit.prevent="saveCategory">
                            <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4" id="modal-title">
                                    {{ isEdit ? 'Edit Category' : 'Add Category' }}
                                </h3>
                                <div class="space-y-4">
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700">Name</label>
                                        <input v-model="form.name" type="text" required class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm">
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700">Description</label>
                                        <textarea v-model="form.description" rows="3" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"></textarea>
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
                                    <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">Delete Category</h3>
                                    <div class="mt-2">
                                        <p class="text-sm text-gray-500">Are you sure you want to delete this category? All products associated with this category will also be permanently deleted. This action cannot be undone.</p>
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
                name: '',
                description: ''
            },
            alert: { show: false, message: '', type: 'success' }
        }
    },
    computed: {
        paginatedData() {
            const start = (this.currentPage - 1) * this.itemsPerPage;
            const end = start + this.itemsPerPage;
            return this.categories.slice(start, end);
        }
    },
    mounted() {
        this.fetchCategories();
    },
    methods: {
        showAlert(message, type = 'success') {
            this.alert = { show: true, message, type };
            setTimeout(() => { this.alert.show = false; }, 3000);
        },
        async fetchCategories() {
            this.loading = true;
            try {
                const res = await apiClient.get('/categories');
                this.categories = res.data;
            } catch (error) {
                this.showAlert('Failed to load categories', 'error');
            } finally {
                this.loading = false;
            }
        },
        openModal(category = null) {
            this.isEdit = !!category;
            if (category) {
                this.form = { ...category };
            } else {
                this.form = { id: null, name: '', description: '' };
            }
            this.showModal = true;
        },
        closeModal() {
            this.showModal = false;
        },
        async saveCategory() {
            this.saving = true;
            try {
                if (this.isEdit) {
                    await apiClient.put('/categories/' + this.form.id, this.form);
                    this.showAlert('Category updated successfully');
                } else {
                    await apiClient.post('/categories', this.form);
                    this.showAlert('Category added successfully');
                }
                this.closeModal();
                this.fetchCategories();
            } catch (error) {
                this.showAlert('Failed to save category', 'error');
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
                await apiClient.delete('/categories/' + this.deleteTargetId);
                this.showAlert('Category deleted successfully');
                this.fetchCategories();
                // Ensure page logic stays consistent if last item on page is deleted
                const maxPage = Math.ceil((this.categories.length - 1) / this.itemsPerPage) || 1;
                if (this.currentPage > maxPage) this.currentPage = maxPage;
            } catch (error) {
                this.showAlert('Failed to delete category', 'error');
            } finally {
                this.closeDeleteModal();
            }
        }
    }
};
