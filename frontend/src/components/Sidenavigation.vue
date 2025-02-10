<script setup>
  import { RouterLink, RouterView } from 'vue-router';
  import { ref, onMounted } from "vue";
  
  const user = ref(null);
  const isLoading = ref(true);

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

  async function logout() {
    console.log("in frontend logout function");
    window.location.href = "https://horus-290d.onrender.com/logout";
  }

  onMounted(getUser);
    
</script>

<template>
  <div v-if="isLoading">Lade Daten...</div>
  <div v-else class="sidenavigation">
    <div class="sidenavigation_header">
      <img class="sidenavogation_logo" src="../assets/tu-berlin-logo.svg" alt="Logo TU Berlin">
      <div class="sidenavigation_links">
        <RouterLink class="sidenavigation_link" to="/">Home</RouterLink>
        <RouterLink class="sidenavigation_link" to="/my_entries">Meine Einträge</RouterLink>
        <RouterLink class="sidenavigation_link" to="/new_entry">Neuen Eintrag</RouterLink>
        <RouterLink v-if="user.role !== 'Standard User'" class="sidenavigation_link" to="/all_entries">Alle Einträge</RouterLink>
        <RouterLink v-if="user.role == 'Controller'" class="sidenavigation_link" to="/users">Mitarbeitende verwalten</RouterLink>
        <div class="sidenavigation_link" @click="logout()">Logout</div>
      </div>
      
    </div>
        <div class="sidenavigation_footer">
      <!--<RouterLink class="sidenavigation_link sidenavigation_link_support" to="/support">Support</RouterLink>-->
      <div class="sidenavigation_userinfo">
        {{ user.name }}
      </div>
    </div>
  </div>
</template>

<style scoped>
  .sidenavigation {
    background-color: #8A8282;
    position: fixed;
    height:100%;
    width: 20%;
    left: 0;
    top: 0;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .sidenavogation_logo {
    width: 70%;
    position: relative;
    left: 50%;
    transform: translate(-50%);
    padding: 10px 0;
  }

  .sidenavigation_link {
    text-decoration: none;
    color: black;
    font-size: small;
    display: block;
    font-size: x-large;
    margin: 0 20%;
  }

  .sidenavigation_link:hover {
    text-decoration: underline;
  }

  .sidenavigation_userinfo {
    margin-left: 20%;
    font-size: x-large;
  }

  .sidenavigation_header {
    display: flex;
    flex-direction: column;
    gap: 40px;
  }

  @media screen and (max-width: 900px) {
    .sidenavigation_link {
      font-size: large;
    }
  }

  @media screen and (max-width: 674px) {
    .sidenavigation_link {
      font-size: medium;
    }
  }

</style>
