import MainPage from "./components/main-page/MainPage";
import RestaurantDetails from "./components/restaurant/RestaurantDetails";
import Login from "./components/login/Login";

export const routes = [
    {path: '/', component: MainPage},
    {path: '/restaurant-details/:id', component: RestaurantDetails, props: true},
    {path: '/login', component: Login},
];
