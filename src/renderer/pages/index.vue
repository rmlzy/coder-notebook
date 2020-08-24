<template>
  <div v-if="config.version" :class="{ nb: true, 'has-bg': config.bg, [config.bg]: config.bg }">
    <multipane style="width: 100%;" @paneResizeStop="onResizeStop">
      <div id="js_left" class="nb-left" :style="{ width: config.leftWidth }" v-if="pane === 3">
        <app-left />
      </div>
      <multipane-resizer></multipane-resizer>
      <div id="js_middle" class="nb-middle" :style="{ width: config.middleWidth }" v-if="pane >= 2">
        <app-middle />
      </div>
      <multipane-resizer></multipane-resizer>
      <div class="nb-right">
        <app-right />
      </div>
    </multipane>

    <preference :visible="preferenceVisible" @cancel="closePreferenceModal" @ok="closePreferenceModal" />
  </div>
</template>

<script>
import { mapState } from "vuex";
import { ipcRenderer, shell } from "electron";
import { Multipane, MultipaneResizer } from "vue-multipane";
import { init, getConfig, setConfig } from "@/helpers/util";
import i18n from "@/i18n";
import appLeft from "@/components/app-left";
import appMiddle from "@/components/app-middle";
import appRight from "@/components/app-right";
import preference from "@/components/preference";

export default {
  name: "home-index",
  components: {
    appLeft,
    appMiddle,
    appRight,
    preference,
    Multipane,
    MultipaneResizer,
  },
  data() {
    return {
      preferenceVisible: false,
    };
  },
  computed: {
    ...mapState({
      config: (state) => state.app.config,
      pane: (state) => state.app.pane,
    }),
  },
  async created() {
    await init();
  },
  async mounted() {
    const config = await getConfig();
    if (config.language) {
      i18n.locale = config.language;
    }
    if (config.name) {
      document.title = config.name;
    }
    if (config.theme) {
      document.body.setAttribute("class", `theme-${config.theme}`);
    }
    await this.$store.dispatch("app/setConfig", config);
    await this.$store.dispatch("app/initSelected");

    ipcRenderer.on("click-menu-save", () => {
      console.log("receive click menu save");
    });

    ipcRenderer.on("click-menu-preference", () => {
      if (!this.preferenceVisible) {
        this.preferenceVisible = true;
      }
    });

    // 在默认浏览器中打开链接
    document.addEventListener("click", (event) => {
      if (event.target.tagName === "A" && event.target.href.startsWith("http")) {
        event.preventDefault();
        shell.openExternal(event.target.href);
      }
    });
  },
  methods: {
    async onResizeStop(pane, container, size) {
      if (pane.id === "js_left") {
        await setConfig("leftWidth", size);
      }
      if (pane.id === "js_middle") {
        await setConfig("middleWidth", size);
      }
    },

    closePreferenceModal() {
      this.preferenceVisible = false;
    },
  },
};
</script>

<style lang="less" scoped>
@import "./index";
</style>
