import Vue from "vue";
import VueRouter from "vue-router";
import store from "../store";
import supervisorsRoutes from "./supervisors";
import rolesRoutes from './roles';

Vue.use(VueRouter);

const mainRoutes = [
  {
    path: "/",
    name: "Home",
    component: ()=>import(/* webpackChunkName: "home" */"../views/Home.vue"),
  },
];

const routes = [
  ...mainRoutes,
  ...supervisorsRoutes,
  ...rolesRoutes,
  {
    path: "/unauthorized",
    name: "Unauthorized",
    component: () => import(/* webpackChunkName: "unauthorized" */ "../views/Unauthorized.vue"),
  },
  {
    path: "*",
    name: "NotFound",
    component: () => import(/* webpackChunkName: "notfound" */ "../views/NotFound.vue"),
  },
];


const router = new VueRouter({
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      const position = {};
      if (to.hash) {
        position.selector = to.hash;
        if (document.querySelector(to.hash)) {
          return position;
        }
        return false;
      }
      return { x: 0, y: 0 };
    }
  },
});

router.beforeEach((to, from, next) => {
  let isAuthenticated = store.getters["Supervisors/isAuthenticated"];
  if (to.name == "Login" && isAuthenticated) next({ name: "Home" });
  else if (to.name !== "Login" && !isAuthenticated) {
    next({ name: "Login", query: { next: to.name } });
  } else next();
});

export default router;
