
import { createRouter, createWebHistory } from 'vue-router'
// import { useStore } from 'vuex'
// const store = useStore()
const configMeta = {
    prefetch:true,
    cache:true
}

const merchantRoutes = (prefix) => [
    {
        path:'shop',
        name:`${prefix}TabShop`,
        component:()=>import('../components/TabShop.vue'),
        meta:{
            ...configMeta
        }
    },
    {
        path:"orders",
        name:`${prefix}TabOrders`,
        component:()=>import('../components/TabOrders.vue'),
        meta:{
           ...configMeta
        }
    },
    {
        path:"analytics",
        name:`${prefix}TabAnalytics`,
        component:()=>import('../components/TabAnalytics.vue'),
        meta:{
            ...configMeta
        }
    },
    {
        path:"return-orders",
        name:`${prefix}TabReturnOrders`,
        component:()=>import('../components/TabReturnedOrders.vue'),
        meta:{
            ...configMeta
        }
    },
    {
        path:"customer-inquiries",
        name:`${prefix}TabInquiries`,
        component:()=>import('../components/TabCustomerInquiries.vue'),
        meta:{
            ...configMeta
        }
    },
    
]
const adminRoutes = [
    ...merchantRoutes('admin'),
    {
        path:"categories",
        name:'TabCategories',
        meta:{
            ...configMeta
        },
        component:()=>import('../components/TabCategories.vue')
    },
    {
        path:"products",
        name:'TabProducts',
        component:()=>import('../components/TabProducts.vue'),
        meta:{
           ...configMeta
        }
    },
    {
        path:"store-manager",
        name:'TabManager',
        component:()=>import('../components/TabManager.vue'),
        meta:{
            ...configMeta
        }
    }
]


const routes = [
    {
        path: '/',
        name: 'store',
        redirect:'/store',
        component: () => import('../views/MainStore.vue'),
        children: [
            {
                path: 'store',
                name: 'tabs',
                component: () => import('../components/TabsClient.vue'),
                ...configMeta
            },
            {
                path: 'search',
                name: 'search',
                component: () => import('../components/ProductSearch.vue'),
            },
            {
                path: 'auth',
                name: 'auth',
                component: () => import('../components/AuthPage.vue'),
                meta:{
                    ...configMeta
                }
            }

        ]
    },
    {
        path: '/store/products/:id',
        name: 'productDetails',
        component: () => import('../views/ProductDetails.vue'),
        props:true
    },
    {
        path: '/seller',
        name: 'seller',
        redirect:'/seller/shop',
        component: () => import('../views/DashboardSeller.vue'),
        children:merchantRoutes('seller')
            
    },
    {
        path: '/admin',
        name: 'admin',
        redirect:'/admin/shop',
        component: () => import('../views/DashboardAdmin.vue'),
        children:[
            ...adminRoutes,
        ]
    },
    {
        path: '/users/:userName/dashboard',
        name: 'user',
        component: () => import('../views/DashboardBuyer.vue')
    },
    {
        path:'/customer-care',
        name:'customerCare',
        component:()=> import('../views/ChatPage.vue')
    },
    {
        path:'/complete-order',
        name:'completeOrder',
        component:()=> import('../views/OrderSuccess.vue')
    },
    {
        path:'/faqs',
        name:'faqs',
        component:()=> import('../views/FaQsPage.vue')
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'notFound',
        component: () => import('../views/NotFound.vue')
    }
]



const router = createRouter({
    history: createWebHistory(),
    routes,
    //sensitive
    //stringifyquery
    //parsequery
    //linkactiveclass
    //linkexactactiveclass
    //end
    
    scrollBehavior(){
        return {top:0, behavior:'smooth'}
    }
})


export default router;