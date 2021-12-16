const routes = [
  {
    path: "/reports",
    name: "Reports.index",
    component: () =>
      import(/* webpackChunkName: "Reports.index" */ "../views/reports/Index.vue"),
    children: [

    ],
  },
];

export default routes;