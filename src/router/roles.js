const routes = [
  {
    path: "/roles",
    name: "Roles.index",
    component: () =>
      import(/* webpackChunkName: "roles.index" */ "../views/roles/Index.vue"),
    children: [
      {
        path: "create",
        name: "Roles.create",
        component: () =>
          import(
            /* webpackChunkName: "roles.create" */ "../views/roles/Create.vue"
          ),
      },
    ],
  },
];

export default routes;
