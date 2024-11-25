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
      path: '/support',
      name: 'support',
      component: () => import("../components/Support.vue")
    },
    {
      path: '/users',
      name: 'user_administration',
      component: () => import("../components/Users.vue")
    },
    {
      path: '/new_entry/Abschlussarbeit',
      name: 'new_entry-abschlussarbeit',
      component: () => import("../components/forms/Abschlussarbeit.vue")
    },
    {
      path: '/new_entry/Kurs',
      name: 'new_entry-kurs',
      component: () => import("../components/forms/Kurs.vue")
    },
    {
      path: '/new_entry/Publikation',
      name: 'new_entry-publikation',
      component: () => import("../components/forms/Publikation.vue")
    },
    {
      path: '/new_entry/Spende',
      name: 'new_entry-spende',
      component: () => import("../components/forms/Spende.vue")
    }
  ]
})

export default router
