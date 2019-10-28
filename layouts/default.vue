<style>
body {
    margin: 0;
}
main {
    display: flex;
    flex-direction: column;
    height: 100vh;
}
</style>

<template>
    <main>
        <app-header />
        <nuxt />
    </main>
</template>

<script>
import AppHeader from '~/components/AppHeader';


export default {
    components: {AppHeader},
}
</script>
