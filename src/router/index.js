import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import StepsCalculator from "../views/StepsCalculator.vue";
import Steps2 from "../views/Steps2.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: Steps2,
    },
    {
      path: "/",
      name: "home2",
      component: StepsCalculator,
    },
    {
      path: "/v2",
      name: "v2",
      component: HomeView,
    },
    {
      path: "/about",
      name: "about",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("../views/AboutView.vue"),
    },
  ],
});

export default router;
