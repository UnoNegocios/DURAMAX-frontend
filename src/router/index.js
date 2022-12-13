import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: () => import('../components/dashboard/container.vue')
  },
  {
    path: '/',
    name: 'Expenses',
    component: () => import('../components/expenses/container.vue')
  },
  {
    path: '/goal-report',
    name: 'Goal Report',
    component: () => import('../components/reports/goalReport.vue')
  },
  {
    path: '/reports',
    name: 'Reports',
    component: () => import('../components/reports/container.vue')
  },
  {
    path: '/quotations',
    name: 'Quotations',
    component: () => import('../components/quotations/table.vue')
  },
  {
    path: '/sales',
    name: 'Sales',
    component: () => import('../components/sales/table.vue')
  },
  {
    path: '/canceled',
    name: 'Canceled',
    component: () => import('../components/canceled/table.vue')
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('../components/settings/container.vue')
  },
  {
    path: '/leads',
    name: 'Leads',
    component: () => import('../components/leads/table.vue')
  },
  {
    path: '/clients',
    name: 'Clients',
    component: () => import('../components/clients/table.vue')
  },
  {
    path: '/calendar',
    name: 'calendar',
    component: () => import('../components/activities/calendar.vue')
  },
  {
    path: '/activities',
    name: 'Activities',
    component: () => import('../components/activities/table.vue')
  },
  {
    path: '/activities/:type',
    name: 'Activities per type',
    component: () => import('../components/activities/table.vue')
  },
  {
    path: '/activities-type-user/:type/:user',
    name: 'Activities per type and user',
    props: true,
    component: () => import('../components/activities/table.vue')
  },
  {
    path: '/activity-report',
    name: 'Activities Report',
    component: () => import('../components/activities/reports.vue')
  },
  {
    path: '/reports',
    name: 'Reports',
    component: () => import('../components/reports/container.vue')
  },
  {
    path: '/activity-log',
    name: 'Activity Log',
    component: () => import('../components/activitylog/container.vue')
  },
  {
    path: '/clients/client/:id',
    name: 'clientDetail',
    component: () => import('../components/clients/companies/clientDetail.vue')
  },
  {
    path: '/notes',
    name: 'Notes',
    component: () => import('../components/notes/container.vue')
  },
]

const router = new VueRouter({
  routes
})

export default router
