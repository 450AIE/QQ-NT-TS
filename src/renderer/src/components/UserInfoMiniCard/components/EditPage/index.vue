<script lang="ts" setup>
import { ref } from 'vue';
const props = defineProps<{ closeEditPage: Function }>()
const formData = ref({
    nickanme: '',
    sex: '',
    avatar_url: '',
    extra: ''
})
const formRef = ref(null)
// 这个会被axios拦截吗？注意
function setAvatarURL(response) {
    formData.value.avatar_url = response.data.url
}
</script>

<template>
    <div class='container-v'>
        <div class="avatar-container">
            <el-upload action='http://geek.itheima.net/v1_0/upload' name="image" :limit="1" accept="jpg,webp,png"
                list-type="picture" :show-file-list="false" :on-success="setAvatarURL">
                <el-avatar :src="formData.avatar_url" alt="" class="avatar" />
            </el-upload>
        </div>
        <el-form v-model="formData" ref="formRef">
            <el-form-item label="昵称">
                <el-input v-model="formData.nickanme" />
            </el-form-item>
            <el-form-item label="性别">
                <el-input v-model="formData.sex" />
            </el-form-item>
            <el-form-item label="自我介绍">
                <el-input v-model="formData.extra" />
            </el-form-item>
        </el-form>
        <el-button type="primary" class="save">保存</el-button>
        <el-button class="cancel" @click="closeEditPage">取消</el-button>
    </div>
</template>


<style lang='scss' scoped>
.container-v {
    position: relative;
    width: 100%;
    height: 100%;
    box-shadow: none;

    .avatar-container {
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 10px;
        height: 100px;

        .avatar {
            height: 80px;
            width: 80px;
        }
    }

    .save {
        position: absolute;
        right: 80px;
        bottom: -100px;
    }

    .cancel {
        position: absolute;
        bottom: -100px;
        right: 0;
    }
}
</style>