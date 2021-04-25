<template>
    <div>
        播放界面 <button @click="test">123</button>
    </div>
</template>

<script>
    import { mapState } from "vuex"
    export default {
        computed: {
            ...mapState({
                roomGlobalInfo: 'roomGlobalInfo'
            })
        },
        mounted() {
            this.test()
        },
        methods: {
            test() {
                let { rtcEngine } = this.roomGlobalInfo
                rtcEngine.on('onRemoteVideoStateChanged', (data) => {
                    console.log('=============远端流change=', data)
                })
            }
        }

    }
</script>

<style lang="less" scoped>

</style>