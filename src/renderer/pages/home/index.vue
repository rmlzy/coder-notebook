<template>
  <div class="nb">
    <div class="nb-left" v-if="pane === 3">
      <left />
    </div>
    <div class="nb-middle" v-if="pane >= 2">
      <middle />
    </div>
    <div class="nb-right">
      <right />
    </div>
  </div>
</template>

<script>
import { init } from "@/helpers/util";
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
  },
  computed: {
    ...mapState({
      pane: (state) => state.app.pane,
    }),
  },
  async mounted() {
    await init();
    await this.$store.dispatch("app/selectNotebook", "Inbox");
  },
};
</script>

<style lang="less" scoped>
@import "./index";
</style>
