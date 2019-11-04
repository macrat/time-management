<style scoped>
header {
    position: relative;
}
nav, .user-info {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
}
nav {
    text-align: center;
    box-shadow: 2px 0 2px gray;
}
.user-info {
    text-align: right;
}
a {
    display: inline-block;
    padding: 2px 4px;
    margin: 2px 8px;

    color: gray;
    text-decoration: none;
    font-size: 120%;
}
a.nuxt-link-active {
    color: lightgray;
}
</style>

<template>
    <header>
        <nav>
            <nuxt-link to="/recorder">打刻</nuxt-link>
            <nuxt-link to="/table">確認・修正</nuxt-link>
        </nav>
        <div v-if=$store.state.token class=user-info>
            <nuxt-link to="/logout">
                <span>{{ $store.getters.username }}</span>
                ログアウト
            </nuxt-link>
        </div>
    </header>
</template>
