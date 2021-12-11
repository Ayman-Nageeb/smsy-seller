const routes = [
  {
    path: "/sender-ids",
    name: "SenderIds.index",
    component: () =>
      import(/* webpackChunkName: "sender-ids.index" */ "../views/senderIds/Index.vue"),
    children: [
      {
        path: "create",
        name: "SenderIds.create",
        component: () =>
          import(
            /* webpackChunkName: "sender-ids.create" */ "../views/senderIds/Create.vue"
          ),
      },
    ],
  },
];

export default routes;
