<template>
  <v-app-bar flat>
    <!-- Logo -->
    <v-app-bar-title>
      <img src="@/assets/logo.png" alt="Company Logo" height="40" />
    </v-app-bar-title>

    <v-spacer></v-spacer>

    <!-- Profile Section -->
    <v-icon>mdi-account</v-icon>
    <span class="username">{{ username }}</span>

    <!-- If you want the logout functionality directly beside the username -->
    <v-btn variant="outlined" color="primary" @click="handleLogout">Logout</v-btn>
  </v-app-bar>
</template>

<script  lang="ts" setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const username = ref<string>(localStorage.getItem('username') || 'Guest');

const handleLogout = () => {
  localStorage.removeItem('username');
  router.push('/');
};
</script>

<style scoped>
.username {
  margin-right: 1rem;
  margin-left: 0.5rem;
  align-self: center;
}
</style>
