import axios from "axios";
import {UserProfile} from "@/components/user/profile/user.profile";

const state = {
    usersFavoriteRestaurants: [],
    user: null,
    usersLikedRestaurants: [],
    userProfile: new UserProfile(),
};

const getters = {
    getUsersFavoriteRestaurants: state => state.usersFavoriteRestaurants,
    getUserLoggedIn: state => state.user,
    getUsersLikedRestaurants: state => state.usersLikedRestaurants,
    getLoggedInUserProfile: state => state.userProfile
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
    getUserLoggedIn: async ({dispatch, commit}) => {
        return new Promise((resolve, reject) => {
            axios({url: '/auth/me', method: 'GET'})
                .then(response => {
                    commit('setUserLoggedIn', response.data);
                    dispatch('getLoggedInUserProfile');
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
    },
    getLoggedInUserProfile: async ({commit}) => {
        return new Promise((resolve, reject) => {
            axios({url: '/user-profile/my', method: 'GET'})
                .then(response => {
                    commit('setUserProfileOfLoggedInUser', response.data);
                    resolve(response);
                })
                .catch(err => {
                    reject(err);
                })
        })
    },
    removeUserStatesOnLogout: ({commit}) => {
        commit('removeUserStates');
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
    },
    setUserProfileOfLoggedInUser: (state, userProfile) => {
        state.userProfile = userProfile;
    },
    removeUserStates: (state) => {
        state.user = null;
        state.userProfile = new UserProfile();
        state.usersLikedRestaurants = [];
        state.usersFavoriteRestaurants = [];
    }
};

export default {
    state,
    getters,
    actions,
    mutations
};
