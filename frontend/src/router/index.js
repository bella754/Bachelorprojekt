import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import("../components/Home.vue")
    },
    {
      path: '/my_entries',
      name: 'my_entries',
      component: () => import("../components/My_Entries.vue")
    },
    {
      path: '/new_entry',
      name: 'new_entry',
      component: () => import("../components/New_Entry.vue")
    },
    {
      path: '/all_entries',
      name: 'all_entries',
      component: () => import("../components/All_Entries.vue")
    },
    {
      path: '/users',
      name: 'user_administration',
      component: () => import("../components/Users.vue")
    },
    {
      path: '/create-user',
      name: 'create_user',
      component: () => import("../components/Create_User.vue")
    },
    {
      path: '/new_entry/form',
      name: 'formular',
      component: () => import("../components/Form.vue")
    },
    {
      path: '/entry/:activityId',
      name: 'Entry',
      props: true,
      component: () => import("../components/Entry.vue")
    }
  ]
})

export default router
