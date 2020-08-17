<template>
  <div class="nb">
    <div class="nb-left">
      <left />
    </div>
    <div class="nb-middle">
      <middle />
    </div>
    <div class="nb-right">
      <right />
    </div>
  </div>
</template>

<script>
import { init, getNotebooks } from "@/helpers/util";
import left from "./components/left";
import middle from "./components/middle";
import right from "./components/right";

export default {
  name: "home-index",
  components: {
    left,
    middle,
    right,
  },
  async mounted() {
    await init();
    await this.$store.dispatch("app/refreshNotebooks");
  },
};
</script>

<style lang="scss" scoped>
@import "./index";
</style>
