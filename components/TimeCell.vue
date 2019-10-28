<template>
    <cell-base :disabled="value === null">{{ text }}</cell-base>
</template>

<script>
import CellBase from '~/components/CellBase';


export default {
    props: ['value'],
    components: {CellBase},
    computed: {
        text() {
            if (this.value === null) {
                return '未入力';
            }
            return `${this.value.getHours() + 1}:${`${this.value.getMinutes()}`.padStart(2, '0')}`;
        },
    },
}
</script>
