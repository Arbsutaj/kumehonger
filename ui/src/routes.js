import store from './store';
import VueRouter from "vue-router";
import Profile from "@/components/user/profile/Profile";
import ProfileSettings from "@/components/user/profile/ProfileSettings";
import LandingPage from "@/components/view/LandingPage";
import Restaurants from "@/components/view/Restaurants";
import RestaurantDetailsView from "@/components/view/RestaurantDetailsView";
import RestaurantSettings from "@/components/view/RestaurantSettings";
import Register from "@/components/view/Register";
import Login from "@/components/view/Login";
import FavoriteRestaurants from "@/components/view/FavoriteRestaurants";

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

    {path: '/', component: LandingPage},
    {path: '/register', component: Register},
    {path: '/login', component: Login, beforeEnter: ifNotAuthenticated},
    {path: '/all-restaurants', component: Restaurants},
    {path: '/create-restaurant', component: RestaurantSettings, beforeEnter: ifAuthenticated},
    {path: '/edit-restaurant/:id', component: RestaurantSettings, props: true, beforeEnter: ifAuthenticated},
    {path: '/profile-settings/:id', component: ProfileSettings, props: true, beforeEnter: ifAuthenticated},
    {path: '/restaurant-details/:id', component: RestaurantDetailsView, props: true},
    {path: '/user-profile', component: Profile, props: true, beforeEnter: ifAuthenticated},
    {path: '/favorite-restaurants', component: FavoriteRestaurants, beforeEnter: ifAuthenticated}

];

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
});

export default router;
