const routes = [
  {
    path: "/groups",
    name: "Groups.index",
    component: () =>
      import(/* webpackChunkName: "groups.index" */ "../views/groups/Index.vue"),
    children: [
      {
        path: "create",
        name: "Groups.create",
        component: () =>
          import(
            /* webpackChunkName: "groups.create" */ "../views/groups/Create.vue"
          ),
      },
    ],
  },
];

export default routes;
