import sqlite3 from 'sqlite3';
import crypto from 'crypto';


export default class {
    constructor(path) {
        this.db = new sqlite3.Database(path);

        this.run(`PRAGMA foreign_keys=true`);
        this.run(`CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            hash TEXT NOT NULL,
            solt TEXT NOT NULL
        )`);
        this.run(`CREATE TABLE IF NOT EXISTS attends (
            user TEXT NOT NULL,
            year INTEGER NOT NULL,
            month INTEGER NOT NULL,
            day INTEGER NOT NULL,
            work_start TIMESTAMP,
            work_end TIMESTAMP,
            break_start TIMESTAMP,
            break_end TIMESTAMP,
            PRIMARY KEY (user, year, month, day),
            FOREIGN KEY (user) REFERENCES users(id)
        )`);
    }

    run(sql, ...params) {
        return new Promise((resolve, reject) => {
            this.db.run(sql, ...params, err => {
                if (err) {
                    reject(err);
                }
                resolve();
            });
        });
    }

    get(sql, ...params) {
        return new Promise((resolve, reject) => {
            this.db.get(sql, ...params, (err, result) => {
                if (err) {
                    reject(err);
                }
                resolve(result);
            });
        });
    }

    getAll(sql, ...params) {
        return new Promise((resolve, reject) => {
            this.db.all(sql, ...params, (err, result) => {
                if (err) {
                    reject(err);
                }
                resolve(result);
            });
        });
    }

    async createUser(id, password) {
        if (!(id.length && id.length >= 3 && password.length && password.length >= 4)) {
            throw 'invalid request';
        }
        const solt = crypto.randomBytes(32).toString('hex');
        const hash = crypto.createHash('sha256').update(password + solt, 'utf8').digest('hex');
        try {
            await this.run('INSERT INTO users VALUES (?, ?, ?)', id, hash, solt);
        } catch(err) {
            throw 'user ID already exists';
        }
    }

    async verifyUser(id, password) {
        let solt;
        try {
            solt = (await this.get('SELECT solt FROM users WHERE id = ?', id)).solt;
        } catch(err) {
            throw 'no such user';
        }

        try {
            const hash = crypto.createHash('sha256').update(password + solt, 'utf8').digest('hex');

            const result = await this.get('SELECT 1 AS result FROM users WHERE id = ? AND hash = ?', id, hash);
            return result && result.result === 1;
        } catch(err) {
            throw 'something wrong';
        }
    }

    async getAttends(id, year, month) {
        const data = await this.getAll('SELECT day, work_start, work_end, break_start, break_end FROM attends WHERE user = ? AND year = ? AND month = ?', id, year, month);

        const lastDate = new Date(year, month, -1).getDate();
        const result = [];

        for (let day=1; day<=lastDate; day++) {
            const match = data.filter(d => d.day === day);

            if (match && match.length > 0) {
                result.push(match[0]);
            } else {
                result.push({
                    day: day,
                    work_start: null,
                    work_end: null,
                    break_start: null,
                    break_end: null,
                });
            }
        }

        return result;
    }

    async startWork(id, timestamp) {
        await this.run('INSERT OR IGNORE INTO attends (user, year, month, day) VALUES (?, ?, ?, ?)', id, timestamp.getFullYear(), timestamp.getMonth() + 1, timestamp.getDate());
        await this.run('UPDATE attends SET work_start = ? WHERE user = ? AND year = ? AND month = ? AND day = ?', timestamp, id, timestamp.getFullYear(), timestamp.getMonth() + 1, timestamp.getDate());
    }

    async endWork(id, timestamp) {
        await this.run('INSERT OR IGNORE INTO attends (user, year, month, day) VALUES (?, ?, ?, ?)', id, timestamp.getFullYear(), timestamp.getMonth() + 1, timestamp.getDate());
        await this.run('UPDATE attends SET work_end = ? WHERE user = ? AND year = ? AND month = ? AND day = ?', timestamp, id, timestamp.getFullYear(), timestamp.getMonth() + 1, timestamp.getDate());
    }

    async startBreak(id, timestamp) {
        await this.run('INSERT OR IGNORE INTO attends (user, year, month, day) VALUES (?, ?, ?, ?)', id, timestamp.getFullYear(), timestamp.getMonth() + 1, timestamp.getDate());
        await this.run('UPDATE attends SET break_start = ? WHERE user = ? AND year = ? AND month = ? AND day = ?', timestamp, id, timestamp.getFullYear(), timestamp.getMonth() + 1, timestamp.getDate());
    }

    async endBreak(id, timestamp) {
        await this.run('INSERT OR IGNORE INTO attends (user, year, month, day) VALUES (?, ?, ?, ?)', id, timestamp.getFullYear(), timestamp.getMonth() + 1, timestamp.getDate());
        await this.run('UPDATE attends SET break_end = ? WHERE user = ? AND year = ? AND month = ? AND day = ?', timestamp, id, timestamp.getFullYear(), timestamp.getMonth() + 1, timestamp.getDate());
    }
}
