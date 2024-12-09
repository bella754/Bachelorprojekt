<script setup>
    import { ref } from 'vue';
    import Sidenavigation from "@/components/Sidenavigation.vue";
    import publicationSchema from '@schemas/publication.json';

    const formData = ref({});
    const schema = publicationSchema.properties;

    // Initialize formData based on schema
    Object.keys(schema).forEach(key => {
        formData.value[key] = '';         
    });

    // Function to handle form submission
    async function submit_form() {
        console.log("formData in frontend: ", formData.value);
        
        try {
            const response = await fetch('/api/new-activity/publication', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData.value)
            });
            
            const data = await response.json();
            console.log("Data received from backend:", data);
        } catch (error) {
            console.error("Error submitting form:", error);
        }
    }
</script>

<template>
    <Sidenavigation></Sidenavigation>
    <div class="form_container">
        <h1 class="form_headline">Publikation erstellen</h1>
        <form class="form">
            <div v-for="(field, key) in schema" :key="key">
                <label class="form_label" :for="key">{{ field.name || null }}</label>
                
                <select v-if="field.inputType === 'select'" class="form_input" :id="key" v-model="formData[key]">
                    <option v-for="option in field.enum" :key="option" :value="option">{{ option }}</option>
                </select>
                
                <textarea v-else-if="field.inputType === 'textarea'" class="form_input form_input_textarea" :id="key" v-model="formData[key]" :placeholder="'Bitte ' + field.name + ' angeben'" />
                
                <input v-else-if="field.inputType === 'text'" class="form_input" :id="key" v-model="formData[key]" type="text" :placeholder="'Bitte ' + field.name + ' angeben'" />

                <input v-else-if="field.inputType === 'number'" class="form_input" :id="key" v-model="formData[key]" type="number" />

                <input v-else-if="field.inputType === 'date'" class="form_input" :id="key" v-model="formData[key]" type="date" />
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

    .form_input::-webkit-outer-spin-button,
    .form_input::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }
</style>
