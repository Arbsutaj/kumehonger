import axios from "axios";

const state = {
    usersFavoriteRestaurants: []
};

const getters = {
    getUsersFavoriteRestaurants: state => state.usersFavoriteRestaurants,
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

};

const mutations = {
    setUsersFavoriteRestaurants: (state, usersFavoriteRestaurants) => {
        state.usersFavoriteRestaurants = usersFavoriteRestaurants;
    }

};

export default {
    state,
    getters,
    actions,
    mutations
};
