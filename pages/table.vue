<style scoped>
div {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 16px;
}

thead, tbody tr {
    box-shadow: 1px 1px 2px gray;
}

th {
    padding: 2px 24px;
}
</style>

<template>
    <div>
        <h1>{{ year }}年{{ month }}月の勤怠</h1>
        <table>
            <thead>
                <tr><th rowspan=2>日付</th><th colspan=2>勤務</th><th colspan=2>休憩</th><th rowspan=2>勤務時間</th></tr>
                <tr><th>開始</th><th>終了</th><th>開始</th><th>終了</th></tr>
            </thead>
            <tbody>
                <tr v-for="(time, day) in $store.getters.thisMonth">
                    <th>{{ day + 1 }}</th>
                    <time-cell :value=time.workStart />
                    <time-cell :value=time.workEnd />
                    <time-cell :value=time.breakStart />
                    <time-cell :value=time.breakEnd />
                    <delta-cell :value="time.workEnd - time.workStart - (time.breakEnd - time.breakStart)" />
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import TimeCell from '~/components/TimeCell';
import DeltaCell from '~/components/DeltaCell';


export default {
    middleware: 'LoginRequired',
    components: {TimeCell, DeltaCell},
    data: () => ({
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
    }),
    watch: {
        year() {
            this.sync();
        },
        month() {
            this.sync();
        },
    },
    methods: {
        async sync() {
            await this.$store.dispatch('Sync', {year: this.year, month: this.month});
        },
    },
}
</script>
