const routes = [
  {
    path: "/",
    redirect: "/pints",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "/pints",
        component: () => import("src/pages/PageHome.vue"),
        name: 'Home'
      },
      {
        path: "/about",
        component: () => import("src/pages/PageAbout.vue"),
        name: 'About'
      },
      {
        path: "pints/:pintId",
        component: () => import("src/pages/PageTweet.vue"),
        name: 'Tweet',
        props: true,
      },
      {
        path: "/auth",
        component: () => import("src/pages/auth/UserAuth.vue"),
        name: 'Authentication',
        props: true,
        meta: { requiresUnauth: true }
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/Error404.vue"),
  },
];

export default routes;
