import Vue from "vue";
import axios from "axios";
import Antd from "ant-design-vue";
import vClickOutside from "v-click-outside";

import App from "./App";
import router from "./router";
import store from "./store";
import i18n from "./i18n";
import "./styles/global.less";

if (!process.env.IS_WEB) {
  Vue.use(require("vue-electron"));
}

Vue.use(Antd);
Vue.use(vClickOutside);

Vue.http = Vue.prototype.$http = axios;
Vue.config.productionTip = false;

new Vue({
  components: { App },
  i18n,
  router,
  store,
  template: "<App/>",
}).$mount("#app");
