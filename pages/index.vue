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
</style>

<template>
    <form @submit.prevent=login>
        <p class=error v-if=error>{{ error }}</p>
        <input v-model=id placeholder="Your ID" required />
        <input type=password v-model=password placeholder="Password" required />
        <input type=submit value=login />
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
        async login() {
            try {
                const resp = await axios.post('/api/signin', {
                    id: this.id,
                    password: this.password,
                });
                const token = resp.data.token;
                this.$store.commit('LoggedIn', token);
            } catch(err) {
                this.error = err.response.data.message;
            }
        },
    },
}
</script>
