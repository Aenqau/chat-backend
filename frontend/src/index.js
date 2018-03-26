import './promise-polyfill'
import 'element-ui/lib/theme-chalk/index.css'
import 'vue2-scrollbar/dist/style/vue2-scrollbar.css'
import './index.scss'
import { app } from './app'
require('offline-plugin/runtime').install();
app.$mount('#app');