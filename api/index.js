import bodyParser from 'body-parser';
import express from 'express'
import jwt from 'jsonwebtoken';

import Database from './database';


const db = new Database('db.sqlite3');
const app = express();
app.set('secret_key', process.env.SECRET_KEY);
app.use(bodyParser.json({type: '*/*'}))


async function signToken(id) {
    return new Promise((resolve, reject) => {
        jwt.sign(id, app.get('secret_key'), {}, (err, token) => {
            if (err) {
                reject(err);
            } else {
                resolve(token);
            }
        });
    });
}


async function decodeToken(token) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, app.get('secret_key'), (err, decoded) => {
            if (err) {
                reject(err);
            }
            resolve(decoded);
        });
    });
}


app.post('/signup', async (req, res) => {
    try {
        await db.createUser(req.body.id, req.body.password);
    } catch(err) {
        res.status(400).send({
            message: err,
            token: null,
        });
        return;
    }

    res.json({
        message: 'created',
        token: await signToken(req.body.id),
    });
});


app.post('/signin', async (req, res) => {
    let ok = false;
    try {
        ok = await db.verifyUser(req.body.id, req.body.password);
    } catch(err) {
        res.status(err === 'no such user' ? 400 : 500).send({
            message: err,
            token: null,
        });
        return;
    }

    if (ok) {
        res.json({
            message: 'success',
            token: await signToken(req.body.id),
        });
    } else {
        res.json({
            message: 'failed',
            token: null,
        });
    }
});


app.use(async (req, res, next) => {
    try {
        const token = req.headers['authorization'].slice('Bearer '.length);
        req.userInfo = await decodeToken(token);
    } catch (err) {
        return res.status(403).send({
            message: 'login required',
        });
    }
    next();
});


app.get('/test', (req, res) => res.send({message: 'hello'}));


export default {
    path: '/api/',
    handler: app,
}
