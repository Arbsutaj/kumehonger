import Vue from 'vue';
import App from './App.vue';
import Vuesax from 'vuesax';
import VueRouter from 'vue-router';
import {BootstrapVue, BootstrapVueIcons, IconsPlugin} from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import 'vuesax/dist/vuesax.css';
import 'material-icons/iconfont/material-icons.css';
import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/default.css'
import 'boxicons';
import router from './routes';
import axios from 'axios';
import VueAxios from 'vue-axios';
import store from './store';
import Dropdown from 'vue-simple-search-dropdown';
import VueGeolocation from 'vue-browser-geolocation';
import moment from 'moment';
import VueMaterial from 'vue-material';


Vue.config.productionTip = false;
Vue.use(BootstrapVue, IconsPlugin, BootstrapVueIcons);
Vue.use(Vuesax, {});
Vue.use(VueRouter);
Vue.use(VueAxios, axios);
Vue.use(Dropdown);
Vue.use(VueGeolocation);
Vue.use(VueMaterial);

Vue.filter('formatDate', function(value) {
    if (value) {
        return moment(String(value)).format('MM/DD/YYYY hh:mm')
    }
});

axios.defaults.baseURL = 'http://localhost:3000/api';
const token = localStorage.getItem('token');
if (token)
    axios.defaults.headers.common['Authorization'] = token;

axios.interceptors.response.use((response) => {
    return response;
}, function (error) {
    if (error) {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {

            originalRequest._retry = true;
            store.dispatch('AUTH_LOGOUT');
            return router.push('/login');
        }

        return Promise.reject(error);
    }
});

Vue.config.productionTip = false;
new Vue({
    store,
    router,
    render: h => h(App),
}).$mount('#app');
