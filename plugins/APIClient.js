import axios from 'axios';


export class APIClient {
    constructor(token) {
        if (token) {
            this.token = token;
        }
    }

    get _tokenHeader() {
        if (!this.token) {
            return {};
        } else {
            return {
                headers: {
                    Authorization: `Bearer ${this.token}`,
                },
            }
        }
    }

    async signup(id, password) {
        const token = (await axios.post('/api/signup', {
            id: id,
            password: password,
        })).data.token;

        this.token = token;

        return token;
    }

    async signin(id, password) {
        const token = (await axios.post('/api/signin', {
            id: id,
            password: password,
        })).data.token;

        this.token = token;

        return token;
    }

    async getAttends(year, month) {
        if (!this.token) {
            throw 'login required';
        }

        const resp = await axios.get(`/api/attends/${year}/${month}`, this._tokenHeader);

        const result = {
            year: year,
            month: month,
            attends: resp.data.attends.map(x => ({
                workStart: x.work_start ? new Date(x.work_start) : null,
                workEnd: x.work_end ? new Date(x.work_end) : null,
                breakStart: x.break_start ? new Date(x.break_start) : null,
                breakEnd: x.break_end ? new Date(x.break_end) : null,
            })),
        };
        return result;
    }

    async _setTimestamp(endpoint) {
        return new Date((await axios.get(endpoint, this._tokenHeader)).data.timestamp);
    }

    async startWork() {
        return await this._setTimestamp('/api/attends/work/start');
    }

    async endWork() {
        return await this._setTimestamp('/api/attends/work/end');
    }

    async startBreak() {
        return await this._setTimestamp('/api/attends/break/start');
    }

    async endBreak() {
        return await this._setTimestamp('/api/attends/break/end');
    }
}


export default ({app}, inject) => {
    inject('api', new APIClient(app.store.state.token));
}
