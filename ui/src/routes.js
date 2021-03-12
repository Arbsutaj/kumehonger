import MainPage from "./components/main-page/MainPage";
import RestaurantDetails from "./components/restaurant/RestaurantDetails";
import Login from "./components/login/Login";
import store from './store';
import VueRouter from "vue-router";
import RestaurantOperations from "./components/restaurant/RestaurantOperations";
import Profile from "@/components/user/profile/Profile";
import ProfileSettings from "@/components/user/profile/ProfileSettings";

const ifAuthenticated = (to, from, next) => {
    if (store.getters.isAuthenticated) {
        next();
        return;
    }
    next('/login');
};

const ifNotAuthenticated = (to, from, next) => {
    if (!store.getters.isAuthenticated) {
        next();
        return;
    }
    next('/');
};

const routes = [
    {path: '/', component: MainPage, name: 'Home'},
    {path: '/restaurant-details/:id', component: RestaurantDetails, props: true},
    {path: '/login', component: Login, beforeEnter: ifNotAuthenticated},
    {path: '/add-restaurant', component: RestaurantOperations, beforeEnter: ifAuthenticated},
    {path: '/edit-restaurant/:id', component: RestaurantOperations, props: true, beforeEnter: ifAuthenticated},
    {path: '/user-profile', component: Profile, props: true, beforeEnter: ifAuthenticated},
    {path: '/profile-settings/:id', component: ProfileSettings, props: true, beforeEnter: ifAuthenticated}
];

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
});

export default router;
