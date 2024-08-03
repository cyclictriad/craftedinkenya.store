import './style.css'

import { createApp } from 'vue'
import { createHead } from '@vueuse/head';
import App from './App.vue';
import router from './routes';
import store from './store';
import './axios'

const app = createApp(App)
const head = createHead();
app.use(head)
app.use(router);
app.use(store);
app.mount("#app")
