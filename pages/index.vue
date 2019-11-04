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
button {
    border: none;
    background-color: white;
    box-shadow: 2px 2px 2px gray;
    padding: 8px 32px;
}
button:active {
    box-shadow: 3px 3px 2px gray;
}
</style>

<template>
    <form @submit.prevent=login>
        <p class=error v-if=error>{{ error }}</p>
        <input v-model=id placeholder="Your ID" required />
        <input type=password v-model=password placeholder="Password" required />
        <span>
            <button type=button @click.prevent=signup>signup</button>
            <button type=submit>login</button>
        </span>
    </form>
</template>

<script>
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
            this.$store.dispatch('Sync');
            this.$router.push('/recorder');
        },
        errored(err) {
            if (err.response) {
                console.error(err.response);
                this.error = err.response.data.message;
            } else {
                throw err;
            }
        },
        async signup() {
            try {
                this.loggedin(await this.$api.signup(this.id, this.password));
            } catch(err) {
                this.errored(err);
            }
        },
        async login() {
            try {
                this.loggedin(await this.$api.signin(this.id, this.password));
            } catch(err) {
                this.errored(err);
            }
        },
    },
}
</script>
