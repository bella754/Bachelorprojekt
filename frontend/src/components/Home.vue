<script setup>
    import { ref, onMounted } from "vue";
    import Sidenavigation from "./Sidenavigation.vue";

    // Referenz für user & Loading-Status
    const user = ref(null);
    const isLoading = ref(true);
    const API_URL = import.meta.env.VITE_API_URL;
    // console.log("api_url aus .env: ", API_URL);

    async function getUser() {
        try {            
            const response = await fetch(`${API_URL}/current-user`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const result = await response.json();
            if (result && result.user) {
                user.value = result.user; // User-Daten speichern
            }
        } catch (error) {
            console.error("Error getting user data:", error);
        } finally {
            isLoading.value = false; // Laden abgeschlossen
        }
    }

    async function send_data() {
        // console.log("in send data function with entries: ", entries.value);
        try {
            const response = await fetch(`${API_URL}/api/send-data/${user.value._id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                // body: JSON.stringify(entries.value)
            });
            
            const backend_data = await response.json();
            // console.log("Data received:", backend_data);
        } catch (error) {
            console.error("Error submitting form:", error);
        }
    }

    onMounted(getUser);
    // console.log("home view user: ", user);
    // console.log("home view user.role: ", user.value.role);
    
    
    
</script>


<template>
    <Sidenavigation class="sidenavigation"></Sidenavigation>
    
    <div v-if="isLoading">Lade Benutzerdaten...</div>

    <div v-else class="home_container">
        <div class="home_headline">
            <h1>Wilkommen zurück {{ user.name }}!</h1>
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
            <RouterLink v-if="user.role !== 'Standard User'" class="home_item" to="/all_entries">
                <img class="home_item_image" src="@/assets/all_entries.svg" alt="All Entries SVG">
                <h2 class="home_item_header">Alle Einträge</h2>
            </RouterLink>
            <RouterLink v-if="user.role == 'Controller'" class="home_item" to="/users">
                <img class="home_item_image" src="@/assets/user_administration.svg" alt="Edit Users SVG">
                <h2 class="home_item_header">Mitarbeitende verwalten</h2>
            </RouterLink>
            <div class="home_item home_item_button" @click="send_data(user)">
                <img class="home_item_image" src="@/assets/send_entries.svg" alt="Send Entries SVG">
                <h2 class="home_item_header">Eigene Einträge absenden</h2>
            </div>
            <!--<div v-if="user.role == 'Controller'" class="home_item home_item_button" @click="get_data()">
                <img class="home_item_image" src="@/assets/get_entries.svg" alt="Get Entries SVG">
                <h2 class="home_item_header">Einträge anfordern</h2>
            </div>-->
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