const routes = [
  {
    path: "/sellers",
    name: "Sellers.index",
    component: () =>
      import(
        /* webpackChunkName: "sellers.index" */ "../views/sellers/Index.vue"
      ),
    children: [
      {
        path: "create",
        name: "Sellers.create",
        component: () =>
          import(
            /* webpackChunkName: "sellers.create" */ "../views/sellers/Create.vue"
          ),
      },
      {
        path: ":user_name",
        name: "Sellers.show",
        component: () =>
          import(
            /* webpackChunkName: "sellers.show" */ "../views/sellers/Show.vue"
          ),
      },
    ],
  },
];

export default routes;
