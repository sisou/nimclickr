import { createVaporApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import './style.css'

const app = createVaporApp(App)
app.use(createPinia())
app.mount('#app')
