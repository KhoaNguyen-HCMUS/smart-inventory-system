import DefaultLayout from '@/layouts/defaultLayout.vue';
import Home from '@/pages/home.vue';
import Products from '@/pages/products.vue';
import Suppliers from '@/pages/suppliers.vue';
import Customers from '@/pages/customers.vue';
import { createRouter, createWebHistory } from 'vue-router';

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: DefaultLayout,
      children: [
        { path: '', component: Home },
        { path: 'products', component: Products },
        { path: 'suppliers', component: Suppliers },
        { path: 'customers', component: Customers },
      ],
    },
  ],
});
