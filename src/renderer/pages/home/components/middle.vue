<template>
  <div class="mid">
    <div class="mid__hd"></div>
    <div class="mid__bd">
      <notes />
    </div>
    <div class="mid__ft"></div>
  </div>
</template>

<script>
import notes from "./notes";

export default {
  name: "middle",
  components: {
    notes,
  },
};
</script>

<style lang="scss" scoped>
.mid {
  position: relative;
  width: 200px;
  height: 100%;
  padding: 35px 0;

  &__hd {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 35px;
    border-bottom: 1px solid #dcdfe6;
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
    border-top: 1px solid #dcdfe6;
  }
}
</style>
