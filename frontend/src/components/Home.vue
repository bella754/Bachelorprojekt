<script setup>
    import Sidenavigation from "./Sidenavigation.vue"
</script>

<template>
    <Sidenavigation class="sidenavigation"></Sidenavigation>
    <div class="home_container">
        <div class="home">
            <div class="home_item">
                <img class="home_item_image" src="@/assets/my_entries.svg" alt="My Entries SVG">
                <h2 class="home_item_header">Meine Einträge</h2>
            </div>
            <div class="home_item">
                <img class="home_item_image" src="@/assets/new_entry.svg" alt="Create new Entry SVG">
                <h2 class="home_item_header">Neuen Eintrag verfassen</h2>
            </div>
            <div class="home_item">
                <img class="home_item_image" src="@/assets/all_entries.svg" alt="All Entries SVG">
                <h2 class="home_item_header">Alle Einträge</h2>
            </div>
            <div class="home_item">
                <img class="home_item_image" src="@/assets/send_entries.svg" alt="Send Entries SVG">
                <h2 class="home_item_header">Einträge absenden</h2>
            </div>
        </div>  
    </div>
</template>

<style scoped>

    .home_container {
        position: relative;
        left: 20%;
        width: 80%;
    }

    .home {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap; 
        gap: 10px;
    }

    .home_item {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 10px;
        border: 2px solid black;
        border-radius: 8px;
        width: 150px;
        height: 150px; 
    }

    .home_item_image {
        max-width: 80px;
    }

    .home_item_header {
        margin: 0;
        text-align: center;
    }
</style>