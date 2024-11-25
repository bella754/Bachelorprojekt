<script setup>
    import Sidenavigation from './Sidenavigation.vue';
    import data from '../../../backend/testData/listing.json';

    console.log("data: ", data);

    async function send_data() {
        console.log("in send data function with data: ", data);
        try {
            const response = await fetch('/api/send-data', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            
            const bakcned_data = await response.json();
            console.log("Data received:", bakcned_data);
        } catch (error) {
            console.error("Error submitting form:", error);
        }
    }
    
</script>

<template>
    <Sidenavigation></Sidenavigation>
    <div class="my-entries">
        <h1 class="my-entries_headline">Deine letzten Einträge</h1>
        <div class="listing-item" v-for="item in data.items">
            <h3 class="listing-item_headline">{{ item.activity }} - {{ item.createdAt }}</h3>
            <p class="listing-item_description" v-for="prop in item.properties">{{ prop }}</p>
        </div>
        <div>
            <button class="send_data_button" @click="send_data()">Daten abschicken</button>
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

    .send_data_button {
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
</style>
