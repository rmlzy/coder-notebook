import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "app-index",
      component: require("@/pages/app/index").default,
    },
    {
      path: "*",
      redirect: "/",
    },
  ],
});
