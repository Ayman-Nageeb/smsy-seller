import Vue from "vue";
import VueRouter from "vue-router";
import store from "../store";
import Home from "../views/Home.vue";
import supervisorsRoutes from "./supervisors";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  ...supervisorsRoutes,
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
