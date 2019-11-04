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
        workEnd: null,
        breakStart: null,
        breakEnd: null,
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
    Update(state, {year, month, attends}) {
        state.records[`${year}/${month}`] = attends;
    },
    StartedWork(state, timestamp) {
        state.records[keyOfMonth(timestamp)][timestamp.getDate() - 1].workStart = timestamp;
    },
    EndedWork(state, timestamp) {
        state.records[keyOfMonth(timestamp)][timestamp.getDate() - 1].workEnd = timestamp;
    },
    StartedBreak(state, timestamp) {
        state.records[keyOfMonth(timestamp)][timestamp.getDate() - 1].breakStart = timestamp;
    },
    EndedBreak(state, timestamp) {
        state.records[keyOfMonth(timestamp)][timestamp.getDate() - 1].breakEnd = timestamp;
    },
};

export const actions = {
    async nuxtClientInit({commit, dispatch}) {
        const token = this.$cookies.get('token');
        if (token) {
            commit('LoggedIn', token);
        }
        setTimeout(() => {
            dispatch('Sync', {
                year: new Date().getFullYear(),
                month: new Date().getMonth() + 1,
            });
        }, 200);
    },
    async Sync({commit}, {year, month}) {
        commit('Update', await this.$api.getAttends(year, month));
    },
    async StartWork({commit}) {
        commit('StartedWork', await this.$api.startWork());
    },
    async EndWork({commit}) {
        commit('EndedWork', await this.$api.endWork());
    },
    async StartBreak({commit}) {
        commit('StartedBreak', await this.$api.startBreak());
    },
    async EndBreak({commit}) {
        commit('EndedBreak', await this.$api.endBreak());
    },
}
