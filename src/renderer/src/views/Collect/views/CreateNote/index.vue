<script setup>
import '@wangeditor/editor/dist/css/style.css'
import AppOperate from '@renderer/components/AppOperate/index.vue'
import { ref, shallowRef } from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import useBeforeCreateGetUpdatedPiniaState from '@renderer/hooks/useBeforeCreateGetUpdatedPiniaState'
import useUpdatePiniaStateSync from '@renderer/hooks/useUpdatePiniaStateSync'
import { onBeforeUnmount } from 'vue'
import http from '@renderer/utils/http/http'
import Note from '../../types/Note'
import { NOTE } from '../../types/noteTypes'
import { storeToRefs } from 'pinia'
import useBaseConfigStore from '@renderer/store/baseConfigStore'

useBeforeCreateGetUpdatedPiniaState()
useUpdatePiniaStateSync()

const { isDarkTheme } = storeToRefs(useBaseConfigStore())
//控制标题输入的输入框的显示
const titleInpFlag = ref(false)
const titleValue = ref('无标题')
const editorRef = shallowRef(null)
function handleCreated(editor) {
    editorRef.value = editor
}
// 保存输入的内容
function saveNote() {
    const note = new Note(editorRef.value.getHtml(), titleValue.value, NOTE)
    ElectronAPI.appendNoteFiles(JSON.stringify(note))
    ElectronAPI.closeWindow()
}
const toolbarConfig = {
    excludeKeys: [
        'fontSize',
        'fontFamily',
        'lineHeight',
        'headerSelect',
        'header1',
        'header2',
        'header3',
        'through',
        'color',
        'clearStyle',
        'bgColor',
        'undo',
        'redo',
        'fullScreen',
        'insertTable',
        'justifyLeft',
        'justifyRight',
        'justifyCenter',
        'todo',
        'bulletedList',
        'numberedList'
    ]
}
const editorConfig = {
    MENU_CONF: {
        uploadImage: {
            async customUpload(file, insertFn) {
                const formData = new FormData()
                formData.append('image', file)
                const res = await http({
                    url: 'http://geek.itheima.net/v1_0/upload',
                    method: 'POST',
                    data: formData
                })
                insertFn(res.data.url, '', '')
            }
        }
    }
}
// 富文本html内容
const editorHTML = ref()
onBeforeUnmount(() => {
    const editor = editorRef.value
    if (editor == null) return
    editor.destroy()
})

// onMounted(()=>{
//     (async function(){
//     const res = await ElectronAPI.readNoteFiles()
//     editorRef.value.setHtml(res)
//     })();
// })
</script>

<template>
    <AppOperate class="app-operate" />
    <div class="container">
        <div v-if="!titleInpFlag" class="title" @dblclick="() => (titleInpFlag = true)">
            {{ titleValue || '无标题' }}
        </div>
        <el-input
            v-else
            v-model="titleValue"
            class="title-inp"
            @blur="() => (titleInpFlag = false)"
        />
        <div class="drag-region" />
        <div class="editor">
            <Toolbar
                :style="{ borderBottom: '1px solid #ccc' }"
                :editor="editorRef"
                :default-config="toolbarConfig"
                :mode="simple"
            />
            <Editor
                v-model="editorHTML"
                style="height: 500px"
                :default-config="editorConfig"
                :mode="simple"
                @on-created="handleCreated"
            />
        </div>
        <el-button class="save-btn" @click="saveNote">保存</el-button>
    </div>
</template>

<style scoped lang="scss">
.app-operate {
    position: absolute;
    right: 0;
    top: 0;
    z-index: 99;
}

.drag-region {
    -webkit-app-region: drag;
    position: absolute;
    top: 0;
    left: 0;
    height: 50px;
    width: 40%;
    z-index: 999;
}

.container {
    width: 100vw;
    height: 100vh;
    background-color: var(--collect-create-note-background-color);
    // background-color: var(--collect-create-note-backgroud-color);
    .title-inp {
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        top: 5px;
        left: 50%;
        color: var(--normal-font-color);
        transform: translateX(-50%);
        width: 300px;
        z-index: 10;
        :deep() {
            .el-input__wrapper {
                .el-input__inner {
                    text-align: center;
                }
            }
        }
    }
    .title {
        text-align: center;
        position: absolute;
        left: 50%;
        top: 10px;
        color: var(--normal-font-color);
        transform: translateX(-50%);
    }
    .editor {
        width: 100%;
        height: 100%;
        margin-top: 40px;
        overflow: visible;
        :deep() {
            .w-e-text-container {
                .w-e-scroll {
                    #w-e-textarea-1 {
                        background-color: var(--collect-create-note-background-color);
                    }
                }
                .w-e-bar {
                    background-color: var(--collect-create-note-background-color);
                }
            }
        }
    }
    .save-btn {
        position: absolute;
        width: 60px;
        bottom: 10px;
        right: 20px;
    }
}
</style>
