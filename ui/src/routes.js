import MainPage from "./components/main-page/MainPage";
import RestaurantDetails from "./components/restaurant/RestaurantDetails";
import Login from "./components/login/Login";
import store from './store';
import VueRouter from "vue-router";

const ifAuthenticated = (to, from, next) => {
    if (store.getters.isAuthenticated) {
        next();
        return
    }
    next('/login');
};

const ifNotAuthenticated = (to, from, next) => {
    if (!store.getters.isAuthenticated) {
        next();
        return
    }
    next('/');
};

const routes = [
    {path: '/', component: MainPage, name: 'Home', beforeEnter: ifAuthenticated},
    {path: '/restaurant-details/:id', component: RestaurantDetails, props: true},
    {path: '/login', component: Login, beforeEnter: ifNotAuthenticated},
];

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
});

export default router;
