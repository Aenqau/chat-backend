import Vue from 'vue';
import Router from 'vue-router';
import Home from '../views/Home.vue';
import Chat from '../views/Chat.vue';
import SecondPage from '../views/SecondPage.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      title: 'Home page',
      path: '/',
      component: Home
    },
    {
      title: 'Chat',
      path: '/chat/:oid',
      component: Chat
    },
    {
      title: 'Second page',
      path: '/second',
      component: SecondPage
    },
    {
      path: '/*',
      redirect: '/'
    }
  ]
})
