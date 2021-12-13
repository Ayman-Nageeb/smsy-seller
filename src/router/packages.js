const routes = [
  {
    path: "/packages",
    name: "Packages.index",
    component: () =>
      import(
        /* webpackChunkName: "packages.index" */ "../views/packages/Index.vue"
      ),
  },
  {
    path: "/my-packages",
    name: "MyPackages.index",
    component: () =>
      import(
        /* webpackChunkName: "subscriptions" */ "../views/seller/packages/Index.vue"
      ),
    children: [
      {
        path: "create",
        name: "MyPackages.create",
        component: () =>
          import(
            /* webpackChunkName: "profile" */ "../views/seller/packages/Create.vue"
          ),
      },
      {
        path: ":id",
        name: "MyPackages.show",
        component: () =>
          import(
            /* webpackChunkName: "profile" */ "../views/seller/packages/Show.vue"
          ),
      },
    ],
  },
];

export default routes;
