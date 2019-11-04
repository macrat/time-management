import sqlite3 from 'sqlite3';
import crypto from 'crypto';


export default class {
    constructor(path) {
        this.db = new sqlite3.Database(path);

        this.run(`CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            hash TEXT NOT NULL,
            solt TEXT NOT NULL
        )`);
        this.run(`CREATE TABLE IF NOT EXISTS attends (
            user TEXT,
            work_start TIMESTAMP,
            work_end TIMESTAMP,
            rest_start TIMESTAMP,
            rest_end TIMESTAMP
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
}
