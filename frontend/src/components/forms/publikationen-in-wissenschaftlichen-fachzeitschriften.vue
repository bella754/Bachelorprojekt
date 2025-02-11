<script setup>
    import { ref } from 'vue';
    import Sidenavigation from "@/components/Sidenavigation.vue";
    import schema from '@schemas/new/publikationen-in-wissenschaftlichen-fachzeitschriften.json';
    import { useRoute } from "vue-router";

    const route = useRoute();
    const userID = ref(route.query.userID);

    const formData = ref({});
    const schemaProperties = schema.properties;

    const requiredFields = schema.required || [];
    const API_URL = import.meta.env.VITE_API_URL;


    // Initialize formData based on schema
    Object.keys(schemaProperties).forEach(key => {
        formData.value[key] = '';         
    });

    // handle form submission
    async function submit_form() {
        console.log("formData in frontend: ", formData.value);
        
        try {
            const response = await fetch(`${API_URL}/api/new-activity/publikationen-in-wissenschaftlichen-fachzeitschriften/${userID.value}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData.value)
            });
            
            const data = await response.json();
            // console.log("Data received from backend:", data);
        } catch (error) {
            console.error("Error submitting form:", error);
        }
    }

    function preventNonInteger(event) {
    // Erlaube nur numerische Tasten, Backspace, Tab, Enter und Pfeiltasten
        const allowedKeys = [
            'Backspace', 'Tab', 'Enter', 'ArrowLeft', 'ArrowRight', 
            'ArrowUp', 'ArrowDown', 'Delete'
        ];

        // Erlaube nur Zahlen oder erlaubte Tasten
        if (!allowedKeys.includes(event.key) && !/^\d$/.test(event.key)) {
            event.preventDefault();
        }
    }
</script>

<template>
    <Sidenavigation></Sidenavigation>
    <div class="form_container">
        <h1 class="form_headline">{{ schema.title }}</h1>
        <form class="form">
            <div v-for="key in requiredFields" :key="key">
                <label class="form_label" :for="key">{{ key }}</label>
                <p class="form_description" v-if="schemaProperties[key].description">{{ schemaProperties[key].description }}</p>
                
                <select v-if="schemaProperties[key].enum" class="form_input" :id="key" v-model="formData[key]">
                    <option v-for="option in schemaProperties[key].enum" :key="option" :value="option">{{ option }}</option>
                </select>
                
                <textarea v-else-if="schemaProperties[key].type === 'textarea'" class="form_input form_input_textarea" :id="key" v-model="formData[key]" :placeholder="'Bitte ' + key + ' angeben'" />
                
                <input v-else-if="schemaProperties[key].type === 'integer'" step="1" min="0" placeholder="Nur ganze Zahlen" class="form_input" :id="key" v-model="formData[key]" type="number" @keydown="preventNonInteger"/>

                <input v-else-if="schemaProperties[key].type === 'string'" class="form_input" :id="key" v-model="formData[key]" type="text" :placeholder="'Bitte ' + key + ' angeben'" />

                <input v-else-if="schemaProperties[key].type === 'number'" class="form_input" :id="key" v-model="formData[key]" type="number" />
                
                <input v-else-if="schemaProperties[key].type === 'date'" class="form_input" :id="key" v-model="formData[key]" type="date" />
            </div>
        </form>
        <button class="form_submit" @click="submit_form()">Erstellen</button>
    </div>
</template>

<style scoped>
    .form_container {
        position: relative;
        left: 20%;
        width: 70%;
        margin: 5% 5%;
    }

    .form {
        display: flex;
        flex-direction: column;
        gap: 15px;
    }

    .form_label {
        display: block;
        font-size: large;
        font-weight: bold;
        color: #c02020;
    }

    .form_input {
        border: 1px solid grey;
        background-color: transparent;
        border-radius: 6px;
        width: 50%;
        font-family:Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif
    }

    .form_submit {
        border: 1px solid #c02020;
        border-radius: 6px;
        padding: 5px 10px;
        background-color: #c02020;
        color: white;
        margin-top: 10px;
    }

    .form_submit:hover,
    .form_submit:active {
        cursor: pointer;
        background-color: #9e1919;
    }

    .form_input::-webkit-outer-spin-button,
    .form_input::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }
</style>

