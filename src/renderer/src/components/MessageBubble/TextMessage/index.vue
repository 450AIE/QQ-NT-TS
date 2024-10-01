<script setup>
defineProps({
    msg: {
        required: true,
        type: String
    },
    direction: {
        required: false,
        type: String,
        default: 'row'
    }
})
</script>

<template>
    <div class="container w" :style="{ flexDirection: direction }">
        <div
            class="avatar"
            :style="{
                marginLeft: direction === 'row' ? '0' : '10px',
                marginRight: direction === 'row' ? '10px' : '0'
            }"
        ></div>
        <div
            class="msg"
            :style="{
                backgroundColor: direction === 'row' ? '#fff' : '$background-blue-color',
                color: direction === 'row' ? 'black' : '#fff'
            }"
        >
            {{ msg }}
        </div>
    </div>
</template>

<style scoped lang="scss">
.container {
    width: 100%;
    height: auto !important;
    display: flex;
    background-color: orange;
    .avatar {
        width: 20px;
        height: 20px;
        flex-shrink: 0;
        background-color: orange;
    }
    .msg {
        max-width: 70%;
        flex-shrink: 0;
        padding: 10px;
        margin-bottom: 20px;
        background-color: #fff;
        border-radius: 5px;
    }
}
</style>
