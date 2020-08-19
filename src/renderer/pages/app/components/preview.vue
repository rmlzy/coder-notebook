<template>
  <div class="preview">
    <div class="preview__title">{{ title }}</div>
    <div class="markdown-body" v-html="html"></div>
  </div>
</template>

<script>
export default {
  name: "preview",
  props: ["title", "html"],
};
</script>

<style lang="scss" scoped>
.preview {
  padding: 0 30px;
  word-break: break-all;

  &__title {
    font-size: 18px;
    font-weight: 500;
    padding: 15px 10px;
    border-bottom: 1px solid var(--border-color);
    margin-bottom: 10px;
  }
}
</style>
