const routes = [
  {
    path: "/login",
    name: "Login",
    component: () =>
      import(/* webpackChunkName: "login" */ "../views/Login.vue"),
  },
  {
    path: '/logout',
    name: 'Logout',
    component: () => import(/* webpackChunkName: "logout" */'../views/Logout.vue')
  }
];

export default routes;
