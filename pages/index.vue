<style scoped>
.error {
    color: red;
}

form {
    display: flex;
    height: 100%;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
input, button {
    font-size: 120%;
    margin: 6px 8px;
}
input {
    border: none;
    box-shadow: 2px 2px 2px lightgray inset;
    padding: 4px 8px;
}
button, input[type=submit] {
    border: none;
    background-color: white;
    box-shadow: 2px 2px 2px gray;
    padding: 8px 32px;
}
button:active, input[type=submit]:active {
    box-shadow: 3px 3px 2px gray;
}
</style>

<template>
    <form @submit.prevent=login>
        <p class=error v-if=error>{{ error }}</p>
        <input v-model=id placeholder="Your ID" required />
        <input type=password v-model=password placeholder="Password" required />
        <span>
            <button @click.prevent=signup>signup</button>
            <input type=submit value=login />
        </span>
    </form>
</template>

<script>
import axios from 'axios';


export default {
    data: () => ({
        id: '',
        password: '',
        error: null,
    }),
    mounted() {
        if (this.$store.state.token) {
            this.$router.push('/recorder');
        }
    },
    methods: {
        loggedin(token) {
            this.$store.commit('LoggedIn', token);
            this.$router.push('/recorder');
        },
        errored(err) {
            console.error(err.response);
            this.error = err.response.data.message;
        },
        async signup() {
            try {
                const resp = await axios.post('/api/signup', {
                    id: this.id,
                    password: this.password,
                });
                this.loggedin(resp.data.token);
            } catch(err) {
                this.errored(err);
            }
        },
        async login() {
            try {
                const resp = await axios.post('/api/signin', {
                    id: this.id,
                    password: this.password,
                });
                this.loggedin(resp.data.token);
            } catch(err) {
                this.errored(err);
            }
        },
    },
}
</script>
