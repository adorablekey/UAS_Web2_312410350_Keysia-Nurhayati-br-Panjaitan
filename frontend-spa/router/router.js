// Define Routes
const routes = [
    { 
        path: '/login', 
        name: 'Login',
        component: LoginComponent,
        meta: { requiresGuest: true }
    },
    { 
        path: '/', 
        name: 'Landing',
        component: LandingComponent,
        meta: { requiresGuest: false }
    },
    { 
        path: '/dashboard', 
        name: 'Dashboard',
        component: DashboardComponent,
        meta: { requiresAuth: true }
    },
    { 
        path: '/categories', 
        name: 'Categories',
        component: CategoriesComponent,
        meta: { requiresAuth: true }
    },
    { 
        path: '/products', 
        name: 'Products',
        component: ProductsComponent,
        meta: { requiresAuth: true }
    },
    { 
        path: '/transactions', 
        name: 'Transactions',
        component: TransactionsComponent,
        meta: { requiresAuth: true }
    },
    { 
        path: '/profile', 
        name: 'Profile',
        component: ProfileComponent,
        meta: { requiresAuth: true }
    }
];

// Create Router
const router = VueRouter.createRouter({
    history: VueRouter.createWebHashHistory(),
    routes
});

// Navigation Guards
router.beforeEach((to, from, next) => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (!isLoggedIn) {
            next({ name: 'Login' });
        } else {
            next();
        }
    } else if (to.matched.some(record => record.meta.requiresGuest)) {
        if (isLoggedIn) {
            next({ name: 'Dashboard' });
        } else {
            next();
        }
    } else {
        next();
    }
});

// Expose router globally
window.router = router;
