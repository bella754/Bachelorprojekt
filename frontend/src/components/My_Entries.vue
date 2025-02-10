<script setup>
    import Sidenavigation from './Sidenavigation.vue';
    import { ref, onMounted } from 'vue';

    const entries = ref([]);
    const user = ref(null);

    const API_URL = import.meta.env.VITE_API_URL;


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
                // console.log("result in my_entries: ", result);                
            }
        } catch (error) {
            console.error("Error getting user data:", error);
        } 
    }

    onMounted(async () => {
          await getUser();
          // console.log("user in my_entries: ", user);
          
          const userID = user.value._id;
          // console.log("userID in my_entries: ", userID);

          try {
            const response = await fetch(`${API_URL}/api/user-all-activities/${userID}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            entries.value = await response.json();
            // console.log("Data received in my_entries:", entries.value);
        } catch (error) {
            console.error("Error getting data:", error);
        }  
    });
    
</script>

<template>
    <Sidenavigation></Sidenavigation>
    <div class="my-entries">
        <div class="my-entries_header">
            <h1 class="my-entries_headline">Deine letzten Einträge</h1>
            <button class="button button_filter">
                Filter
                <img class="my-entries_filter_image" src="../assets/filter.svg" alt="Filter SVG">
            </button>
        </div>
        <div class="listing-item" v-for="item in entries" :key="item._id">
            <h3 class="listing-item_headline">{{ item.activity }} - {{ item.createdAt }}</h3>
            <p class="listing-item_description" v-for="prop in item.properties">{{ prop }}</p>
        </div>
        <div>
            <button class="button" @click="send_data()">Daten abschicken</button>
        </div>
    </div>
</template>

<style scoped>
    .my-entries {
        position: relative;
        left: 20%;
        width: 70%;
        display: flex;
        flex-direction: column;
        gap: 10px;
        margin: 5% 5%;
    }

    .my-entries_header {
        display: flex;
        align-items: center;
    }

    .listing-item {
        border: 2px solid black;
        border-radius: 6px;
    }

    .listing-item_headline {
        margin: 5px 10px;
        color: #c02020;
    }

    .listing-item_description {
        margin: 5px 10px;
    }

    .button {
        border: 1px solid #c02020;
        border-radius: 6px;
        padding: 7px 10px;
        background-color: #c02020;
        color: white;
        margin-top: 10px;
        position: absolute;
        right: 0;
        cursor: pointer;
    }

    .button_filter {
        display: flex;
        align-items: center;
        padding: 7px 20px;
        gap: 5px;
        margin: 0;
    }

    .my-entries_filter_image {
        max-width: 20px;
    }
</style>
