import jwt from 'jsonwebtoken';


function daysOfMonth(date) {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
}


function keyOfMonth(date) {
    return `${date.getFullYear()}/${new Date().getMonth() + 1}`;
}


export const state = () => {
    const state = {
        token: null,
        records: {},
    };

    state.records[keyOfMonth(new Date())] = [...new Array(daysOfMonth(new Date()))].map(() => ({
        workStart: null,
        restStart: null,
        restEnd: null,
        workEnd: null,
    }));

    return state;
};


export const getters = {
    thisMonth(state) {
        return state.records[keyOfMonth(new Date())];
    },
    today(state, getters) {
        return getters.thisMonth[new Date().getDate() - 1];
    },
    username(state) {
        return jwt.decode(state.token);
    }
};


export const mutations = {
    LoggedIn(state, token) {
        state.token = token;
        this.$cookies.set('token', token);
    },
    LogOut(state) {
        state.token = null;
        this.$cookies.remove('token');
    },
    StartWork(state) {
        const timestamp = new Date();
        state.records[keyOfMonth(timestamp)][timestamp.getDate() - 1].workStart = timestamp;
    },
    EndWork(state) {
        const timestamp = new Date();
        state.records[keyOfMonth(timestamp)][timestamp.getDate() - 1].workEnd = timestamp;
    },
    StartRest(state) {
        const timestamp = new Date();
        state.records[keyOfMonth(timestamp)][timestamp.getDate() - 1].restStart = timestamp;
    },
    EndRest(state) {
        const timestamp = new Date();
        state.records[keyOfMonth(timestamp)][timestamp.getDate() - 1].restEnd = timestamp;
    },
};


export const actions = {
    async nuxtClientInit({commit}) {
        const token = this.$cookies.get('token');
        if (token) {
            commit('LoggedIn', token);
        }
    },
}
