<template>
  <v-container fluid class="login-container fill-height">
    <v-row justify="center">
      <v-col cols="12" md="6">
        <v-card class="pa-4">
          <v-card-title class="text-center">
            <img src="@/assets/logo.png" alt="Book Logo" />
            <h2>Welcome Back!</h2>
            <p class="sub-caption">Log in to access your books.</p>
          </v-card-title>

          <v-alert type="error" v-if="errorMessage" class="mb-4" @click="errorMessage = ''">
            {{ errorMessage }}
          </v-alert>

          <form @submit.prevent="handleLogin">
            <v-text-field variant="outlined" label="Username" v-model="username" required></v-text-field>
            <v-text-field variant="outlined" label="Password" type="password" v-model="password" required></v-text-field>
            <div class="btn-container">
              <v-btn size="large" rounded="xl" color="primary" type="submit">Log In</v-btn>
            </div>
          </form>

          <p class="forgot-password"><a href="#">Forgot Password?</a></p>
          <div class="divider">
            <span>OR</span>
          </div>
          <div class="btn-container">
            <v-btn size="large" rounded="xl" variant="outlined" color="primary" @click="redirectToSignup">New Here? Sign
              Up!</v-btn>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();
const username = ref<string>("");
const password = ref<string>("");
const errorMessage = ref<string>("");

const handleLogin = async () => {
  try {
    const response = await axios.post('http://localhost:9000/login', {
      username: username.value,
      password: password.value
    });

    if (response.status === 200) {
      localStorage.setItem('username', username.value);
      router.push('/dashboard');
    } else {
      errorMessage.value = "Invalid username or password.";
    }
  } catch (error) {
    errorMessage.value = "An error occurred. Please try again.";
  }
};

const redirectToSignup = () => {
  router.push("/signup");
};
</script>

<style scoped>
.btn-container {
  text-align: center;
}

.sub-caption {
  margin-bottom: 1.5rem;
  color: #888;
}

.forgot-password {
  margin-top: 1rem;
}

.divider {
  position: relative;
  margin: 2rem 0;
  text-align: center;
}

.divider span {
  background-color: #fff;
  padding: 0 10px;
  position: relative;
  z-index: 1;
}

.divider:before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background-color: #ddd;
  z-index: 0;
}
</style>
