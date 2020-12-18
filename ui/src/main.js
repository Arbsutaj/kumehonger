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
import {routes} from './routes';
import axios from 'axios';
import VueAxios from 'vue-axios';

Vue.config.productionTip = false;
Vue.use(BootstrapVue, IconsPlugin, BootstrapVueIcons);
Vue.use(Vuesax, {});
Vue.use(VueRouter);
Vue.use(VueAxios, axios);

const router = new VueRouter({routes, mode: 'history'});
new Vue({
    router,
    render: h => h(App),
}).$mount('#app');
