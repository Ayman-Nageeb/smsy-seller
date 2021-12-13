const routes = [
  {
    path: "/sender-ids",
    name: "SenderIds.index",
    component: () =>
      import(/* webpackChunkName: "sender-ids.index" */ "../views/seller/SenderIds.vue"),
    children: [
      {
        path: "create",
        name: "SenderIds.create",
        component: () =>
          import(
            /* webpackChunkName: "sender-ids.create" */ "../views/seller/CreateSenderId.vue"
          ),
      },
    ],
  },
];

export default routes;
