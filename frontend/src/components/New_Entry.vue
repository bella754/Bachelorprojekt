<script setup>
import { ref, onMounted } from 'vue';
import Sidenavigation from "./Sidenavigation.vue";
import { useRouter } from "vue-router";

const forms = ref([]);
const schemaModules = import.meta.glob('@schemas/new/*.json');
const user = ref(null);
const API_URL = import.meta.env.VITE_API_URL;
const router = useRouter();

async function getUser() {
        try {            
            const response = await fetch(`${API_URL}/api/current-user`, {
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
        } 
    }


onMounted(async () => {
    await getUser();
    
    for (const path in schemaModules) {
        schemaModules[path]().then((schema) => {
            // console.log("schema title in new_entry: ", schema.title);
            
            forms.value.push({
                name: schema.title || path.split('/').pop().replace('.json', ''),
                path
            });
        });
    }
});
</script>

<template>
    <Sidenavigation class="sidenavigation"></Sidenavigation>
    <div class="new-entry">
        <h1 class="new-entry_headline">Neuen Eintrag hinzufügen</h1>
        <h3 class="new-entry_subheadline">Wählen Sie bitte ein Formular aus</h3>
        <div class="new-entry_formselection" v-if="user">
            <RouterLink v-for="form in forms" 
                class="new-entry_formlink" 
                :key="form.name" 
                :to="{ path: '/new_entry/form', query: { userID: user._id, activityTitle: form.name } }">
                {{ form.name }}
            </RouterLink>
        </div>
    </div>
</template>

<style scoped>
    .new-entry {
        position: relative;
        left: 20%;
        width: 70%;
        margin: 5% 5%;
    }

    .new-entry_formselection {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    .new-entry_formlink {
        border: 2px solid black;
        border-radius: 8px;
        padding: 5px 10px;
        text-decoration: none;
        color: black;
    }

    
</style>
