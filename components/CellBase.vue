<style scoped>
td {
    text-align: center;
}
.disabled-cell {
    color: lightgray;
}
</style>

<template>
    <td :class="{'disabled-cell': disabled}"><slot /></td>
</template>

<script>
export default {
    props: ['disabled'],
}
</script>
