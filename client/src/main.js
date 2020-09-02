import Vue from 'vue'
import App from './App.vue'
import store from './store'
import GAuth from 'vue-google-oauth2'
const gauthOption = {
  clientId: '650966121939-5hh0ghfaudecv8rmp82cp1jd69l14i10.apps.googleusercontent.com',
  scope: 'profile email',
  prompt: 'select_account'
}
Vue.use(GAuth, gauthOption)

Vue.config.productionTip = false

new Vue({
  store,
  render: h => h(App)
}).$mount('#app')
