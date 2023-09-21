import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/public/Home.vue'
import Images from '../views/public/Images.vue'
import Containers from '../views/public/Containers.vue'
import Applications from '../views/public/Applications.vue'


Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/images',
    name: 'Images',
    component: Images,
  },
  {
    path: '/images/:search',
    component: Images,
    props: true,
  },
  {
    path: '/containers',
    name: 'Containers',
    component: Containers
  },
  {
    path: '/applications',
    name: 'Applications',
    component: Applications,
    children:[
      {
        path:"pods",
        component:()=>import("../views/public/Applications/PodsList.vue")
      },
      {
        path:"applications",
        component:()=>import("../views/public/Applications/ApplicationList.vue")
      },      {
        path:"deployments",
        component:()=>import("../views/public/Applications/DeploymentList.vue")
      },      {
        path:"services",
        component:()=>import("../views/public/Applications/ServiceList.vue")
      }
    ]
  },
]

const router = new VueRouter({
  routes
})

export default router
