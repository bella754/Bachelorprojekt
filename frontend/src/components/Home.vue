<script setup>
    import Sidenavigation from "./Sidenavigation.vue";
    import { send_data, get_data } from "../helper";

    import data from '../../../backend/testData/listing.json';
    // console.log("data in home.vue: ", data);
</script>

<template>
    <Sidenavigation class="sidenavigation"></Sidenavigation>
    <div class="home_container">
        <div class="home_headline">
            <h1>Welcome back User1 !</h1>
        </div>
        <div class="home">
            <RouterLink class="home_item" to="/my_entries">
                <img class="home_item_image" src="@/assets/my_entries.svg" alt="My Entries SVG">
                <h2 class="home_item_header">Meine Einträge</h2>
            </RouterLink>
            <RouterLink class="home_item" to="/new_entry">
                <img class="home_item_image" src="@/assets/new_entry.svg" alt="Create new Entry SVG">
                <h2 class="home_item_header">Neuen Eintrag verfassen</h2>
            </RouterLink>
            <RouterLink class="home_item" to="/all_entries">
                <img class="home_item_image" src="@/assets/all_entries.svg" alt="All Entries SVG">
                <h2 class="home_item_header">Alle Einträge</h2>
            </RouterLink>
            <RouterLink class="home_item" to="/users">
                <img class="home_item_image" src="@/assets/user_administration.svg" alt="Edit Users SVG">
                <h2 class="home_item_header">Mitarbeitende verwalten</h2>
            </RouterLink>
            <div class="home_item home_item_button" @click="send_data(data)">
                <img class="home_item_image" src="@/assets/send_entries.svg" alt="Send Entries SVG">
                <h2 class="home_item_header">Einträge absenden</h2>
            </div>
            <div class="home_item home_item_button" @click="get_data()">
                <img class="home_item_image" src="@/assets/get_entries.svg" alt="Get Entries SVG">
                <h2 class="home_item_header">Einträge anfordern</h2>
            </div>
        </div>  
    </div>
</template>

<style scoped>
    .home_container {
        position: relative;
        left: 20%;
        width: 70%;
        margin: 5% 5%;
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
        text-decoration: none;
        color: black;
    }

    .home_item_button {
        cursor: pointer;
    }

    .home_item_image {
        max-width: 80px;
    }

    .home_item_header {
        margin: 0;
        text-align: center;
    }

    .home_headline {
        color: #c02020;
    }
</style>