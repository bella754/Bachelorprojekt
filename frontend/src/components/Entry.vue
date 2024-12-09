<script setup>
    import { ref, onMounted } from 'vue';
    import Sidenavigation from './Sidenavigation.vue';
    import { useRoute } from 'vue-router';

    const route = useRoute();
    const activity = ref(null);

    async function fetchActivity(activityId) {
        try {
            const response = await fetch(`/api/activity/${activityId}`);
            activity.value = await response.json();
        } catch (error) {
            console.error("Error fetching activity:", error);
        }
    }

    onMounted(() => {
        const activityId = route.params.activityId;
        console.log("activityID: ", activityId, typeof(activityId));
        
        fetchActivity(activityId);
    });
</script>

<template>
    <Sidenavigation></Sidenavigation>
    <div class="entry">
        <h1>Aktivität Details</h1>
        <div v-if="activity">
            <h2>{{ activity.activity }}</h2>
            <p>Erstellt am: {{ activity.createdAt }}</p>
            <p v-for="(value, key) in activity.properties" :key="key">
                {{ key }}: {{ value }}
            </p>
        </div>
        <div v-else>
            <p>Aktivität wird geladen...</p>
        </div>
    </div>
</template>

<style scoped>
    .entry {
        position: relative;
        left: 20%;
        width: 70%;
        margin: 5% 5%;
    }
</style>
