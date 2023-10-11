/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Components
import App from './App.vue'

// Composables
import { createApp } from 'vue'

// Plugins
import { registerPlugins } from '@/plugins'

// Axios and vue-axios
import axios from 'axios'
import VueAxios from 'vue-axios'

const app = createApp(App)

// Use axios and vue-axios as plugins
app.use(VueAxios, axios)

registerPlugins(app)

app.mount('#app')
