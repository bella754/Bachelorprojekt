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
      path: '/create-user',
      name: 'create_user',
      component: () => import("../components/Create_User.vue")
    },
    {
      path: '/new_entry/lehre-pruefungsleistungen-bachelor-master',
      name: 'new_entry-abschlussarbeit',
      component: () => import("../components/forms/lehre-pruefungsleistungen-bachelor-master.vue")
    },
    {
      path: '/new_entry/aemter-und-gremienaktivitaet-an-der-tu-berlin',
      name: 'new_entry-aemter-und-gremienaktivitaet',
      component: () => import("../components/forms/aemter-und-gremienaktivitaet-an-der-tu-berlin.vue")
    },
    {
      path: '/new_entry/publikationen-in-sammelbaenden',
      name: 'new_entry-publikation-sammelband',
      component: () => import("../components/forms/publikationen-in-sammelbaenden.vue")
    },
    {
      path: '/new_entry/publikationen-in-wissenschaftlichen-fachzeitschriften',
      name: 'new_entry-publikation-fachzeitschrift',
      component: () => import("../components/forms/publikationen-in-wissenschaftlichen-fachzeitschriften.vue")
    },
    {
      path: '/new_entry/ausstellungen-und-messen',
      name: 'new_entry-ausstellungen-und-messen',
      component: () => import("../components/forms/ausstellungen-und-messen.vue")
    },
    {
      path: '/new_entry/begutachtungs-und-beratungsfunktionen',
      name: 'new_entry-begutachten-und-beratung',
      component: () => import("../components/forms/begutachtungs-und-beratungsfunktionen.vue")
    },
    {
      path: '/new_entry/einrichtung-eines-internationalen-studiengangs',
      name: 'new_entry-einrichtung-internationaler-studiengang',
      component: () => import("../components/forms/einrichtung-eines-internationalen-studiengangs.vue")
    },
    {
      path: '/new_entry/elektronische-veroeffentlichungen',
      name: 'new_entry-elektronische-veroeffentlichung',
      component: () => import("../components/forms/elektronische-veroeffentlichungen.vue")
    },
    {
      path: '/new_entry/tu-interne-promotionen-fakultaetszentrale-erfassung',
      name: 'new_entry-interne-prootionen',
      component: () => import("../components/forms/tu-interne-promotionen-fakultaetszentrale-erfassung.vue")
    },
    {
      path: '/new_entry/organisation-ausrichtung-von-tagungen-konferenzen',
      name: 'new_entry-organisation-konferenzen',
      component: () => import("../components/forms/organisation-ausrichtung-von-tagungen-konferenzen.vue")
    },
    {
      path: '/new_entry/vortrag-auf-tagungen-konferenzen',
      name: 'new_entry-tagungen-konferenzen',
      component: () => import("../components/forms/vortrag-auf-tagungen-konferenzen.vue")
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
