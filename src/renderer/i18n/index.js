import Vue from "vue";
import VueI18n from "vue-i18n";
import zhCN from "./zh-CN";
import zhTW from "./zh-TW";
import enUS from "./en-US";

Vue.use(VueI18n);

export const messages = {
  "zh-CN": zhCN,
  "zh-TW": zhTW,
  "en-US": enUS,
};

const i18n = new VueI18n({
  locale: "zh-CN",
  messages,
});

export default i18n;
