const routes = [
  {
    path: "/packages",
    name: "Packages.index",
    component: () =>
      import(
        /* webpackChunkName: "packages.index" */ "../views/packages/Index.vue"
      ),
    children: [
      {
        path: "create",
        name: "Packages.create",
        component: () =>
          import(
            /* webpackChunkName: "packages.create" */ "../views/packages/Create.vue"
          ),
      },
      {
        path: ":id",
        name: "Packages.show",
        component: () =>
          import(
            /* webpackChunkName: "packages.create" */ "../views/packages/Show.vue"
          ),
      },
    ],
  },
];

export default routes;
