<script setup>
  import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="sidenavigation">
    <div class="sidenavigation_header">
      <img class="sidenavogation_logo" src="../assets/tu-berlin-logo.svg" alt="Logo TU Berlin">
      <RouterLink class="sidenavigation_link" to="/">Home</RouterLink>
      <RouterLink class="sidenavigation_link" to="/my_entries">Meine Einträge</RouterLink>
      <RouterLink class="sidenavigation_link" to="/new_entry">Neuen Eintrag</RouterLink>
      <RouterLink class="sidenavigation_link" to="/all_entries">Alle Einträge</RouterLink>
    </div>
        <div class="sidenavigation_footer">
      <RouterLink class="sidenavigation_link sidenavigation_link_support" to="/support">Support</RouterLink>
      <div class="sidenavigation_userinfo">
        User1
      </div>
    </div>
  </div>
</template>

<style scoped>
  .sidenavigation {
    background-color: #8A8282;
    position: absolute;
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
  }

</style>
