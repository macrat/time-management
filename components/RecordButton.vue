<style scoped>
button {
    border: 0;
    background-color: white;
    box-shadow: 2px 2px 2px gray;
    display: flex;
    justify-content: center;
    align-items: center;
}
button:disabled {
    box-shadow: 1px 1px 2px gray;
}
button:active:not(:disabled) {
    box-shadow: 3px 3px 2px gray;
}
</style>

<template>
    <button :disabled=disabled @click="$emit('click')">
        <div><slot /></div>
    </button>
</template>

<script>
export default {
    props: ['disabled'],
}
</script>
