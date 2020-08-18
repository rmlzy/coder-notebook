<template>
  <div class="nb">
    <multipane style="width: 100%;" @paneResizeStop="onResizeStop">
      <div id="js_left" class="nb-left" :style="{ width: config.leftWidth }" v-if="pane === 3">
        <left />
      </div>
      <multipane-resizer></multipane-resizer>
      <div id="js_middle" class="nb-middle" :style="{ width: config.middleWidth }" v-if="pane >= 2">
        <middle />
      </div>
      <multipane-resizer></multipane-resizer>
      <div class="nb-right">
        <right />
      </div>
    </multipane>
  </div>
</template>

<script>
import { Multipane, MultipaneResizer } from "vue-multipane";
import { init, getConfig, setConfig } from "@/helpers/util";
import left from "./components/left";
import middle from "./components/middle";
import right from "./components/right";
import { mapState } from "vuex";

export default {
  name: "home-index",
  components: {
    left,
    middle,
    right,
    Multipane,
    MultipaneResizer,
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
    await this.$store.dispatch("app/setConfig", config);
    await this.$store.dispatch("app/refreshNotebooks");
    await this.$store.dispatch("app/selectNotebook", "Inbox");
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
  },
};
</script>

<style lang="less" scoped>
@import "./index";
</style>
