import Vue from 'vue';
import App from './App.vue';
import Vuesax from 'vuesax';
import VueRouter from 'vue-router';
import {BootstrapVue, IconsPlugin, BootstrapVueIcons} from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import 'vuesax/dist/vuesax.css';
import 'material-icons/iconfont/material-icons.css';
import 'vuesax/dist/vuesax.css';
import 'boxicons';
import router from './routes';
import axios from 'axios';
import VueAxios from 'vue-axios';
import store from './store';

Vue.config.productionTip = false;
Vue.use(BootstrapVue, IconsPlugin, BootstrapVueIcons);
Vue.use(Vuesax, {});
Vue.use(VueRouter);
Vue.use(VueAxios, axios);

axios.defaults.baseURL = 'http://localhost:3000/api';
const token = localStorage.getItem('token');
if (token)
    axios.defaults.headers.common['Authorization'] = token;

Vue.config.productionTip = false;
new Vue({
    store,
    router,
    render: h => h(App),
}).$mount('#app');
