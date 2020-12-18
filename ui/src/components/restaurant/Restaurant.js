import {Model} from 'vue-mc';

export default class Restaurant extends Model {
    defaults() {
        return {
            id: '',
            title: '',
            location: '',
        }
    }

    mutations() {
        return {
            id: String,
            title: String,
            location: String,
            userId: String,
            summary: String,
            menu: String,
            logo: String
        }
    }
}

