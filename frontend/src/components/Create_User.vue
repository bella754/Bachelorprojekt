<script setup>
import { ref } from "vue";
import Sidenavigation from "./Sidenavigation.vue";

// Reaktive Variablen für die Eingabefelder
const name = ref("");
const email = ref("");
const department = ref("");
const role = ref("Standard User");

// Status für Erfolg oder Fehler
const successMessage = ref("");
const errorMessage = ref("");

const API_URL = import.meta.env.VITE_API_URL;


// Funktion zum Erstellen eines neuen Nutzers
async function createUser() {
    // Überprüfen, ob alle Felder ausgefüllt sind
    if (!name.value || !email.value || !department.value || !role.value) {
        errorMessage.value = "Bitte fülle alle Felder aus.";
        successMessage.value = "";
        return;
    }

    try {
        const response = await fetch(`${API_URL}/api/new-user`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: name.value,
                email: email.value,
                department: department.value,
                role: role.value
            })
        });

        if (!response.ok) {
            throw new Error("Fehler beim Erstellen des Nutzers.");
        }

        const data = await response.json();
        successMessage.value = "Nutzer erfolgreich erstellt!";
        errorMessage.value = "";

        // Felder leeren nach erfolgreicher Erstellung
        name.value = "";
        email.value = "";
        department.value = "";
        role.value = "Standard User";

    } catch (error) {
        console.error("Error creating user:", error);
        errorMessage.value = "Es gab ein Problem beim Erstellen des Nutzers.";
        successMessage.value = "";
    }
}
</script>

<template>
    <Sidenavigation class="sidenavigation"></Sidenavigation>

    <div class="create_user">
        <h1 class="create_user_headline">Nutzer erstellen</h1>

        <div class="create_user_form">
            <label for="name">Name:</label>
            <input type="text" id="name" v-model="name" placeholder="Name eingeben..." />

            <label for="email">E-Mail:</label>
            <input type="email" id="email" v-model="email" placeholder="E-Mail eingeben..." />

            <label for="department">Department:</label>
            <input type="text" id="department" v-model="department" placeholder="Department eingeben..." />

            <label class="label" for="role">Rolle:</label>
            <select id="role" v-model="role">
                <option value="Standard User">Standard User</option>
                <option value="Controller">Controller</option>
                <option value="Reviewer">Reviewer</option>
            </select>

            <button class="button" @click="createUser">
                Nutzer erstellen
            </button>

            <!-- Erfolg- und Fehlermeldungen -->
            <p v-if="successMessage" class="success">{{ successMessage }}</p>
            <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
        </div>
    </div>
</template>

<style scoped>
.create_user {
    position: relative;
    left: 20%;
    width: 50%;
    /*margin: 5% auto;*/
    padding: 20px;
    border: 2px solid #c02020;
    border-radius: 10px;
    background-color: #f9f9f9;
}

.create_user_headline {
    text-align: center;
    color: #c02020;
}

.create_user_form {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.label {
    font-weight: bold;
}

input, select {
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 5px;
    font-size: 16px;
}

.button {
    background-color: #c02020;
    color: white;
    padding: 10px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
}

.button:hover {
    background-color: #a01a1a;
}

.success {
    color: green;
    font-weight: bold;
    text-align: center;
}

.error {
    color: red;
    font-weight: bold;
    text-align: center;
}
</style>
