const routes = [
  {
    path: "/clients",
    name: "Clients.index",
    component: () =>
      import(
        /* webpackChunkName: "clients.index" */ "../views/clients/Index.vue"
      ),
    children: [
      {
        path: "create",
        name: "Clients.create",
        component: () =>
          import(
            /* webpackChunkName: "clients.create" */ "../views/clients/Create.vue"
          ),
      },
      {
        path: ":user_name",
        name: "Clients.show",
        component: () =>
          import(
            /* webpackChunkName: "clients.show" */ "../views/clients/Show.vue"
          ),
      },
    ],
  },
];

export default routes;