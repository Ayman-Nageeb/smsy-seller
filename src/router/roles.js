const routes = [
  {
    path: "/roles",
    name: "Roles.index",
    component: () => import(/* webpackChunkName: "roles.index" */ "../views/Roles.vue"),
  },
];

export default routes;
