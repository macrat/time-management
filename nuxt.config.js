import dotenv from 'dotenv';

dotenv.config();


export default {
    head: {
        title: 'time management',
        meta: [
            {charset: 'utf-8'},
            {name: 'viewport', content: 'width=device-width,initial-scale=1'},
        ],
    },
    modules: ['nuxt-client-init-module', 'cookie-universal-nuxt'],
    plugins: ['~/plugins/APIClient'],
    serverMiddleware: ['~/api/'],
    env: process.env,
}
