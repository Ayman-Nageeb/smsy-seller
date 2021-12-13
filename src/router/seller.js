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
    path: "/profile",
    name: "Seller.profile",
    component: () =>
      import(/* webpackChunkName: "profile" */ "../views/seller/Profile.vue"),
  },
  {
    path: "/subscriptions",
    name: "Seller.subscriptions",
    component: () =>
      import(
        /* webpackChunkName: "subscriptions" */ "../views/seller/Subscriptions.vue"
      ),
  },
];

export default routes;
