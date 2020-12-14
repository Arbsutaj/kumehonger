import {Model} from 'vue-mc';

export default class LoginRequest extends Model {
    defaults() {
        return {
            username: '',
            password: ''
        }
    }

    mutations() {
        return {
            username: String,
            password: String
        }
    }

    get username() {
        return this.username;
    }
}

