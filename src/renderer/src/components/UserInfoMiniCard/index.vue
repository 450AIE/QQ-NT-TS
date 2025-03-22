<script lang="ts" setup>
import { ref, toRefs } from 'vue'
import EditPage from './components/EditPage/index.vue'
import { UserInfo } from 'src/utils/types/user'
const openUpdateUserInfoPage = ref<boolean>(false)
const props = defineProps<{ userInfo: UserInfo }>()
const propsRef = toRefs(props.userInfo)
</script>

<template>
    <div class="container-1">
        <div class="header">
            <div class="avatar-container">
                <el-avatar />
            </div>
            <div class="content">
                {{
                    propsRef.nickname
                        ? propsRef.nickname
                        : propsRef.username
                          ? propsRef.username
                          : 'GO高手'
                }}
            </div>
            <div class="thumbs-up">点赞</div>
        </div>
        <ul class="content-container">
            <li class="signature">
                <span class="field">签名</span>
                <span class="detail">{{
                    propsRef.extra ? propsRef.extra : '人不要脸，天下无敌'
                }}</span>
            </li>
            <li class="address">
                <span class="field">所在地</span>
                <span class="detail">中国</span>
            </li>
            <li class="space">
                <span class="field">QQ空间</span>
                <span class="detail">装甲恶鬼村正</span>
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
            <EditPage
                :close-edit-page="() => (openUpdateUserInfoPage = false)"
                :user-info="userInfo"
            />
        </el-dialog>
    </div>
</template>

<style lang="scss" scoped>
.container-1 {
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
        position: absolute;
        width: 100%;
        display: flex;
        justify-content: space-around;
        .avatar-container {
            position: absolute;
            left: 12px;
        }
    }
    .content {
        position: absolute;
        left: 90px;
    }
    .thumbs-up {
        position: absolute;
        right: 64px;
    }
    .content-container {
        position: absolute;
        top: 70px;
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
        position: absolute;
        bottom: 20px;
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
