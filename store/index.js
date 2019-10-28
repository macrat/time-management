function daysOfMonth(date) {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
}


function keyOfMonth(date) {
    return `${date.getFullYear()}/${new Date().getMonth() + 1}`;
}


export const state = () => {
    const state = {records: {}};
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
};


export const mutations = {
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
