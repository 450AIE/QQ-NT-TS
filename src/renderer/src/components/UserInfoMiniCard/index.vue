<script lang="ts" setup>
import { ref } from 'vue'
import EditPage from './components/EditPage/index.vue'
const openUpdateUserInfoPage = ref<boolean>(false)
</script>

<template>
    <div class="container">
        <div class="header">
            <div class="avatar-container">
                <el-avatar />
            </div>
            <div class="content">秋风起·琴瑟里</div>
            <div class="thumbs-up">点赞</div>
        </div>
        <ul class="content-container">
            <li class="signature">
                <span class="field">签名</span>
                <span class="detail">人不要脸，天下无敌</span>
            </li>
            <li class="address">
                <span class="field">所在地</span>
                <span class="detail">中国</span>
            </li>
            <li class="space">
                <span class="field">QQ空间</span>
                <span class="detail">ABCD</span>
            </li>
        </ul>
        <div class="btn-container">
            <el-button class="btn" @click="openUpdateUserInfoPage = true">编辑资料</el-button>
            <el-button class="btn">发消息</el-button>
        </div>
        <el-dialog
            v-model="openUpdateUserInfoPage"
            width="600"
            modal
            :close-on-click-modal="false"
            :style="{
                height: '400px'
            }"
        >
            <EditPage :close-edit-page="() => (openUpdateUserInfoPage = false)" />
        </el-dialog>
    </div>
</template>

<style lang="scss" scoped>
.container {
    display: flex;
    flex-direction: column;
    padding: 20px;
    width: 300px !important;
    height: 250px;
    overflow: hidden;
    border-radius: 10px;
    background-color: #fff;
    box-shadow: 0 0 10px 1px #ccc;

    .header {
        width: 100%;
        display: flex;
        justify-content: space-around;
    }

    .content-container {
        display: flex;
        flex-direction: column;
        width: 100%;
        list-style: none;
        margin-top: 10px;

        li {
            margin-left: 15px;
            height: 40px;
            width: 100%;
            display: flex;

            .field {
                display: inline-block;
                text-align: left;
                color: #aaa;
                width: 60px;
                margin-right: 20px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
        }
    }

    .btn-container {
        margin-top: 10px;

        .btn {
            width: 115px;

            &:last-child {
                background-color: #0099ff;
                color: #fff;
            }
        }
    }
}
</style>
