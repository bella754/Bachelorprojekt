<script setup>
import { ref } from 'vue';
import Sidenavigation from "../Sidenavigation.vue";

// Define reactive properties for each form input
const degree = ref("Bachelor");
const title = ref("");
const author = ref("");
const supervisor = ref("");
const supervisor2 = ref("");
const language = ref("Deutsch");

async function submit_form() {
    // Gather input values into an object
    const inputs = {
        degree: degree.value,
        title: title.value,
        author: author.value,
        supervisor: supervisor.value,
        supervisor2: supervisor2.value,
        language: language.value,
    };
    
    // console.log("inputs: ", inputs); 

    try {
        const response = await fetch('/api/thesis', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(inputs)
        });
        
        const data = await response.json();
        console.log("data in frontend: ", data);
    } catch (error) {
        console.error("Error loading tags: ", error);
    }
}
</script>

<template>
    <Sidenavigation></Sidenavigation>
    <div class="form_thesis">
        <h1 class="form_headline">Abschlussarbeit erstellen</h1>
        <form class="form">
            <div>
                <label class="form_label" for="degree">Abschluss</label>
                <select class="form_input" name="degree" id="degree" v-model="degree">
                    <option value="Bachelor" selected>Bachelor</option>
                    <option value="Master">Master</option>
                </select>
            </div>
            <div>
                <label class="form_label" for="titel">Titel</label>
                <!-- <input class="form_input" id="titel" type="textarea" value="Bitte Titel angeben"> -->
                <textarea class="form_input form_input_textarea" name="titel" id="titel" v-model="title">Bitte Titel angeben</textarea>
            </div>
            <div>
                <label class="form_label" for="author">Autor*in</label>
                <input class="form_input" id="author" v-model="author" type="text" value="Bitte Author*in angeben">
            </div>
            <div>
                <label class="form_label" for="supervisor">Betreuer*in</label>
                <input class="form_input" id="supervisor" v-model="supervisor" type="text" value="Bitte Betreuer*in angeben">
            </div>
            <div>
                <label class="form_label" for="supervisor2">Zweitbetreuer*in</label>
                <input class="form_input" id="supervisor2" v-model="supervisor2" type="text" value="Bitte Betreuer*in angeben">
            </div>
            <div>
                <label class="form_label" for="language">Sprache</label>
                <select class="form_input" name="language" id="language" v-model="language">
                    <option value="Deutsch" selected>Deutsch</option>
                    <option value="Englisch">Englisch</option>
                </select>
            </div>
        </form>
        <button class="form_thesis_submit" @click="submit_form()">Erstellen</button>
    </div>
</template>

<style scoped>
    .form_thesis {
        position: relative;
        left: 20%;
        width: 80%;
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

    .form_thesis_submit {
        border: 1px solid #c02020;
        border-radius: 6px;
        padding: 5px 10px;
        background-color: #c02020;
        color: white;
        margin-top: 10px;
    }
</style>

<!-- Titel
Name 
Superviser
Sprache
BA/MA -->