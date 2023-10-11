<template>
  <v-container>
    <v-snackbar v-model="snackbarVisible" :timeout="1500" location="top" color="success">
      Your favorite book has been updated!
      <v-btn rounded="xl" variant="outlined" size="small" color="white" class="ml-2" @click="snackbarVisible = false">
        Close
      </v-btn>
    </v-snackbar>
    <v-row class="mb-4">
      <v-col>
        <h1>Welcome, {{ username }}!</h1>
        <p>Discover books and find your all time favorite!</p>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <h2>All Books</h2>
        <v-row>
          <v-col cols="4" v-for="book in allBooks" :key="book.id">
            <BookCard :book="book" @updateFavorite="updateFavorite" @showBookDetails="openBookDetails" />
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-dialog v-model="bookDialog" max-width="400px">
      <book-card :book="selectedBook" :isDialog="true" @closeDialog="closeDialog" @updateFavorite="updateFavorite"
        @showBookDetails="openBookDetails"></book-card>
    </v-dialog>
  </v-container>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import BookCard from '@/components/BookCard.vue';

type Book = {
  id: string;
  title: string;
  author: string;
  description: string;
  cover_url: string;
  isFavorite?: boolean;
};

type FavoritesResponse = {
  book: string[];
};

const username = localStorage.getItem('username') as string;
const allBooks = ref<Book[]>([]);
const favoritedBooks = ref<string[]>([]);
const snackbarVisible = ref(false);
const bookDialog = ref(false);
const selectedBook = ref<Book | null>(null);

const openBookDetails = (book: Book) => {
  selectedBook.value = book;
  bookDialog.value = true;
};

const closeDialog = () => {
  bookDialog.value = false;
};

const updateFavorite = async (bookId: string) => {
  try {
    await axios.post(`http://localhost:9000/users/${username}/favorites`, { book: bookId });
    for (let book of allBooks.value) {
      book.isFavorite = book.id === bookId;
    }
    snackbarVisible.value = true;
  } catch (error) {
    console.error('Failed to update favorite book:', error);
  }
};

// Fetch all books and user's favorite books
const fetchBooksAndFavorites = async () => {
  try {
    const response = await axios.get('http://localhost:9000/books');
    if (response.data && response.data.data && response.data.data.books) {
      allBooks.value = response.data.data.books;
    }

    const favResponse = await axios.get(`http://localhost:9000/users/${username}/favorites`);
    if (favResponse.data && favResponse.data.data && favResponse.data.data.favorites) {
      favoritedBooks.value = (favResponse.data.data.favorites as FavoritesResponse).book;
    }

    for (let book of allBooks.value) {
      book.isFavorite = favoritedBooks.value.includes(book.id);
    }
  } catch (error) {
    console.error('Failed to fetch data:', error);
  }
};

onMounted(fetchBooksAndFavorites);
</script>

<style>
.favorites {
  position: absolute;
  top: 0.5em;
  right: 0.5em;
  z-index: 100;
}
</style>
