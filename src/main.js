
import "@/theme/base.less"


import { createPinia } from 'pinia'
import { createApp } from 'vue'
import App from './App.vue'


const pinia = createPinia()

createApp(App)
    .use(pinia)
    .mount('#ling-doc')
