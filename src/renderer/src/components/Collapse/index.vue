<script lang="ts" setup>
import { CollapseProps } from './type'
import InfoBlock from '@renderer/components/InfoBlock/index.vue'
const props = defineProps<CollapseProps>()
</script>

<template>
    <div class="container">
        <div class="el-collapse-div">
            <el-collapse class="el-collapse">
                <el-collapse-item
                    :title="item.name"
                    class="item"
                    v-for="(item, index) in props.info"
                    :key="index"
                >
                    <InfoBlock v-for="(inner, idx) in item.details" class="info-block" :key="idx">
                        <template #prefix>
                            <slot name="prefix" :data="inner"></slot>
                        </template>
                        <template #info>
                            <slot name="info" :data="inner"> </slot>
                        </template>
                    </InfoBlock>
                </el-collapse-item>
            </el-collapse>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.container {
    .el-collapse-div {
        .el-collapse {
            border: 0;
            .item {
                :deep() {
                    .el-dialog__header {
                        padding: 0;
                    }
                    .el-collapse-item__header {
                        background-color: var(
                            --friend-list-and-relationship-manage-background-color
                        );
                        position: relative;
                        border: 0;
                        color: var(--friend-list-and-relationship-manage-font-color);
                        padding-left: 35px;

                        .el-collapse-item__arrow {
                            position: absolute;
                            left: 10px;
                            top: 50%;
                            transform: translateY(-50%);
                        }

                        .el-collapse-item__arrow.is-active {
                            transform: translateY(-50%) rotate(90deg);
                        }
                    }

                    .el-collapse-item__wrap {
                        border: 0;

                        .el-collapse-item__content {
                            padding: 0;
                        }
                    }
                }
            }

            .info-block:hover {
                background-color: var(--background-gray2-color);
            }
        }
    }
}
</style>
