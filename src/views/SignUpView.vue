<template>
  <v-container fluid class="signup-container fill-height">
    <v-row justify="center">
      <v-col cols="12" md="6">
        <v-card class="pa-4">
          <v-card-title class="text-center">
            <img src="@/assets/logo.png" alt="Book Logo" />

            <h2>Join the Community!</h2>
          </v-card-title>

          <v-alert type="error" v-if="errorMessage" class="mb-4" @click="errorMessage = ''">
            {{ errorMessage }}
          </v-alert>

          <v-form @submit.prevent="formValidation">
            <!-- Username Field -->
            <v-text-field variant="outlined" label="Username" v-model="username" required :counter="20"
              :error-messages="usernameError" placeholder="Choose a username"
              hint="This will be your unique identity on BeyondTheBook."></v-text-field>

            <!-- Password Field -->
            <v-text-field variant="outlined" label="Password" v-model="password" type="password" required
              :error-messages="passwordError" placeholder="Choose a strong password"></v-text-field>

            <!-- Favorite Book Selection -->
            <v-select variant="outlined" :items="bookTitles" item-title="text" item-value="value"
              :error-messages="favoriteBookError" label="Which of these is your favorite book?" v-model="favoriteBookId"
              hint="Don't worry, you can always update this later in your profile."
              placeholder="Select your favorite book">
            </v-select>

            <!-- Signup Button -->
            <div class="btn-container">
              <v-btn size="large" rounded="xl" color="primary" type="submit">Join Now</v-btn>
            </div>
          </v-form>

          <!-- Footer/Login Navigation -->
          <div class="text-center mt-4">
            Already a member? <router-link to="/login">Log in here</router-link>.
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { Ref, ref, onMounted, computed } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

// Types
type Book = {
  id: string;
  title: string;
  author: string;
  description: string;
  cover_url: string;
};

type BooksApiResponse = {
  data: {
    books: Book[];
  };
};

// Data properties
const username: Ref<string> = ref("");
const password: Ref<string> = ref("");
const books: Ref<Book[]> = ref([]);
const errorMessage: Ref<string> = ref("");
const usernameError: Ref<string> = ref("");
const passwordError: Ref<string> = ref("");
const favoriteBookError: Ref<string> = ref("");
const favoriteBookId: Ref<string | null> = ref(null);




// Fetch books on component mount
onMounted(async () => {
  try {
    const response = await axios.get<BooksApiResponse>('http://localhost:9000/books');
    if (response.data && response.data.data && response.data.data.books) {
      books.value = response.data.data.books;
    }
  } catch (error) {
    console.error('Failed to fetch books:', error);
  }
});

// Computed property to transform books into a format that v-select expects
const bookTitles = computed(() => {
  return books.value.map(book => ({
    text: book.title,
    value: book.id
  }));
});

const router = useRouter();

const formValidation = (): void => {
  clearErrors();  // Clear previous errors
  let isValid = true;

  // Validate username
  if (username.value.length === 0) {
    usernameError.value = "Username is required.";
    isValid = false;
  } else if (username.value.length > 20) {
    usernameError.value = "Username must be less than 20 characters";
    isValid = false;
  }

  // Validate password
  if (password.value.length === 0) {
    passwordError.value = "Password is required.";
    isValid = false;
  } else if (password.value.length < 8) {
    passwordError.value = "Password must be at least 8 characters.";
    isValid = false;
  }

  // Validate favorite book selection
  if (!favoriteBookId.value) {
    favoriteBookError.value = "You must select a favorite book.";
    isValid = false;
  }

  if (isValid) {
    submitForm();
  }
}

const clearErrors = (): void => {
  usernameError.value = "";
  passwordError.value = "";
  favoriteBookError.value = "";
}

const submitForm = async (): Promise<void> => {
  try {
    // Create the new user
    const newUserResponse = await axios.post('http://localhost:9000/users/new', {
      username: username.value,
      password: password.value
    });

    if (newUserResponse.status !== 201) {
      throw new Error("Error creating new user");
    }

    // Log the user in
    const loginResponse = await axios.post('http://localhost:9000/login', {
      username: username.value,
      password: password.value
    });

    if (loginResponse.status !== 200) {
      throw new Error("Login failed");
    }

    // Save the user's favorite book
    const favoriteResponse = await axios.post(`http://localhost:9000/users/${username.value}/favorites`, {
      book: favoriteBookId.value
    });

    if (favoriteResponse.status !== 200) {
      throw new Error("Failed to save favorite book");
    }

    // Store the username in localStorage
    localStorage.setItem('username', username.value);

    // Navigate to dashboard or show a success message
    router.push('/dashboard')

  } catch (error) {
    console.error("Error during signup:", error);
    if (error instanceof Error) {
      errorMessage.value = error.message;
    } else {
      errorMessage.value = "An unknown error occurred.";
    }
  }
};
</script>

<style scoped>
.btn-container {
  text-align: center;
}
</style>
