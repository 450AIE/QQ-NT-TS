<script setup>
defineProps({
    width: {
        required: false,
        type: String,
        default: '100%'
    }
})
</script>

<template>
    <div class="container">
        <div class="avatar-container">
            <el-avatar src="#" class="avatar" />
        </div>
        <div class="info-container">
            <div class="group-name">群名</div>
            <div class="group-tags">tag</div>
            <div class="group-introduce">介绍</div>
        </div>
        <div class="btn-container">
            <el-button>加入</el-button>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.container {
    display: flex;
    max-height: 80px;
    width: 100% !important;
    background-color: red;
    flex-direction: row !important;
    align-items: center;
    .avatar-container {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 80px;
        width: 80px;
        .avatar {
            width: 50px;
            height: 50px;
        }
    }
    .info-container {
        display: flex;
        flex: 8;
        flex-direction: column;
        .group-name {
            flex: 1;
        }
        .group-tags {
            flex: 1;
        }
        .group-introduce {
            flex: 1;
        }
    }
    .btn-container {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 80px;
        width: 100px;
    }
}
</style>
