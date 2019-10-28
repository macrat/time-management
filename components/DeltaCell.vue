<style scoped>
</style>

<template>
    <cell-base :disabled=disabled>{{ text }}</cell-base>
</template>

<script>
import CellBase from '~/components/CellBase';


export default {
    props: ['value'],
    components: {CellBase},
    computed: {
        disabled() {
            return !this.value || this.value < 0;
        },
        text() {
            if (this.disabled) {
                return '-';
            }
            const h = Math.floor(this.value / 1000 / 60 / 60);
            const m = Math.round(this.value / 1000 / 60);
            return `${h}:${`${m}`.padStart(2, '0')}`;
        },
    },
}
</script>
