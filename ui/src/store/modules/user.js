import axios from "axios";

const state = {
    usersFavoriteRestaurants: [],
    user: null,
    usersLikedRestaurants: []
};

const getters = {
    getUsersFavoriteRestaurants: state => state.usersFavoriteRestaurants,
    getUserLoggedIn: state => state.user,
    getUsersLikedRestaurants: state => state.usersLikedRestaurants
};

const actions = {
    getUsersFavoriteRestaurants: async ({commit}) => {
        return new Promise((resolve, reject) => {
            axios({url: '/favorite-restaurant/logged-in-user', method: 'GET'})
                .then(response => {
                    commit('setUsersFavoriteRestaurants', response.data);
                    resolve(response);
                })
                .catch(err => {
                    reject(err);
                })
        })
    },
    getUserLoggedIn: async ({commit}) => {
        return new Promise((resolve, reject) => {
            axios({url: '/auth/me', method: 'GET'})
                .then(response => {
                    commit('setUserLoggedIn', response.data);
                    resolve(response);
                })
                .catch(err => {
                    reject(err);
                })
        })
    },
    getUsersLikedRestaurants: async ({commit}) => {
        return new Promise((resolve, reject) => {
            axios({url: '/restaurant/my-liked-restaurants', method: 'GET'})
                .then(response => {
                    commit('setUsersLikedRestaurants', response.data);
                    resolve(response);
                })
                .catch(err => {
                    reject(err);
                })
        })
    }
};

const mutations = {
    setUsersFavoriteRestaurants: (state, usersFavoriteRestaurants) => {
        state.usersFavoriteRestaurants = usersFavoriteRestaurants;
    },
    setUserLoggedIn: (state, user) => {
        state.user = user;
    },
    setUsersLikedRestaurants: (state, usersLikedRestaurants) => {
        state.usersLikedRestaurants = usersLikedRestaurants;
    }
};

export default {
    state,
    getters,
    actions,
    mutations
};
