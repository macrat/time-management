import dotenv from 'dotenv';

dotenv.config();


export default {
    modules: ['nuxt-client-init-module', 'cookie-universal-nuxt'],
    serverMiddleware: ['~/api/'],
    env: process.env,
}
