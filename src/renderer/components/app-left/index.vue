<template>
  <div class="side">
    <div class="side__hd">{{ config.name }}</div>
    <div class="side__bd">
      <libraries />
      <notebooks />
    </div>
    <div class="side__ft">
      <create-notebook />
    </div>
  </div>
</template>

<script>
import libraries from "../libraries";
import notebooks from "../notebooks";
import createNotebook from "../create-notebook";
import { mapState } from "vuex";

export default {
  name: "left",
  components: {
    libraries,
    notebooks,
    createNotebook,
  },
  computed: {
    ...mapState({
      config: (state) => state.app.config,
    }),
  },
};
</script>

<style lang="scss" scoped>
.side {
  position: relative;
  width: 100%;
  height: 100%;
  padding: 35px 0;

  &__hd {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 35px;
    border-bottom: 1px solid var(--border-color);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
  }

  &__bd {
    width: 100%;
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
  }

  &__ft {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 35px;
    border-top: 1px solid var(--border-color);
    display: flex;
    align-items: center;
    padding: 0 10px;
  }
}
</style>
