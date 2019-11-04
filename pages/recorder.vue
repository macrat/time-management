<style scoped>
.wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
}
.buttons {
    display: flex;
}

time {
    display: block;
    font-size: 38px;
    margin-bottom: 12px;
}

.big-button {
    height: 80px;
    width: 120px;
    margin: 2px;
}
.small-button {
    height: 40px;
    width: 120px;
    margin: 2px;
}
</style>

<template>
    <div class=wrapper>
        <time>{{ currentTime }}</time>
        <div class=buttons>
            <record-button class=big-button :disabled="today.workStart !== null" @click="$store.dispatch('StartWork')">出勤</record-button>
            <div>
                <record-button class=small-button :disabled="today.breakStart !== null" @click="$store.dispatch('StartBreak')">休憩開始</record-button>
                <record-button class=small-button :disabled="today.breakEnd !== null" @click="$store.dispatch('EndBreak')">休憩終了</record-button>
            </div>
            <record-button class=big-button :disabled="today.workEnd !== null" @click="$store.dispatch('EndWork')">退勤</record-button>
        </div>
    </div>
</template>

<script>
import RecordButton from '~/components/RecordButton';

export default {
    middleware: 'LoginRequired',
    components: {RecordButton},
    data: () => ({
        currentTime: "----/--/-- --:--:--",
    }),
    computed: {
        today() {
            return this.$store.getters.today;
        },
    },
    mounted() {
        setInterval(() => this.updateTime(), 1000);
        this.updateTime();
    },
    methods: {
        updateTime() {
            const t = new Date();
            const pad = x => `${x}`.padStart(2, '0');
            this.currentTime = `${t.getFullYear()}/${pad(t.getMonth() + 1)}/${pad(t.getDate())} ${pad(t.getHours())}:${pad(t.getMinutes())}:${pad(t.getSeconds())}`;
        }
    },
}
</script>
