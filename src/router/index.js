import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import StepsCalculator from "../views/StepsCalculator.vue";
import Steps2 from "../views/Steps2.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      // 1. Catch the root "/" and send it to "/en"
      path: "/",
      redirect: "/en",
    },
    {
      path: "/:locale(en|de|fr)?",
      children: [
        {
          path: "",
          name: "home",
          component: Steps2,
        },
        // {
        //   path: "/",
        //   name: "home2",
        //   component: StepsCalculator,
        // },
        {
          path: "v2",
          name: "v2",
          component: HomeView,
        },
        {
          path: "about",
          name: "about",
          // route level code-splitting
          // this generates a separate chunk (About.[hash].js) for this route
          // which is lazy-loaded when the route is visited.
          component: () => import("../views/AboutView.vue"),
        },
      ],
    },
    {
      // 3. Optional: Catch-all for everything else
      path: "/:pathMatch(.*)*",
      redirect: "/en",
    },
  ],
});

export default router;
