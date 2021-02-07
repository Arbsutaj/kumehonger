import {Collection} from "vue-mc";
import Restaurant from "./Restaurant";

export default class RestaurantList extends Collection {

    // Model that is contained in this collection.
    model() {
        return Restaurant;
    }

    // Default attributes
    defaults() {
        // return {
        //     orderBy: 'name',
        // }
    }

    // Route configuration
    routes() {
        // return {
        //     fetch: '/tasks',
        // }
    }
}
