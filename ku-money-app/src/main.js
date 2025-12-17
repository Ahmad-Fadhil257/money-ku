import router from '@/routes'
import i18n from '@/plugins/i18n'
import moment from 'moment'
import '@/styles/index.css'
import '@mdi/font/css/materialdesignicons.css'
import 'sweetalert2/dist/sweetalert2.min.css'
import 'aos/dist/aos.css'
import 'tui-image-editor/dist/tui-image-editor.css'
import App from './App.vue'

import { createApp } from 'vue'
import { axios, VueAxios } from '@/plugins/axios'
import { createPinia } from 'pinia'
import { VueSweetalert2, options } from '@/plugins/swal'
import { Icon } from '@iconify/vue'
import '@/styles/index.css'

const app = createApp(App)

moment.locale('id')

app.config.globalProperties.$moment = moment

app.component('BaseIcon', Icon)

app
  .use(VueAxios, axios)
  .use(router)
  .use(i18n)
  .use(createPinia())
  .use(VueSweetalert2, options)
  .mount('#app')
