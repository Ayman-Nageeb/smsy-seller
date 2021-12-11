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
      import(
        /* webpackChunkName: "supervisors.index" */ "../views/supervisors/Index.vue"
      ),
    children: [
      {
        path: "create",
        name: "Supervisors.create",
        component: () =>
          import(
            /* webpackChunkName: "supervisors.create" */ "../views/supervisors/Create.vue"
          ),
      },
      {
        path: ":user_name",
        name: "Supervisors.show",
        component: () =>
          import(
            /* webpackChunkName: "supervisors.show" */ "../views/supervisors/Show.vue"
          ),
      },
    ],
  },
];

export default routes;
