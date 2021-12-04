const routes = [
  {
    path: "/login",
    name: "Login",
    component: () =>
      import(/* webpackChunkName: "login" */ "../views/Login.vue"),
  },
  {
    path: "/logout",
    name: "Logout",
    component: () =>
      import(/* webpackChunkName: "logout" */ "../views/Logout.vue"),
  },
  {
    path: "/supervisors",
    name: "Supervisors.index",
    component: () =>
      import(/* webpackChunkName: "supervisors.index" */ "../views/supervisors/Index.vue"),
  },
];

export default routes;
