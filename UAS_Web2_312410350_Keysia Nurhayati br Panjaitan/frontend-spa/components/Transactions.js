const TransactionsComponent = {
    template: `
        <div class="p-6 max-w-6xl mx-auto">
            <div class="flex justify-between items-center mb-6">
                <h1 class="text-3xl font-bold text-gray-800">Transaction History</h1>
                <button @click="openModal()" class="bg-primary hover:bg-secondary text-white font-bold py-2 px-4 rounded shadow flex items-center transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                    </svg>
                    New Transaction
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
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                            <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supplier</th>
                            <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
                            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        <tr v-if="loading">
                            <td colspan="6" class="px-6 py-4 text-center text-gray-500">Loading data...</td>
                        </tr>
                        <tr v-if="!loading && transactions.length === 0">
                            <td colspan="6" class="px-6 py-4 text-center text-gray-500">No transactions recorded.</td>
                        </tr>
                        <tr v-for="trx in paginatedData" :key="trx.id" class="hover:bg-gray-50 transition-colors">
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatDate(trx.date) }}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ trx.product_name || 'Deleted Product' }}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-center text-sm">
                                <span v-if="trx.type === 'in'" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                    IN (Masuk)
                                </span>
                                <span v-else class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                    OUT (Keluar)
                                </span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ trx.supplier || '-' }}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-center text-sm font-bold text-gray-700">{{ trx.quantity }}</td>
                            <td class="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{{ trx.notes || '-' }}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button @click="promptDelete(trx.id)" class="text-red-600 hover:text-red-900 transition-colors">Delete Log</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
                </div>
                <!-- Reusable Pagination Component -->
                <pagination 
                    v-if="!loading && transactions.length > 0"
                    :current-page="currentPage" 
                    :total-items="transactions.length" 
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
                        <form @submit.prevent="saveTransaction">
                            <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4" id="modal-title">
                                    Record New Transaction
                                </h3>
                                <div class="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
                                    <div class="flex">
                                        <div class="flex-shrink-0">
                                            <svg class="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                                            </svg>
                                        </div>
                                        <div class="ml-3">
                                            <p class="text-sm text-blue-700">Recording a transaction will automatically update the product's current stock.</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="space-y-4">
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700">Product</label>
                                        <select v-model="form.product_id" required class="mt-1 block w-full border border-gray-300 bg-white rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm">
                                            <option disabled value="">Select a product</option>
                                            <option v-for="prod in products" :key="prod.id" :value="prod.id">{{ prod.name }} (Current Stock: {{ prod.stock }})</option>
                                        </select>
                                    </div>
                                    <div class="grid grid-cols-2 gap-4">
                                        <div>
                                            <label class="block text-sm font-medium text-gray-700">Transaction Type</label>
                                            <select v-model="form.type" required class="mt-1 block w-full border border-gray-300 bg-white rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm">
                                                <option value="in">IN (Barang Masuk)</option>
                                                <option value="out">OUT (Barang Keluar)</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label class="block text-sm font-medium text-gray-700">Quantity</label>
                                            <input v-model="form.quantity" type="number" min="1" required class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm">
                                        </div>
                                    </div>
                                    <div v-if="form.type === 'in'">
                                        <label class="block text-sm font-medium text-gray-700">Supplier <span class="text-red-500">*</span></label>
                                        <input v-model="form.supplier" type="text" :required="form.type === 'in'" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm">
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700">Date</label>
                                        <input v-model="form.date" type="date" required class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm">
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700">Notes (Optional)</label>
                                        <textarea v-model="form.notes" rows="2" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"></textarea>
                                    </div>
                                </div>
                            </div>
                            <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button type="submit" :disabled="saving" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary text-base font-medium text-white hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50">
                                    {{ saving ? 'Processing...' : 'Save Transaction' }}
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
                                    <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">Delete Log Entry</h3>
                                    <div class="mt-2">
                                        <p class="text-sm text-gray-500">Are you sure you want to delete this transaction log? Note: This will NOT revert the product stock.</p>
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
            transactions: [],
            products: [],
            loading: false,
            showModal: false,
            showDeleteModal: false,
            deleteTargetId: null,
            saving: false,
            currentPage: 1,
            itemsPerPage: 8,
            form: {
                product_id: '',
                type: 'in',
                supplier: '',
                quantity: 1,
                date: new Date().toISOString().split('T')[0],
                notes: ''
            },
            alert: { show: false, message: '', type: 'success' }
        }
    },
    computed: {
        paginatedData() {
            const start = (this.currentPage - 1) * this.itemsPerPage;
            const end = start + this.itemsPerPage;
            return this.transactions.slice(start, end);
        }
    },
    mounted() {
        this.fetchTransactions();
        this.fetchProducts();
    },
    methods: {
        formatDate(dateStr) {
            return new Date(dateStr).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
        },
        showAlert(message, type = 'success') {
            this.alert = { show: true, message, type };
            setTimeout(() => { this.alert.show = false; }, 3000);
        },
        async fetchTransactions() {
            this.loading = true;
            try {
                const res = await apiClient.get('/transactions');
                this.transactions = res.data;
            } catch (error) {
                this.showAlert('Failed to load transactions', 'error');
            } finally {
                this.loading = false;
            }
        },
        async fetchProducts() {
            try {
                const res = await apiClient.get('/products');
                this.products = res.data;
            } catch (error) {
                console.error("Failed to fetch products");
            }
        },
        openModal() {
            this.form = { product_id: '', type: 'in', supplier: '', quantity: 1, date: new Date().toISOString().split('T')[0], notes: '' };
            this.showModal = true;
        },
        closeModal() {
            this.showModal = false;
        },
        async saveTransaction() {
            this.saving = true;
            try {
                await apiClient.post('/transactions', this.form);
                this.showAlert('Transaction saved and stock updated!');
                this.closeModal();
                this.fetchTransactions();
                this.fetchProducts(); // refresh products stock
            } catch (error) {
                this.showAlert('Failed to save transaction', 'error');
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
                await apiClient.delete('/transactions/' + this.deleteTargetId);
                this.showAlert('Log deleted successfully');
                this.fetchTransactions();
                // Ensure page logic stays consistent if last item on page is deleted
                const maxPage = Math.ceil((this.transactions.length - 1) / this.itemsPerPage) || 1;
                if (this.currentPage > maxPage) this.currentPage = maxPage;
            } catch (error) {
                this.showAlert('Failed to delete transaction', 'error');
            } finally {
                this.closeDeleteModal();
            }
        }
    }
};
