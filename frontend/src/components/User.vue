<script setup>
    import Sidenavigation from "./Sidenavigation.vue";
</script>

<template>
    <Sidenavigation class="sidenavigation"></Sidenavigation>
    <div class="user">

    </div>
</template>

<style scoped>
    .user {
        position: relative;
        left: 20%;
        width: 70%;
        display: flex;
        flex-direction: column;
        gap: 10px;
        margin: 5% 5%;
    }
</style>