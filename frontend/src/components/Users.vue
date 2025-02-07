<script setup>
    import { ref, onMounted } from "vue";
    import Sidenavigation from "./Sidenavigation.vue";

    const users = ref([])

    async function fetchUsers() {
        try {
            const response = await fetch('/api/all-users');
            const data = await response.json();
            users.value = data.users;
        } catch (error) {
            console.error('Error fetching users: ', error);
        }
    }

    onMounted(fetchUsers);
</script>

<template>
    <Sidenavigation class="sidenavigation"></Sidenavigation>
    <div class="users">
        <h1 class="users_headline">Nutzer bearbeiten</h1>
        <div class="kanban_board">
            <div v-for="user in users" class="kanban_column">
                <h3 class="user_name">{{ user.name }}</h3>
                <p class="user_details">
                    {{ user.email }}
                    <br>
                    {{ user.department }}
                </p>
            </div>
        </div>
        <RouterLink class="link" to="/create-user">
            Nutzer erstellen
        </RouterLink>
    </div>
</template>

<style scoped>
    .users {
        position: relative;
        left: 20%;
        width: 70%;
        display: flex;
        flex-direction: column;
        gap: 10px;
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

    .link {
        background-color: #c02020;
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