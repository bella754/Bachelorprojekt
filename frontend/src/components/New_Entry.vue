<script setup>
    import { ref } from 'vue';
    import Sidenavigation from "./Sidenavigation.vue";
    import { onMounted } from "vue";

    // Referenz für die Formulare und die Module
    const forms = ref([]);
    const modules = import.meta.glob('./forms/*.vue');
    const schemaModules = import.meta.glob('@schemas/new/*.json');

    const user = ref(null);
    // const userID = ref(null);

    const API_URL = import.meta.env.VITE_API_URL;


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
                    // console.log("userID in new entry: ", user.value._id);
                    
                    //userID.value = user.value._id;
                }
            } catch (error) {
                console.error("Error getting user data:", error);
            }
        }

    onMounted(getUser);

    // Dateien laden und den Namen aus den Schemas extrahieren
    for (const path in modules) {
        modules[path]().then((mod) => {
            const fileName = path.split('/').pop().replace('.vue', ''); 

            // Lade das entsprechende Schema basierend auf dem Formularnamen
            const schemaPath = `/backend/schemas/new/${fileName}.json`;

            if (schemaPath in schemaModules) {            
                schemaModules[schemaPath]().then((schema) => {                
                    forms.value.push({
                        name: schema.title || fileName, 
                        filename: fileName,
                        path,                         
                        component: mod.default         // Die geladene Vue-Komponente
                    });
                    
                });
            } else {
                // Fallback, falls kein passendes Schema gefunden wird
                forms.value.push({
                    name: fileName, 
                    path,           
                    component: mod.default 
                });
            }
        });
    }
</script>

<template>
    <Sidenavigation class="sidenavigation"></Sidenavigation>
    <div class="new-entry">
        <h1 class="new-entry_headline">Neuen Eintrag hinzufügen</h1>
        <h3 class="new-entry_subheadline">Wählen Sie bitte ein Formular aus</h3>
        <div class="new-entry_formselection" v-if="user">
            <!-- Anzeige der Formularnamen basierend auf dem Schema -->
            <RouterLink v-for="form in forms" 
                class="new-entry_formlink" 
                :key="form.name" 
                :to="{
                    path: `/new_entry/${form.filename}`, 
                    query: { userID: user._id } 
                }">
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
