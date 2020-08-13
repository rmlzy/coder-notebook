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
import left from "./components/left";
import middle from "./components/middle";
import right from "./components/right";
import { getNotebooks } from "@/helpers/util";

export default {
  name: "home-index",
  components: {
    left,
    middle,
    right,
  },
  async mounted() {
    const notebooks = await getNotebooks();
    await this.$store.dispatch("app/setNotebooks", notebooks);
  },
};
</script>

<style lang="scss" scoped>
@import "./index";
</style>
