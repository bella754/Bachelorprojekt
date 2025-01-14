<!-- <script setup>
    import { ref } from 'vue';
    import Sidenavigation from "./Sidenavigation.vue";

    const forms = ref([]);
    const modules = import.meta.glob('./forms/*.vue');

    // Dateien laden und Pfad sowie Dateinamen extrahieren
    for (const path in modules) {
        modules[path]().then((mod) => {
            const fileName = path.split('/').pop().replace('.vue', ''); 
            forms.value.push({
                name: fileName, 
                path,           
                component: mod.default 
            });
        });
    }
</script>

<template>
    <Sidenavigation class="sidenavigation"></Sidenavigation>
    <div class="new-entry">
        <h1 class="new-entry_headline">Neuen Eintrag hinzufügen</h1>
        <h3 class="new-entry_subheadline">Wählen Sie bitte ein Formular aus</h3>
        <div class="new-entry_formselection">
            <RouterLink v-for="form in forms" class="new-entry_formlink" :key="form.name" :to="`/new_entry/${form.name}`">{{form.name}}</RouterLink>  
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

    .new-entry_headline {
        color: #c02020;
    }
</style> -->

<script setup>
import { ref } from 'vue';
import Sidenavigation from "./Sidenavigation.vue";

// Referenz für die Formulare und die Module
const forms = ref([]);
const modules = import.meta.glob('./forms/*.vue');
const schemaModules = import.meta.glob('@schemas/new/*.json');
//console.log("schema modules: ",schemaModules);


// Dateien laden und den Namen aus den Schemas extrahieren
for (const path in modules) {
    modules[path]().then((mod) => {
        const fileName = path.split('/').pop().replace('.vue', ''); 

        // Lade das entsprechende Schema basierend auf dem Formularnamen
        const schemaPath = `/backend/schemas/new/${fileName}.json`;
        // console.log("schema path: ", schemaPath);
        
        // console.log("before if statement with schemaPath: ", schemaPath);
        // console.log("schemapath in schemamodule?: ", schemaModules.hasOwnProperty(schemaPath));
        
        
        if (schemaPath in schemaModules) {
            // console.log("in if statement");
            
            schemaModules[schemaPath]().then((schema) => {
                // console.log("schema.title: ", schema.title);
                
                forms.value.push({
                    name: schema.title || fileName, 
                    filename: fileName,
                    path,                         
                    component: mod.default         // Die geladene Vue-Komponente
                });
                // console.log("forms: ", forms);
                
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
        <div class="new-entry_formselection">
            <!-- Anzeige der Formularnamen basierend auf dem Schema -->
            <RouterLink v-for="form in forms" class="new-entry_formlink" :key="form.name" :to="`/new_entry/${form.filename}`">{{ form.name }}</RouterLink>  
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

    .new-entry_headline {
        color: #c02020;
    }
</style>
