import axios from 'axios';

const state = {
    status: '',
    token: localStorage.getItem('token') || '',
    user: null
};
const getters = {
    isAuthenticated: state => !!state.token
};

const actions = {
    AUTH_LOGIN: async ({commit}, user) => {
        return new Promise((resolve, reject) => { // The Promise used for router redirect in login
            commit('AUTH_REQUEST');
            axios({url: '/auth/login', data: user, method: 'POST'})
                .then(resp => {
                    const token = 'Bearer '+resp.data.token;
                    localStorage.setItem('token', token)
                    axios.defaults.headers.common['Authorization'] = token; // store the token in localstorage
                    commit('AUTH_SUCCESS', token);
                    resolve(resp);
                })
                .catch(err => {
                    commit('AUTH_ERROR', err);
                    localStorage.removeItem('user-token'); // if the request fails, remove any possible user token if possible
                    reject(err);
                })
        })
    },
    AUTH_LOGOUT: ({commit}) => {
        return new Promise((resolve) => {
            commit('AUTH_LOGOUT');
            localStorage.removeItem('token');
            // remove the axios default header
            delete axios.defaults.headers.common['Authorization'];
            resolve();
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
    }
};

const mutations = {
    AUTH_REQUEST: (state) => {
        state.status = 'loading'
    },
    AUTH_SUCCESS: (state, token) => {
        state.status = 'success';
        state.token = token;
    },
    AUTH_ERROR: (state) => {
        state.status = 'error';
    },
    AUTH_LOGOUT: (state) => {
        state.status = null;
        state.token = '';
    },
    setUserLoggedIn: (state, user) => {
        state.user = user;
    }
};

export default {
    state,
    getters,
    actions,
    mutations
};
