<style scoped>
div {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
}
span {
    font-size: 200%;
}
span, a {
    color: gray;
    text-decoration: none;
    margin: 16px;
}
a {
    padding: 8px;
    box-shadow: 2px 2px 2px gray;
}
a:active {
    box-shadow: 3px 3px 2px gray;
}
</style>

<template>
    <div>
        <span>ログアウトしました</span>
        <nuxt-link to="/">トップに戻る</nuxt-link>
    </div>
</template>

<script>
export default {
    mounted() {
        this.$store.commit('LogOut');
    },
}
</script>
