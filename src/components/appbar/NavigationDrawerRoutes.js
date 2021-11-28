export default [
  {
    titleKey: "roles",
    icon: "mdi-account-supervisor-circle-outline",
    name: "Roles.index",
    hasOneOf: [
      "roles::add",
      "roles::remove",
      "roles::retrieve",
      "roles::update",
      "roles::view_permissions",
      "roles::set_permissions",
    ],
  },
];
