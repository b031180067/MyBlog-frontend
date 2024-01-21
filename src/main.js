import '@/assets/main.scss';
import { createApp } from 'vue';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import { createPersistedState } from 'pinia-persistedstate-plugin';
import locale from 'element-plus/dist/locale/zh-tw.mjs';

// import * as ElementPlusIconsVue from '@element-plus/icons-vue'
// 全局使用ElementPlus Icons
// for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
//   app.component(key, component)
// }

const app = createApp(App);
const pinia = createPinia();
const persist = createPersistedState();

// 使用persist插件
pinia.use(persist);

// 使用pinia
app.use(pinia);

// 使用router
app.use(router);

// 使用ElementPlus
app.use(ElementPlus, { locale });


app.mount('#app');
