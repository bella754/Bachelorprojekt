<script setup>
    import { ref, reactive, onMounted } from 'vue';
    import Sidenavigation from './Sidenavigation.vue';
    import router from '../router/index.js'

    // Reaktive Variable für Nutzer und deren Aktivitäten
    const usersWithActivities = ref([]);
    const expandedUsers = reactive({}); // Zustand für erweiterte Nutzeransichten
    const user = ref(null);
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
            }
        } catch (error) {
            console.error("Error getting user data:", error);
        } finally {
            isLoading.value = false; // Laden abgeschlossen
        }
    }

    async function fetchUsersWithActivities() {
        try {
            const response = await fetch(`${API_URL}/api/users-with-activities`);
            usersWithActivities.value = await response.json();
            // Initialisiere expandedUsers für jeden Benutzer auf false
            usersWithActivities.value.forEach(user => {
                expandedUsers[user._id] = false;
            });
        } catch (error) {
            console.error('Error fetching users with activities:', error);
        }
    }

    function showActivity(activity) {
        // console.log("in showActivity function with activity: ", activity, activity._id);
        router.push({ name: 'Entry', params: { activityId: activity._id } });
    }

    // Umschalten der Anzeige für einen bestimmten Benutzer
    function toggleActivities(userId) {
        expandedUsers[userId] = !expandedUsers[userId];
    }

    // Funktion für den Excel-Export
    async function exportToExcel() {
        try {
            const response = await fetch(`${API_URL}/api/export-excel`);
            if (!response.ok) throw new Error("Fehler beim Herunterladen der Datei");

            const blob = await response.blob();
            const link = document.createElement("a");
            link.href = window.URL.createObjectURL(blob);
            link.download = "aktivitäten.xlsx";
            link.click();
        } catch (error) {
            console.error("Fehler beim Export:", error);
        }
    }

    // Daten beim Laden abrufen
    onMounted(() => {
        fetchUsersWithActivities();
        getUser();
    }) 
        
    
    // onMounted(fetchUsersWithActivities);
</script>

<template>
    <Sidenavigation></Sidenavigation>
    <div class="all-entries">
        <h1 class="all-entries_headline">Alle Einträge</h1>
        <div class="kanban_board">
            <!-- Kanban-Spalten für jeden Nutzer -->
            <div v-for="user in usersWithActivities" :key="user._id" class="kanban_column">
                <h2 class="user_name">{{ user.name }}</h2>
                <!-- Karten für die Aktivitäten des Nutzers -->
                <div v-for="(activity, index) in user.activities" 
                     :key="activity._id" 
                     class="kanban_card"
                     @click="showActivity(activity)"
                     v-show="expandedUsers[user._id] || index < 2">
                    <h3 class="activity_title">{{ activity.activity }}</h3>
                    <p class="activity_details">
                        {{ activity.createdAt }}
                    </p>
                </div>
                <!-- Button zum Umschalten -->
                <button v-if="user.activities.length > 2" 
                        class="toggle_button" 
                        @click="toggleActivities(user._id)">
                    {{ expandedUsers[user._id] ? 'Weniger ansehen' : 'Alle ansehen' }}
                </button>
            </div>
        </div>
        <button v-if="user.role == 'Controller'" class="button" @click="exportToExcel">Excel Export</button>
    </div>
</template>

<style scoped>
    .all-entries {
        position: relative;
        left: 20%;
        width: 70%;
        margin: 5% 5%;
    }

    .kanban_board {
        display: flex;
        gap: 20px;
        padding: 20px;
        flex-wrap: wrap;
    }

    .kanban_column {
        background-color: #f4f4f4;
        border: 1px solid #ddd;
        border-radius: 6px;
        padding: 15px;
        min-width: 250px;
    }

    .user_name {
        text-align: center;
        font-weight: bold;
        margin-bottom: 10px;
        color: #c02020;
    }

    .kanban_card {
        background-color: #fff;
        border: 1px solid #ccc;
        border-radius: 6px;
        padding: 10px;
        margin-bottom: 10px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    }

    .activity_title {
        font-weight: bold;
        margin-bottom: 5px;
    }

    .activity_details {
        font-size: 0.9em;
        color: #555;
    }

    .toggle_button {
        background-color: #c02020;
        color: white;
        border: none;
        border-radius: 6px;
        padding: 5px 10px;
        cursor: pointer;
        margin-top: 10px;
        width: 100%;
        text-align: center;
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
    }

    .button:hover,
    .button:active {
        cursor: pointer;
        background-color: #9e1919;
    }
</style>
