import Vue from 'vue'
import App from './App.vue'
import router from './router'
import "@/plugins/echarts";
import Buefy from 'buefy'
import 'buefy/dist/buefy.css'
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css'

Vue.use(Buefy)
Vue.use(Vuetify);

Vue.config.productionTip = false

new Vue({
  vuetify: new Vuetify(),
  render: function (h) { return h(App) },
  router,
}).$mount('#app')

