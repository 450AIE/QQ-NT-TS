<script setup>
import useBaseConfigStore from './store/baseConfigStore';
const baseConfigStore = useBaseConfigStore()
</script>

<template>
    <div class="app" :class="{ 'light-theme': !baseConfigStore.isDarkTheme, 'dark-theme': baseConfigStore.isDarkTheme }">
        <!-- <router-view v-slot="{Component}" class="app-router"> -->
        <!-- <keep-alive :include/>="[]"> -->
        <!-- <component :is="Component" /> -->
        <!-- </keep-alive> -->
        <!-- </router-view> -->
        <router-view />
    </div>

</template>
<style scoped>
.app {
    display: flex;

    .app-router {
        flex: 1;
    }
}
</style>
