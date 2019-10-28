<style scoped>
header {
    text-align: center;
    box-shadow: 2px 0 2px gray;
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
        <nuxt-link to="/recorder">打刻</nuxt-link>
        <nuxt-link to="/table">確認・修正</nuxt-link>
    </header>
</template>
