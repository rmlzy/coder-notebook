<template>
  <div class="nb">
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
import { ipcRenderer } from "electron";
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
  async mounted() {
    await init();
    const config = await getConfig();
    if (config.language) {
      i18n.locale = config.language;
    }
    await this.$store.dispatch("app/setConfig", config);
    await this.$store.dispatch("app/refreshNotebooks");
    await this.$store.dispatch("app/selectNotebook", "Inbox");

    ipcRenderer.on("click-menu-save", () => {
      console.log("receive click menu save");
    });

    ipcRenderer.on("click-menu-preference", () => {
      if (!this.preferenceVisible) {
        this.preferenceVisible = true;
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
.nb {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;

  &-left {
    position: relative;
    width: 200px;
    min-width: 200px;
    max-width: 300px;
    color: var(--left-color);
    background: var(--left-bg);
  }

  &-middle {
    position: relative;
    width: 200px;
    min-width: 200px;
    max-width: 300px;
    border-left: 1px solid var(--border-color);
    color: var(--middle-color);
    background: var(--middle-bg);
  }

  &-right {
    flex: 1;
    position: relative;
    border-left: 1px solid var(--border-color);
    color: var(--right-color);
    background: var(--right-bg);
  }
}
</style>
